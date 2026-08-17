<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Favorite extends Model
{
    use SoftDeletes;

    protected $table = 'lt_t_favorites';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'logo_id',
        'user_id',
        'is_keep',
        'keep_date',
    ];

    const IS_NOT_KEEP = 0;

    const IS_KEEP = 1;

    public function logo()
    {
        return $this->belongsTo(Logo::class, 'logo_id', 'logo_id');
    }
}
