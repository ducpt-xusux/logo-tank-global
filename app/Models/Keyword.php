<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static create(array $array)
 * @method static paginate(int $int)
 * @method static insert(array $array)
 * @method static updateOrCreate(array $array, array $array)
 */
class Keyword extends Model
{
    protected $table = 'lt_t_keywords';

    protected $fillable = [
        'id',
        'keyword',
        'reg_date',
        'update_date'
    ];

    const CREATED_AT = 'reg_date';
    const UPDATED_AT = 'update_date';

    public function keywordLanguage()
    {
        return $this->hasOne(KeywordLanguage::class, 'keyword_id', 'id');
    }
}
