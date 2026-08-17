<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFavoritesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lt_t_favorites', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('logo_id');
            $table->bigInteger('user_id');
            $table->tinyInteger('is_keep')->default(0);
            $table->datetime('keep_date')->nullable();
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
        Schema::dropIfExists('lt_t_favorites');
    }
}
