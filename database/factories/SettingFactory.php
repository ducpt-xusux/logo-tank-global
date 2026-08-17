<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Setting>
 */
class SettingFactory extends Factory
{
    protected $table = 'lt_t_settings';

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'key' => $this->faker->slug(),
            'value' => $this->faker->word(),
            'type' => $this->faker->randomElement(['string', 'boolean', 'integer']),
        ];
    }
}
