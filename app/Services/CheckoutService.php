<?php

namespace App\Services;

use App\Http\Requests\ProcessCheckoutRequest;
use App\Models\Logo;
use App\Models\Package;
use App\Models\Setting;
use Illuminate\Validation\ValidationException;

class CheckoutService
{

    /**
     * Summary of processCheckout
     * @param ProcessCheckoutRequest $request
     * @return array{computedTotalFromItems: float, currency: string, diffFromComputed: float, items: array, submittedTotal: float, subtotal: float, tax: float, taxRate: float, totalAmount: float, totalIncludesTax: bool, type: mixed|array{computedTotalFromItems: float, currency: string, diffFromComputed: float, items: array, submittedTotal: float, subtotal: float, tax: float, taxRate: float, totalAmount: float, totalIncludesTax: bool, type: string}}
     */
    public function processCheckout(ProcessCheckoutRequest $request)
    {
        $validated = $request->validated();
        $type = $validated['type'] ?? 'logo';
        $locale = app()->getLocale();
        $manualPrice = $this->getLocalizedSettingPrice('logo_manual_price', $locale, 0);
        $motionPrice = $this->getLocalizedSettingPrice('logo_motion_price', $locale, 0);
        $taxRate = $this->getLocalizedSettingPrice('tax', $locale, 10);

        $items = collect($validated['items']);
        $itemSummaries = collect();

        if ($type === 'package') {
            $packageIds = $items->pluck('package_id')->filter()->unique()->values();
            $packages = Package::query()->whereIn('id', $packageIds)->get()->keyBy('id');

            $itemSummaries = $items->map(function ($item) use ($packages, $manualPrice, $motionPrice, $locale) {
                $pkgId = $item['package_id'];
                $pkg = $packages->get($pkgId);
                $pkgBasePrice = $pkg ? (float) $pkg->getPriceForLocale($locale) : 0;
                $quantity = $item['quantity'] ?? 1;

                $manual = ! empty($item['logoManual']) ? $manualPrice : 0;
                $motion = ! empty($item['logoMotion']) ? $motionPrice : 0;
                $mainTextPrice = ! empty($item['mainText']) ? $manualPrice : 0;

                return [
                    'package_id' => $pkgId,
                    'product_code' => $pkg ? $pkg->product_code : null,
                    'packageName' => $pkg ? $pkg->key : 'Unknown Package',
                    'quantity' => $quantity,
                    'logoManual' => (bool) $item['logoManual'],
                    'logoMotion' => (bool) $item['logoMotion'],
                    'mainText' => (bool) ($item['mainText'] ?? false),
                    'basePrice' => $pkgBasePrice,
                    'logoManualPrice' => (float) $manual,
                    'logoMotionPrice' => (float) $motion,
                    'mainTextPrice' => (float) $mainTextPrice,
                    'lineTotal' => (float) (($pkgBasePrice + $manual + $motion + $mainTextPrice) * $quantity),
                ];
            });
        } else {
            $logoPrice = $this->getLocalizedSettingPrice('logo_price', $locale, 0);
            $logoIds = $items->pluck('productId')->filter()->unique()->values();
            $availableLogoIds = Logo::query()
                ->whereIn('logo_id', $logoIds)
                ->pluck('logo_id')
                ->map(fn ($id) => (int) $id)
                ->all();

            $missingLogoIds = $logoIds->diff($availableLogoIds)->values()->all();
            if (empty($missingLogoIds) == false) {
                throw ValidationException::withMessages([
                    'items' => 'Some logos are no longer available for checkout.',
                ]);
            }

            $itemSummaries = $items->map(function ($item) use ($logoPrice, $manualPrice, $motionPrice) {
                $manual = ! empty($item['logoManual']) ? $manualPrice : 0;
                $motion = ! empty($item['logoMotion']) ? $motionPrice : 0;

                return [
                    'productId' => (int) $item['productId'],
                    'subName' => $item['subName'] ?? '',
                    'mainName' => $item['mainName'] ?? '',
                    'logoManual' => (bool) $item['logoManual'],
                    'logoMotion' => (bool) $item['logoMotion'],
                    'logoPrice' => (float) $logoPrice,
                    'logoManualPrice' => (float) $manual,
                    'logoMotionPrice' => (float) $motion,
                    'lineTotal' => (float) ($logoPrice + $manual + $motion),
                ];
            });
        }

        $computedTotalFromItems = (float) $itemSummaries->sum('lineTotal');
        $submittedTotal = isset($validated['submittedTotal']) ? (float) $validated['submittedTotal'] : $computedTotalFromItems;
        $totalIncludesTax = (bool) ($validated['totalIncludesTax'] ?? true);

        if ($totalIncludesTax) {
            $subTotal = round(($submittedTotal * 100) / (100 + $taxRate), 2);
            $tax = round($submittedTotal - $subTotal, 2);
            $totalAmount = round($subTotal + $tax, 2);
        } else {
            $subTotal = round($submittedTotal, 2);
            $tax = round(($subTotal * $taxRate) / 100, 2);
            $totalAmount = round($subTotal + $tax, 2);
        }

        $diffFromComputed = round(abs($submittedTotal - $computedTotalFromItems), 2);

        return [
            'type' => $type,
            'items' => $itemSummaries->values()->all(),
            'submittedTotal' => round($submittedTotal, 2),
            'computedTotalFromItems' => round($computedTotalFromItems, 2),
            'diffFromComputed' => $diffFromComputed,
            'subtotal' => $subTotal,
            'tax' => $tax,
            'taxRate' => $taxRate,
            'totalAmount' => $totalAmount,
            'totalIncludesTax' => $totalIncludesTax,
            'currency' => $this->currencyByLocale($locale),
        ];
    }

