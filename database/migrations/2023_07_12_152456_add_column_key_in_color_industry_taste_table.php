<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddColumnKeyInColorIndustryTasteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lt_m_color', function (Blueprint $table) {
            $table->string('key_name', 20)->after('name')->nullable();
        });

        Schema::table('lt_m_industry', function (Blueprint $table) {
            $table->string('key_name', 20)->after('name')->nullable();
        });

        Schema::table('lt_m_taste', function (Blueprint $table) {
            $table->string('key_name', 20)->after('name')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('lt_m_color', function (Blueprint $table) {
            $table->dropColumn('key_name');
        });

        Schema::table('lt_m_industry', function (Blueprint $table) {
            $table->dropColumn('key_name');
        });

        Schema::table('lt_m_taste', function (Blueprint $table) {
            $table->dropColumn('key_name');
        });
    }
}
