<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static create(array $array)
 * @method static paginate(int $int)
 * @method static insert(array $array)
 * @method static updateOrCreate(array $array, array $array)
 */
class LogoKeyword extends Model
{
    protected $table = 'lt_t_u_logo_keyword';

    protected $primaryKey = 'logo_id';

    const CREATED_AT = null;

    const UPDATED_AT = null;

    protected $fillable = [
        'logo_id',
        'keyword_id',
        'type',
    ];

    public function keyword()
    {
        return $this->hasOne(Keyword::class, 'id', 'keyword_id');
    }
}
