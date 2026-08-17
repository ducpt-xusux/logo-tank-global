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
class KeywordLanguage extends Model
{
    protected $table = 'lt_t_keyword_languages';
    protected $primaryKey = 'keyword_id';
    protected $fillable = [
        'keyword_id',
        'vi',
        'en',
        'ja'
    ];

}
