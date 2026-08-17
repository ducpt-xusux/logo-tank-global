<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('lt_t_settings')->insert([
            [
                'key' => 'plan_1_price',
                'value' => json_encode(['vi' => 1500000, 'en' => 310, 'ja' => 20500]),
            ],
            [
                'key' => 'plan_2_price',
                'value' => json_encode(['vi' => 2050000, 'en' => 420, 'ja' => 28000]),
            ],
            [
                'key' => 'plan_3_price',
                'value' => json_encode(['vi' => 1100000, 'en' => 230, 'ja' => 15000]),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('lt_t_settings')->whereIn('key', [
            'plan_1_price',
            'plan_2_price',
            'plan_3_price',
        ])->delete();
    }
};
