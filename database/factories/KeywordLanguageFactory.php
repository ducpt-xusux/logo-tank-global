<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\KeywordLanguage>
 */
class KeywordLanguageFactory extends Factory
{
    protected $table = 'lt_t_keyword_languages';

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'keyword_id' => $this->faker->numberBetween(1, 1000),
            'language' => $this->faker->randomElement(['en', 'vi', 'ja']),
            'name' => $this->faker->words(2, true),
        ];
    }
}
