<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateOrdersV3Table extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lt_t_order_logo', function (Blueprint $table) {
            $table->decimal('logo_manual_price', 13,2)->after('main_name')->nullable()->change();
            $table->decimal('logo_motion_price', 13,2)->after('logo_manual_price')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('lt_t_order_logo', function (Blueprint $table) {
            $table->decimal('logo_manual_price')->after('main_name')->nullable()->change();
            $table->decimal('logo_motion_price')->after('logo_manual_price')->nullable()->change();
        });
    }
}
