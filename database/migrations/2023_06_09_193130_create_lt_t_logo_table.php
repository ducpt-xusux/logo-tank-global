<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLtTLogoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
        Schema::create('lt_t_logo', function (Blueprint $table) {
            $table->bigIncrements('logo_id');
            $table->tinyInteger('state')->comment('status of the logo')->default(0);
            $table->datetime('reg_date')->nullable();
            $table->datetime('up_date')->nullable();
            $table->string('reg_by', 128)->nullable();
            $table->string('up_by', 128)->nullable();
            $table->string('logo_name', 128)->nullable();
            $table->text('logo_explain')->nullable();
            $table->string('logo_d_id', 16)->nullable();
            $table->integer('tank_num')->default(0);
            $table->string('reg_user', 100)->nullable();
            $table->string('last_sync_at')->nullable();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lt_t_logo');
    }
}
