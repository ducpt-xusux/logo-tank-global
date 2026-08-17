<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProcessCheckoutRequest;
use App\Http\Resources\LogoResource;
use App\Http\Resources\OrderStatusLogResource;
use App\Models\Logo;
use App\Models\Order;
use App\Services\CheckoutService;
use App\Services\OrderService;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends DefaultController
{
    protected CheckoutService $checkoutService;

    protected OrderService $orderService;

    public function __construct(CheckoutService $checkoutService, OrderService $orderService)
    {
        $this->checkoutService = $checkoutService;
        $this->orderService = $orderService;

        // Call parent constructor to initialize alias, model, and resource
        parent::__construct();
    }

    protected array $_searchFields = [];

    public function _extendIndexQuery(Builder $query): array
    {
        $keyword = request()->query('keyword');
        $paymentMethods = collect(config('common.payment_methods'));

        $query
            ->join('users', 'lt_t_orders.user_id', '=', 'users.id')
            ->select('lt_t_orders.*', 'users.name as user_name')
            ->with(['user', 'orderLogos.logo', 'orderPackages.package', 'statusLogs'])
            ->orderBy('id', 'DESC');

        if ($keyword) {
            $paymentSts = 0;
            $paymentType = 0;

            switch ($keyword) {
                case 'Unpaid':
                    $paymentSts = Order::PAY_UNPAID;
                    break;
                case 'Paid':
                    $paymentSts = Order::PAY_PAID;
                    break;
                default:
                    // Check against payment method names
                    $method = $paymentMethods->firstWhere('name', $keyword);
                    if ($method) {
                        $paymentType = $method['type'];
                    }
                    break;
            }

            $query->where(function (Builder $q) use ($keyword, $paymentSts, $paymentType) {
                // Manual text search fields
                $q->orWhere('users.name', 'like', "%{$keyword}%");

                if ($paymentSts) {
                    $q->orWhere('lt_t_orders.payment_status', $paymentSts);
                }
                if ($paymentType) {
                    $q->orWhere('lt_t_orders.payment_type', $paymentType);
                }
            });
        }

        return [$query, ['keyword' => $keyword]];
    }

    public function publicCart(Request $request)
    {
        $logoIds = collect(explode(',', (string) $request->query('logo_ids', '')))
            ->map(fn ($id) => (int) trim($id))
            ->filter(fn ($id) => $id > 0)
            ->unique()
            ->values();

        $logos = collect();
        if ($logoIds->isNotEmpty()) {
            $logos = Logo::query()
                ->whereIn('logo_id', $logoIds)
                ->with(['logoLanguage'])
                ->withCount('favorites')
                ->get();
        }

        return Inertia::render(
            'public/public-cart',
            [
                'logos' => LogoResource::collection($logos),
            ]
        );
    }

    public function checkOut()
    {
        $checkoutSummary = session('checkoutSummary');

        return Inertia::render(
            'user/checkout',
            [
                'checkoutSummary' => $checkoutSummary,
                'vietqr' => [
                    'uri' => config('services.vietqr.uri'),
                    'account_name' => config('services.vietqr.account_name'),
                ],
            ]
        );
    }

    public function processCheckout(ProcessCheckoutRequest $request)
    {
        try {
            $checkoutSummary = $this->checkoutService->processCheckout($request);
            session(['checkoutSummary' => $checkoutSummary]);

            return redirect()->route('my-page.checkout', [
                'locale' => app()->getLocale(),
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        }
    }

    public function submitCheckout(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'payment_method' => ['required', 'string', 'in:credit_card,google_pay,qr_code,momo,zalopay,vnpay'],
            'payment_intent' => ['nullable', 'string', 'max:255'],
            'payment_intent_client_secret' => ['nullable', 'string', 'max:255'],
            'payment_intent_status' => ['nullable', 'string', 'max:100'],
        ]);

        $checkoutSummary = session('checkoutSummary');
        if (! $checkoutSummary || empty($checkoutSummary['items'])) {
            return back()->withErrors([
                'checkout' => 'Checkout session is invalid or expired.',
            ]);
        }

        $order = $this->orderService->createOrder($checkoutSummary, $validated);

        session()->forget('checkoutSummary');

        session()->flash('order_success', [
            'id' => $order->id,
            'email' => $order->user?->email,
            'total' => $order->total_amount,
            'payment_method' => $request->payment_method,
            'logo_ids' => $order->orderLogos->pluck('logo_id')->toArray(),
        ]);

        return redirect()
            ->route('my-page.checkout', ['locale' => app()->getLocale()])
            ->with('success', 'Order submitted successfully.');
    }

    public function orderStatus(string $locale, string $id)
    {
        $order = Order::query()
            ->where('user_id', Auth::id())
            ->where(function ($query) use ($id) {
                $query->where('id', $id);
            })
            ->with(['orderLogos.logo', 'statusLogs'])
            ->firstOrFail();

        return Inertia::render('user/order-status', [
            'order' => $order,
            'logs' => OrderStatusLogResource::collection($order->statusLogs),
        ]);
    }

    public function orderStatusByInvoice(string $locale, string $invoiceNum)
    {
        $order = Order::query()
            ->where('user_id', Auth::id())
            ->where('invoice_num', $invoiceNum)
            ->with(['orderLogos.logo', 'statusLogs'])
            ->firstOrFail();

        return Inertia::render('user/order-status', [
            'order' => $order,
            'logs' => OrderStatusLogResource::collection($order->statusLogs),
        ]);
    }

    public function updateStatusOrder(Order $order)
    {
        try {
            DB::beginTransaction();

            $order->update([
                'payment_status' => Order::PAY_PAID,
                'status' => Order::STATUS_ORDERED,
                'payment_date' => now(),
                'purchase_date' => now(),
            ]);

            foreach ($order->orderLogos as $orderLogo) {
                if ($orderLogo->logo) {
                    $orderLogo->logo->update([
                        'state' => Logo::SOLD_OUT,
                    ]);
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Order updated to paid successfully.');
        } catch (Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());

            return redirect()->back()->with('error', 'Failed to update order status.');
        }
    }

    public function status(Order $order)
    {
        $order->load(['statusLogs.creator', 'user']);

        return Inertia::render('admin/order/status', [
            'order' => $order,
            'logs' => OrderStatusLogResource::collection($order->statusLogs),
        ]);
    }

    public function storeStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|integer|in:1,2,3,4,5,6',
        ]);

        $order->statusLogs()->create([
            'status' => $validated['status'],
            'created_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    public function packageCart()
    {
        return Inertia::render('public/public-package-cart', []);
    }

    public function processPackageCheckout(Request $request)
    {
        $items = $request->items;
        $language = $request->input('language', 'vi');

        $summary = $this->checkoutService->calculatePackageData($items, $language);
        session(['checkoutSummary' => $summary]);

        $locale = app()->getLocale();

        return redirect()->route('my-page.customer-info', ['locale' => $locale]);
    }

    public function packageCheckout()
    {
        $checkoutSummary = session('checkoutSummary');

        return Inertia::render('user/package-checkout', [
            'checkoutSummary' => $checkoutSummary,
            'user' => Auth::user(),
            'vietqr' => [
                'uri' => config('services.vietqr.uri'),
                'account_name' => config('services.vietqr.account_name'),
            ],
        ]);
    }
}
