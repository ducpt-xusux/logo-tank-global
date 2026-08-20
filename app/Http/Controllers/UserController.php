<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class UserController extends DefaultController
{
    protected function _validateRule($model, $action = 'store'): array
    {
        return [
            'name' => 'required',
            'email' => [
                'required',
                'email',
                $action === 'store'
                ? Rule::unique('users')
                : Rule::unique('users')->ignore($model->id),
            ],
            'password' => $action === 'store' ? 'required|min:4' : 'nullable|min:4',
            'role' => 'required',
        ];
    }

    protected function _extendIndexQuery($query): array
    {
        $roles = request('role');

        if ($roles) {
            $query->whereIn('role', explode(',', $roles));
        }

        return [$query, ['role' => $roles ?? null]];
    }
    /**
     * createPaymentIntent
     * @param Request $request
     * @return JsonResponse
     */
    public function createPaymentIntent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payment_method' => ['required', 'string', 'in:credit_card,google_pay'],
            'email' => ['nullable', 'email', 'max:255'],
        ]);

        $checkoutSummary = session('checkoutSummary');
        $totalAmount = (float) (
            $checkoutSummary['totalAmount']
            ?? $checkoutSummary['grandTotal']
            ?? 0
        );

        if (!$checkoutSummary || $totalAmount <= 0) {
            return response()->json([
                'message' => 'Checkout session is invalid or expired.',
            ], 422);
        }

        $currency = strtolower((string) ($checkoutSummary['currency'] ?? 'usd'));
        $currency = str_replace(['đ', 'vnđ'], ['d', 'vnd'], $currency);
        $isZeroDecimal = in_array($currency, ['vnd', 'jpy'], true);
        $amount = $isZeroDecimal
            ? max(1, (int) round($totalAmount))
            : max(1, (int) round($totalAmount * 100));

        Stripe::setApiKey((string) env('STRIPE_SECRET'));

        $intent = PaymentIntent::create([
            'amount' => $amount,
            'currency' => $currency,
            'automatic_payment_methods' => ['enabled' => true],
            'receipt_email' => $validated['email'] ?? null,
            'metadata' => [
                'user_id' => (string) Auth::id(),
                'locale' => app()->getLocale(),
            ],
        ]);

        return response()->json([
            'id' => $intent->id,
            'client_secret' => $intent->client_secret,
            'status' => $intent->status,
        ]);
    }

    public function customerInfo()
    {
        $user = Auth::user();

        return Inertia::render('user/customer-info', [
            'user' => [
                'id' => $user->id,
                'company_name' => $user->company_name,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'address' => $user->address,
                'address_line_1' => $user->address_line_1,
                'address_line_2' => $user->address_line_2,
                'postal_code' => $user->postal_code,
            ],
        ]);
    }

    public function updateCustomerInfo(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'company_name' => ['nullable', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:255'],
            'address_line_1' => ['nullable', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:20'],
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', __('Customer information updated successfully.'));
    }
}
