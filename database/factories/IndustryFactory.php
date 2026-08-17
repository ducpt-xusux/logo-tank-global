<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Industry>
 */
class IndustryFactory extends Factory
{
    protected $table = 'lt_m_industry';

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
