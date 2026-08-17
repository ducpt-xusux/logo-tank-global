<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderLogo>
 */
class OrderLogoFactory extends Factory
{
    protected $table = 'lt_t_order_logo';

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'logo_id' => $this->faker->numberBetween(1, 1000),
            'order_id' => $this->faker->numberBetween(1, 100),
            'logo_manual' => $this->faker->boolean(),
            'logo_motion' => $this->faker->boolean(),
        ];
    }
}
