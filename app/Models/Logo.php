<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @method static create(array $array)
 * @method static paginate(int $int)
 * @method static insert(array $array)
 * @method static updateOrCreate(array $array, array $array)
 */
class Logo extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'lt_t_logo';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'logo_id';

    const CREATED_AT = 'reg_date';

    const UPDATED_AT = 'up_date';

    /**
     * Status of logo
     */
    const ACTIVE = 0;

    const STOP = 7;

    const SOLD_OUT = 8;

    const NEGOTIATION = 2;

    const DELETED = 9;

    protected $fillable = [
        'logo_id',
        'state',
        'reg_date',
        'up_date',
        'reg_by',
        'up_by',
        'logo_name',
        'logo_explain',
        'logo_d_id',
        'tank_num_logo_tank_jp',
        'tank_num',
        'reg_user',
        'last_sync_at',
        'two_img',
    ];

    /**
     * Relationship of logo with color
     */
    public function alphabets(): HasMany
    {
        return $this->hasMany(LogoAlphabet::class, 'logo_id', 'logo_id');
    }

    /**
     * Relationship of logo with color
     */
    public function colors(): BelongsToMany
    {
        return $this->belongsToMany(
            Color::class,
            'lt_t_logo_color',
            'logo_id',
            'color_id',
            'logo_id',
            'id',
        );
    }

    /**
     * Relationship of logo with recommend
     */
    public function recommend(): HasOne
    {
        return $this->hasOne(Recommend::class, 'logo_id', 'logo_id');
    }

    /**
     * Relationship of logo with industry
     *
     * @return HasOne
     */
    public function industries(): BelongsToMany
    {
        return $this->belongsToMany(
            Industry::class,
            'lt_t_logo_industry',
            'logo_id',
            'industry_id',
            'logo_id',
            'id',
        );
    }

    /**
     * Relationship of logo with industry
     *
     * @return HasOne
     */
    public function tastes(): BelongsToMany
    {
        return $this->belongsToMany(
            Taste::class,
            'lt_t_logo_taste',
            'logo_id',
            'taste_id',
            'logo_id',
            'id',
        );
    }

    public function logoTastes(): HasMany
    {
        return $this->hasMany(LogoTaste::class, 'logo_id', 'logo_id');
    }

    /**
     * Relationship of logo with keyword
     *
     * @return HasOne
     */
    public function logoKeywords(): HasMany
    {
        return $this->hasMany(LogoKeyword::class, 'logo_id', 'logo_id');
    }

    /**
     * Relationship of logo with keyword
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class, 'logo_id', 'logo_id');
    }

    /**
     * Relationship of logo with keyword
     */
    public function logoLanguage(): HasOne
    {
        return $this->hasOne(LogoLanguage::class, 'logo_id', 'logo_id');
    }

    public function orderLogo()
    {
        return $this->hasOne(OrderLogo::class, 'logo_id', 'logo_id');
    }

    /**
     * Relationship of logo with logo images
     */
    public function logoImages(): HasMany
    {
        return $this->hasMany(LogoImage::class, 'logo_id', 'logo_id')->orderBy('sort_order');
    }
}
