<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static create(array $array)
 * @method static paginate(int $int)
 * @method static insert(array $array)
 * @method static updateOrCreate(array $array, array $array)
 */
class Recommend extends Model
{
    protected $table = 'lt_t_recommend';

    protected $fillable = [
        'logo_id',
        'suggest_1',
        'suggest_2',
        'suggest_3',
        'suggest_4',
        'suggest_5',
        'suggest_6',
        'suggest_7',
        'suggest_8',
        'suggest_9',
        'suggest_10'
    ];
}
