<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateOrdersV2Table extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lt_t_orders', function (Blueprint $table) {
            $table->dropColumn('sub_name');
            $table->dropColumn('main_name');
            $table->string('currency', 10);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('lt_t_orders', function (Blueprint $table) {
            $table->string('sub_name', 100)->nullable();
            $table->string('main_name', 100)->nullable();
        });
    }
}
