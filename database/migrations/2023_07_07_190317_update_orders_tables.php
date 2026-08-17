<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateOrdersTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lt_t_orders', function (Blueprint $table) {
            $table->string('payment_intent', 100)->after('payment_type')->nullable();
            $table->string('payment_intent_client_secret')->after('payment_intent')->nullable();
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
            $table->dropColumn('payment_intent');
            $table->dropColumn('payment_intent_client_secret');
        });
    }
}
