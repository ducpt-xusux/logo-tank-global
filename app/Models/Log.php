<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Log extends Model
{
    use HasFactory;

    protected $fillable = [
        'value',
        'created_by',
        'logo_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function logo(): BelongsTo
    {
        return $this->belongsTo(Logo::class, 'logo_id', 'logo_id');
    }
}
