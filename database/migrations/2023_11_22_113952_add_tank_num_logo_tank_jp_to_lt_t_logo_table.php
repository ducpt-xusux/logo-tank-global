<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTankNumLogoTankJpToLtTLogoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lt_t_logo', function (Blueprint $table) {
            $table->bigInteger('tank_num_logo_tank_jp')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('lt_t_logo', function (Blueprint $table) {
            $table->dropColumn('tank_num_logo_tank_jp');
        });
    }
}
