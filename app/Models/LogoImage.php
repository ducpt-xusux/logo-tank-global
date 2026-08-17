<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogoImage extends Model
{
    protected $table = 'lt_t_logo_images';

    protected $fillable = [
        'logo_id',
        'path',
        'filename',
        'sort_order',
        'is_main',
    ];

    public function logo()
    {
        return $this->belongsTo(Logo::class, 'logo_id', 'logo_id');
    }
}
