<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('lt_t_order_packages', function (Blueprint $table) {
            $table->integer('quantity')->default(1)->after('package_id');
            $table->boolean('logo_manual')->default(false)->after('quantity');
            $table->boolean('logo_motion')->default(false)->after('logo_manual');
            $table->boolean('main_text')->default(false)->after('logo_motion');
            $table->decimal('logo_manual_price', 13, 2)->default(0)->after('price');
            $table->decimal('logo_motion_price', 13, 2)->default(0)->after('logo_manual_price');
            $table->decimal('main_text_price', 13, 2)->default(0)->after('logo_motion_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lt_t_order_packages', function (Blueprint $table) {
            $table->dropColumn([
                'quantity',
                'logo_manual',
                'logo_motion',
                'main_text',
                'logo_manual_price',
                'logo_motion_price',
                'main_text_price',
            ]);
        });
    }
};
