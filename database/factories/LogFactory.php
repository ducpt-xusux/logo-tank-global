<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Log>
 */
class LogFactory extends Factory
{
    protected $table = 'lt_t_logs';

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => $this->faker->numberBetween(1, 100),
            'action' => $this->faker->randomElement(['create', 'update', 'delete', 'view']),
            'model_type' => $this->faker->randomElement(['Logo', 'Order', 'User']),
            'model_id' => $this->faker->numberBetween(1, 1000),
            'description' => $this->faker->sentence(),
            'ip_address' => $this->faker->ipv4(),
            'user_agent' => $this->faker->userAgent(),
        ];
    }
}
