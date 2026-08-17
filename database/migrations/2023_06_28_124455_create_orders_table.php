<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lt_t_orders', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->decimal('price', 13, 2, true)->nullable();
            $table->decimal('tax', 13, 2, true)->nullable();
            $table->decimal('commission', 13, 2, true)->nullable();
            $table->integer('tax_rate')->nullable();
            $table->string('sub_name', 100)->nullable();
            $table->string('main_name', 100)->nullable();
            $table->tinyInteger('type')->nullable()->comment('1: logo, 2: card visit,...');
            $table->tinyInteger('status')->default(1)->comment('1: waiting for payment, 2: purchased, 3. cancel');
            $table->tinyInteger('payment_status')->default(1)->comment('1: unpaid, 2: paid');
            $table->datetime('payment_date')->nullable();
            $table->tinyInteger('payment_type')->nullable();
            $table->datetime('purchase_date')->nullable();
            $table->decimal('sub_total', 13, 2, true)->nullable();
            $table->decimal('total_amount', 13, 2, true)->nullable();
            $table->string('invoice_num')->nullable();
            $table->string('delivery_address')->nullable();
            $table->string('postal_code', 10)->nullable();
            $table->datetime('delivery_date')->nullable();
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
        Schema::dropIfExists('lt_t_orders');
    }
}
