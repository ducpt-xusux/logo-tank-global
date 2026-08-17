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
        Schema::create('lt_m_packages', function (Blueprint $table) {
            $table->id();
            $table->string('category')->comment('modification, full_design, selection');
            $table->string('key')->comment('plan_1, plan_2, item_1, etc.');
            $table->json('prices')->comment('{"vi": 1500000, "en": 310, "ja": 20500}');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lt_m_packages');
    }
};
