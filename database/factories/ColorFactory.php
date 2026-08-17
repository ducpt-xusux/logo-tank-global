<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Color>
 */
class ColorFactory extends Factory
{
    protected $table = 'lt_m_color';

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->colorName(),
            'name_vi' => $this->faker->colorName(),
            'name_en' => $this->faker->colorName(),
            'code' => $this->faker->regexify('[A-F0-9]{6}'),
            'key' => strtolower($this->faker->slug(1)),
        ];
    }
}
