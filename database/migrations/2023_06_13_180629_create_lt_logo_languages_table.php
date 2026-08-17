<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLtLogoLanguagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lt_logo_languages', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('logo_id');
            $table->string('create_by')->nullable();
            $table->string('vi')->nullable();
            $table->string('en')->nullable();
            $table->string('ja')->nullable();
            $table->timestamps();
        });

        Schema::table('lt_logo_languages', function (Blueprint $table) {
            $table->index('logo_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lt_logo_languages');
    }
}
