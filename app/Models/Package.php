<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $table = 'lt_m_packages';

    protected $fillable = [
        'category',
        'key',
        'product_code',
        'prices',
        'is_active',
    ];

    protected $casts = [
        'prices' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the price for a specific locale.
     */
    public function getPriceForLocale($locale)
    {
        return $this->prices[$locale] ?? ($this->prices['en'] ?? 0);
    }
}
