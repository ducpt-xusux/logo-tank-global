<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @method static create(array $array)
 * @method static paginate(int $int)
 * @method static insert(array $array)
 * @method static updateOrCreate(array $array, array $array)
 */
class LogoLanguage extends Model
{
    protected $table = 'lt_logo_languages';

    protected $fillable = [
        'logo_id',
        'create_by',
        'vi',
        'en',
        'ja',
    ];

    public function logo(): BelongsTo
    {
        return $this->belongsTo(Logo::class, 'logo_id', 'logo_id');
    }
}
