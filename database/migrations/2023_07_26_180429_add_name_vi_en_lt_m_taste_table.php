<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNameViEnLtMTasteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lt_m_taste', function (Blueprint $table) {
            $table->string('name_vi', 100)->after('name')->nullable();
            $table->string('name_en', 100)->after('name_vi')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('lt_m_taste', function (Blueprint $table) {
            $table->dropColumn('name_vi');
            $table->dropColumn('name_en');
        });
    }
}
