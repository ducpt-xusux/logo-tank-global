<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLtTContactsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lt_t_contacts', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->text('company_name')->nullable();
            $table->string('name')->nullable();
            $table->string('tel')->nullable();
            $table->string('email')->nullable();
            $table->tinyInteger('status')->default(1)->nullable();
            $table->text('address')->nullable();
            $table->text('content')->nullable();
            $table->string('locale')->nullable();

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
        Schema::dropIfExists('lt_t_contacts');
    }
}
