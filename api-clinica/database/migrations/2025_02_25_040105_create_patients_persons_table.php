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
        Schema::create('patients_persons', function (Blueprint $table) {
            $table->id();
            $table->string('patient_id');
            $table->string('name_companion');
            $table->string('surname_companion');
            $table->string('mobile_companion')->nullable();
            $table->string('relationship')->nullable();
            $table->string('responsable')->nullable();
            $table->string('responsable_surname')->nullable();
            $table->string('responsable_mobile')->nullable();
            $table->string('responsable_relationship')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients_persons');
    }
};
