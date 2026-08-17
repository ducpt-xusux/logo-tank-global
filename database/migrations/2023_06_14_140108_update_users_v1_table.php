<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUsersV1Table extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name', 100)->nullable()->change();
            $table->string('company_name', 100)->nullable()->after('email');
            $table->string('address_line_1')->nullable()->after('company_name');
            $table->string('address_line_2')->nullable()->after('address_line_1');
            $table->integer('postal_code')->nullable()->after('address_line_2');
            $table->string('phone')->nullable()->after('postal_code');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->change();
            $table->dropColumn('company_name');
            $table->dropColumn('address_line_1');
            $table->dropColumn('address_line_2');
            $table->dropColumn('postal_code');
            $table->dropColumn('phone');
        });
    }
}
