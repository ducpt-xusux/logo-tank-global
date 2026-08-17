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
        Schema::create('lt_t_logo_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('logo_id');
            $table->string('path');
            $table->string('filename')->nullable();
            $table->integer('sort_order')->default(1);
            $table->boolean('is_main')->default(false);
            $table->timestamps();
            $table->foreign('logo_id')->references('logo_id')->on('lt_t_logo')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lt_t_logo_images');
    }
};
