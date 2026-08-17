<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    protected $table = 'lt_t_orders';

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $price = $this->faker->numberBetween(10000, 100000);
        $taxRate = 10;
        $tax = ($price * $taxRate) / 100;
        $subTotal = $price + $tax;
        $commission = $subTotal * 0.1;
        $totalAmount = $subTotal + $commission;

        return [
            'user_id' => $this->faker->numberBetween(1, 100),
            'price' => $price,
            'tax' => $tax,
            'commission' => $commission,
            'tax_rate' => $taxRate,
            'sub_name' => $this->faker->name(),
            'main_name' => $this->faker->company(),
            'type' => $this->faker->randomElement([1, 2, 3]),
            'status' => $this->faker->randomElement([1, 2, 3]),
            'payment_status' => $this->faker->randomElement([1, 2]),
            'payment_date' => $this->faker->optional()->dateTime(),
            'payment_type' => $this->faker->optional()->randomElement([1, 2, 3]),
            'purchase_date' => $this->faker->optional()->dateTime(),
            'sub_total' => $subTotal,
            'total_amount' => $totalAmount,
            'invoice_num' => 'INV-'.$this->faker->unique()->numerify('########'),
            'delivery_address' => $this->faker->address(),
            'postal_code' => $this->faker->numerify('###-####'),
            'delivery_date' => $this->faker->optional()->dateTime(),
        ];
    }

    /**
     * Indicate that the order is paid.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => 2,
            'payment_date' => now(),
        ]);
    }

    /**
     * Indicate that the order is unpaid.
     */
    public function unpaid(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_status' => 1,
            'payment_date' => null,
        ]);
    }
}
