<?php

namespace Database\Factories;

use App\Models\Logo;
use App\Models\LogoZip;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Logo Zip>
 */
class LogoZipFactory extends Factory
{
    protected $model = LogoZip::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'logo_id' => Logo::query()->inRandomOrder()->first()?->id ?? Logo::factory(),
            'url_zip' => 'https://example.com/storage/zips/'.
                $this->faker->uuid().
                '.zip',
        ];
    }
}
