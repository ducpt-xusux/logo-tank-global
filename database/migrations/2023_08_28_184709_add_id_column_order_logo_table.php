<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIdColumnOrderLogoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasColumn('lt_t_order_logo', 'id')) {
            return;
        }

        Schema::table('lt_t_order_logo', function (Blueprint $table) {
            $table->id()->after('logo_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (! Schema::hasColumn('lt_t_order_logo', 'id')) {
            return;
        }

        Schema::table('lt_t_order_logo', function (Blueprint $table) {
            $table->dropColumn('id');
        });
    }
}
