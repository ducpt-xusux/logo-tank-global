<?php

namespace Database\Seeders;

use App\Models\AddressSearch;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AddressSearchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Delete old data if it exists
        DB::table('lt_t_address_search')->truncate();

        $faker = \Faker\Factory::create();
        $rows = [];
        $count = 100;

        for ($i = 0; $i < $count; $i++) {
            $rows[] = [
                'address_ip' => $faker->ipv4(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insert data in batch to optimize performance
        foreach (array_chunk($rows, 500) as $chunk) {
            AddressSearch::insert($chunk);
        }

        $this->command->info(
            'AddressSearchSeeder completed! Created '.count($rows).' records.',
        );
    }
}
