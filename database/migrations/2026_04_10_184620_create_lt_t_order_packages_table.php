<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lt_t_order_packages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('package_id');
            $table->decimal('price', 13, 2);
            $table->string('currency', 10)->comment('VND, JPY, USD');
            $table->timestamps();

            $table->foreign('order_id')->references('id')->on('lt_t_orders')->onDelete('cascade');
            $table->foreign('package_id')->references('id')->on('lt_m_packages')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lt_t_order_packages');
    }
};
