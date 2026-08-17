<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLtTULogoKeywordTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('tblCategory')) {
            Schema::create('lt_t_u_logo_keyword', function (Blueprint $table) {
                $table->bigInteger('logo_id');
                $table->bigInteger('keyword_id');
                $table->tinyInteger('type');
                $table->index(['logo_id']);
                $table->index(['keyword_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('lt_t_u_logo_keyword');
    }
}
