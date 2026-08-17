<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLtTRecommendTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lt_t_recommend', function (Blueprint $table) {
            $table->id();
            $table->integer('logo_id');
            $table->integer('suggest_1')->nullable();
            $table->integer('suggest_2')->nullable();
            $table->integer('suggest_3')->nullable();
            $table->integer('suggest_4')->nullable();
            $table->integer('suggest_5')->nullable();
            $table->integer('suggest_6')->nullable();
            $table->integer('suggest_7')->nullable();
            $table->integer('suggest_8')->nullable();
            $table->integer('suggest_9')->nullable();
            $table->integer('suggest_10')->nullable();
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
        Schema::dropIfExists('lt_t_recommend');
    }
}
