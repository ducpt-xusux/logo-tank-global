<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderLogoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lt_t_order_logo', function (Blueprint $table) {
            $table->bigInteger('logo_id');
            $table->bigInteger('order_id');
            $table->tinyInteger('logo_manual')->default(0);
            $table->tinyInteger('logo_motion')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lt_t_order_logo');
    }

}
