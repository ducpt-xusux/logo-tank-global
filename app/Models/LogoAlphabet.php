<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static create(array $array)
 * @method static paginate(int $int)
 * @method static insert(array $array)
 * @method static updateOrCreate(array $array, array $array)
 */
class LogoAlphabet extends Model
{
    protected $table = 'lt_t_logo_alphabet';

    protected $fillable = [
        'logo_id',
        'alphabet_id'
    ];
}
