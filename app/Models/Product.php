<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @method static create(array $array)
 * @method static paginate(int $int)
 * @method static insert(array $array)
 */
class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'id_no',
        'vendor_id',
        'dimension',
        'subject_id',
        'unit',
        'price',
        'daily_price',
        'net_price',
        'net_daily_price',
        'cost_price',
        'cost_daily_price',
        'invoice_price',
        'invoice_daily_price',
        'memo',
        'type',
        'kind',
    ];

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }
}
