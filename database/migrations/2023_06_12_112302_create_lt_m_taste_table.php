<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLtMTasteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lt_m_taste', function (Blueprint $table) {
            $table->id();
            $table->integer('state')->default(0);
            $table->datetime('reg_date')->nullable();
            $table->datetime('up_date')->nullable();
            $table->string('reg_by', 128)->nullable();
            $table->string('up_by', 128)->nullable();
            $table->string('name', 128)->nullable();
            $table->text('explain')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lt_m_taste');
    }
}