    public function calculatePackageData(array $items, string $language): array
    {
        $basePrice = 0;
        $motionPriceTotal = 0;
        $manualPriceTotal = 0;

        $motionPriceUnit = $this->getLocalizedSettingPrice('logo_motion_price', $language, 0);
        $manualPriceUnit = $this->getLocalizedSettingPrice('logo_manual_price', $language, 0);

        $details = [];

        foreach ($items as $item) {
            $package = Package::find($item['packageId']);
            $pricePerUnit = $package ? ($package->prices[$language] ?? 0) : 0;

            $qty = $item['quantity'] ?? 1;

            $itemBase = $pricePerUnit * $qty;
            $itemMotion = (! empty($item['logoMotion'])) ? ($motionPriceUnit * $qty) : 0;
            $itemManual = (! empty($item['logoManual'])) ? ($manualPriceUnit * $qty) : 0;

            $basePrice += $itemBase;
            $motionPriceTotal += $itemMotion;
            $manualPriceTotal += $itemManual;

            $details[] = [
                'packageId' => $item['packageId'],
                'package_id' => $item['packageId'],
                'packageKey' => $item['packageKey'],
                'productCode' => $package ? $package->product_code : null,
                'product_code' => $package ? $package->product_code : null,
                'packageName' => $package ? $package->name : 'Package',
                'quantity' => $qty,
                'basePrice' => $itemBase,
                'motionPrice' => $itemMotion,
                'manualPrice' => $itemManual,
                'logo_motion_price' => $itemMotion,
                'logo_manual_price' => $itemManual,
                'logoMotion' => ! empty($item['logoMotion']),
                'logoManual' => ! empty($item['logoManual']),
                'total' => $itemBase + $itemMotion + $itemManual,
            ];
        }

        $subtotal = round($basePrice + $motionPriceTotal + $manualPriceTotal, 2);
        $tax = round($subtotal * 0.1, 2); // 10% VAT
        $totalAmount = round($subtotal + $tax, 2);

        return [
            'type' => 'package',
            'items' => $details,
            'subtotal' => $subtotal,
            'computedTotalFromItems' => $subtotal,
            'tax' => $tax,
            'grandTotal' => $totalAmount,
            'totalAmount' => $totalAmount,
            'currency' => $language === 'vi' ? 'VND' : ($language === 'ja' ? 'JPY' : 'USD'),
        ];
    }

    private function getLocalizedSettingPrice(string $key, string $locale, float $default = 0): float
    {
        $value = Setting::query()->where('key', $key)->value('value');
        if (! $value) {
            return $default;
        }

        $decoded = json_decode($value, true);
        if (! is_array($decoded)) {
            return (float) $default;
        }

        if (isset($decoded[$locale]) && is_numeric($decoded[$locale])) {
            return (float) $decoded[$locale];
        }

        if (isset($decoded['en']) && is_numeric($decoded['en'])) {
            return (float) $decoded['en'];
        }

        $firstNumeric = collect($decoded)->first(fn ($item) => is_numeric($item));

        return is_numeric($firstNumeric) ? (float) $firstNumeric : $default;
    }

    private function currencyByLocale(string $locale): string
    {
        if ($locale === 'ja') {
            return 'JPY';
        }

        if ($locale === 'vi') {
            return 'VND';
        }

        return 'USD';
    }
}
