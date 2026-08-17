<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    protected $table = 'lt_t_payment';

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => $this->faker->numberBetween(1, 100),
            'amount' => $this->faker->numberBetween(1000, 100000),
            'payment_method' => $this->faker->randomElement(['credit_card', 'bank_transfer', 'paypal']),
            'status' => $this->faker->randomElement(['pending', 'completed', 'failed']),
            'transaction_id' => $this->faker->unique()->uuid(),
            'paid_at' => $this->faker->optional()->dateTime(),
        ];
    }
}
