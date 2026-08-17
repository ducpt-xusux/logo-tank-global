<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogoTaste extends Model
{
    protected $table = 'lt_t_logo_taste';
    protected $primaryKey = null;
    protected $fillable = [
        'logo_id',
        'taste_id'
    ];

    public function taste()
    {
        return $this->hasOne(Taste::class, 'id', 'taste_id');
    }
}
