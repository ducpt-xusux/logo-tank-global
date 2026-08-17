<?php

namespace Database\Seeders;

use App\Models\Logo;
use App\Models\Order;
use App\Models\OrderLogo;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class OrderLogoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        $orders = Order::all();
        $logos = Logo::all();

        if ($orders->isEmpty() || $logos->isEmpty()) {
            return;
        }

        foreach ($orders as $order) {
            $logoCount = $faker->numberBetween(1, 3);
            $selectedLogos = $logos->random(min($logoCount, $logos->count()));

            foreach ($selectedLogos as $logo) {
                OrderLogo::create([
                    'order_id' => $order->id,
                    'logo_id' => $logo->logo_id,
                    'main_name' => $faker->optional(75)->company(),
                    'sub_name' => $faker->optional(75)->catchPhrase(),
                    'logo_manual' => $faker->boolean(40) ? 1 : 0,
                    'logo_motion' => $faker->boolean(40) ? 1 : 0,
                    'logo_manual_price' => $faker->randomFloat(2, 10, 50),
                    'logo_motion_price' => $faker->randomFloat(2, 20, 150),
                ]);
            }
        }
    }
}
