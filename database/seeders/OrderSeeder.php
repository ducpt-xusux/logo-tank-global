<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        $userIds = User::pluck('id')->toArray();
        if (empty($userIds)) {
            return;
        }

        foreach (range(1, 30) as $i) {
            $price = $faker->randomFloat(2, 5, 200);
            $taxRate = $faker->numberBetween(5, 15); // percent as integer
            $tax = round(($price * $taxRate) / 100, 2);
            $subTotal = $price;
            $total = $subTotal + $tax;

            Order::create([
                'user_id' => $faker->randomElement($userIds),
                'price' => $price,
                'tax' => $tax,
                'commission' => $faker->randomFloat(2, 0, 50),
                'tax_rate' => $taxRate,
                'type' => $faker->numberBetween(1, 3),
                'status' => Order::PURCHASED,
                'payment_status' => Order::PAY_PAID,
                'payment_date' => Carbon::now()->subDays(
                    $faker->numberBetween(0, 30),
                ),
                'payment_type' => $faker->numberBetween(1, 3),
                'purchase_date' => Carbon::now()->subDays(
                    $faker->numberBetween(0, 30),
                ),
                'sub_total' => $subTotal,
                'total_amount' => $total,
                'invoice_num' => strtoupper($faker->bothify('INV-####')),
                'delivery_address' => $faker->address,
                'postal_code' => $faker->postcode,
                'delivery_date' => Carbon::now()->addDays(
                    $faker->numberBetween(1, 10),
                ),
                'currency' => 'JPY',
            ]);
        }
    }
}
