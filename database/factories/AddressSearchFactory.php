<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AddressSearch>
 */
class AddressSearchFactory extends Factory
{
    protected $table = 'lt_t_address_search';

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => $this->faker->numberBetween(1, 100),
            'address' => $this->faker->address(),
            'postal_code' => $this->faker->numerify('###-####'),
            'latitude' => $this->faker->latitude(),
            'longitude' => $this->faker->longitude(),
            'search_count' => $this->faker->numberBetween(1, 100),
        ];
    }
}
