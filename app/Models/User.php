<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'company_name',
        'first_name',
        'last_name',
        'name',
        'name_kana',
        'email',
        'password',
        'role',
        'address',
        'remember_token',
        'first_login',
        'email_verified_at',
        'provider',
        'provider_id',
        'verify_token',
        'address_line_1',
        'address_line_2',
        'postal_code',
        'phone',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function scopeDesigners($query)
    {
        return $query->where('role', 'designer');
    }

    public function favorites()
    {
        return $this->belongsToMany(Logo::class, 'lt_t_favorites', 'user_id', 'logo_id')->withTimestamps();
    }
}
