<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogoZip extends Model
{
    use HasFactory;

    protected $table = 'lt_t_logo_zip';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    protected $fillable = ['logo_id', 'url_zip'];

    protected $hidden = ['created_at', 'updated_at'];
}
