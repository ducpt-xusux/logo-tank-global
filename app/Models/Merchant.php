<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @method static create(array $array)
 * @method static paginate(int $int)
 * @method static insert(array $array)
 */
class Merchant extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'memo',
    ];
}
