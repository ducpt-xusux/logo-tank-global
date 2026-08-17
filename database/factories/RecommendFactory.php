<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Recommend>
 */
class RecommendFactory extends Factory
{
    protected $table = 'lt_t_recommend';

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'logo_id_from' => $this->faker->numberBetween(1, 1000),
            'logo_id_to' => $this->faker->numberBetween(1, 1000),
            'score' => $this->faker->numberBetween(1, 100),
        ];
    }
}
