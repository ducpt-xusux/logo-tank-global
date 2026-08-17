<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Taste>
 */
class TasteFactory extends Factory
{
    protected $table = 'lt_m_taste';

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'name_vi' => $this->faker->word(),
            'name_en' => $this->faker->word(),
            'key' => strtolower($this->faker->slug(1)),
        ];
    }
}
