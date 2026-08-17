<?php

namespace App\Services;

use App\Models\Logo;
use App\Models\Order;
use App\Models\OrderLogo;
use App\Models\OrderPackage;
use App\Models\OrderStatusLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function createOrder(array $checkoutSummary, array $paymentData): Order
    {
        $paymentType = $this->resolvePaymentType($paymentData['payment_method']);
        $intentStatus = strtolower((string) ($paymentData['payment_intent_status'] ?? ''));
        $isPaid = in_array($intentStatus, ['succeeded', 'processing', 'requires_capture'], true);
        $now = now();

        return DB::transaction(function () use ($checkoutSummary, $paymentData, $paymentType, $isPaid, $now) {
            $order = Order::query()->create([
                'user_id' => Auth::id(),
                'price' => (float) ($checkoutSummary['computedTotalFromItems'] ?? 0),
                'tax' => (float) ($checkoutSummary['tax'] ?? 0),
                'tax_rate' => (int) ($checkoutSummary['taxRate'] ?? 0),
                'type' => ($checkoutSummary['type'] ?? 'logo') === 'package' ? Order::TYPE_PACKAGE : Order::TYPE_LOGO,
                'status' => Order::STATUS_ORDERED,
                'payment_status' => $isPaid ? Order::PAY_PAID : Order::PAY_UNPAID,
                'payment_date' => $isPaid ? $now : null,
                'payment_type' => $paymentType,
                'payment_intent' => $paymentData['payment_intent'] ?? null,
                'payment_intent_client_secret' => $paymentData['payment_intent_client_secret'] ?? null,
                'purchase_date' => $isPaid ? $now : null,
                'sub_total' => (float) ($checkoutSummary['subtotal'] ?? 0),
                'total_amount' => (float) ($checkoutSummary['totalAmount'] ?? 0),
                'currency' => (string) ($checkoutSummary['currency'] ?? 'USD'),
            ]);

            if (($checkoutSummary['type'] ?? 'logo') === 'package') {
                foreach ($checkoutSummary['items'] as $item) {
                    OrderPackage::query()->create([
                        'order_id' => $order->id,
                        'package_id' => $item['package_id'],
                        'product_code' => $item['product_code'] ?? null,
                        'quantity' => $item['quantity'] ?? 1,
                        'logo_manual' => ! empty($item['logoManual']),
                        'logo_motion' => ! empty($item['logoMotion']),
                        'main_text' => ! empty($item['mainText']),
                        'price' => (float) ($item['basePrice'] ?? 0),
                        'logo_manual_price' => (float) ($item['logoManualPrice'] ?? 0),
                        'logo_motion_price' => (float) ($item['logoMotionPrice'] ?? 0),
                        'main_text_price' => (float) ($item['mainTextPrice'] ?? 0),
                        'currency' => (string) ($checkoutSummary['currency'] ?? 'USD'),
                    ]);
                }
            } else {
                foreach ($checkoutSummary['items'] as $item) {
                    OrderLogo::query()->create([
                        'logo_id' => (int) $item['productId'],
                        'order_id' => (int) $order->id,
                        'logo_manual' => ! empty($item['logoManual']) ? 1 : 0,
                        'logo_motion' => ! empty($item['logoMotion']) ? 1 : 0,
                        'sub_name' => $item['subName'] ?? '',
                        'main_name' => $item['mainName'] ?? '',
                        'logo_manual_price' => (float) ($item['logoManualPrice'] ?? 0),
                        'logo_motion_price' => (float) ($item['logoMotionPrice'] ?? 0),
                    ]);
                    Logo::query()
                        ->where('logo_id', (int) $item['productId'])
                        ->update(['state' => $isPaid ? Logo::SOLD_OUT : Logo::NEGOTIATION]);
                }
            }

            $order->update([
                'invoice_num' => $this->generateInvoice($order),
            ]);

            OrderStatusLog::query()->create([
                'order_id' => $order->id,
                'status' => Order::STATUS_ORDERED,
            ]);

            return $order;
        });
    }

    public function resolvePaymentType(string $paymentMethod): ?int
    {
        return match ($paymentMethod) {
            'credit_card', 'google_pay' => 1,
            'qr_code' => 2,
            'momo' => 3,
            'zalopay' => 4,
            'vnpay' => 5,
            default => null,
        };
    }

    public function generateInvoice(Order $order): string
    {
        $now = now()->format('ymd');

        return 'I'.$order->user_id.'O'.$order->id.$order->payment_type.$order->type.$now;
    }
}
