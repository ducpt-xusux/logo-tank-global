<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateOrderLogoV2Table extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lt_t_order_logo', function (Blueprint $table) {
            $table->string('sub_name', 100)->after('order_id')->nullable();
            $table->string('main_name', 100)->after('sub_name')->nullable();
            $table->decimal('logo_manual_price', 13,2)->after('main_name')->nullable();
            $table->decimal('logo_motion_price', 13,2)->after('logo_manual_price')->nullable();
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
            $table->dropColumn('sub_name');
            $table->dropColumn('main_name');
            $table->dropColumn('logo_manual_price');
            $table->dropColumn('logo_motion_price');
        });
    }
}
