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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('surname');
            $table->string('email')->nullable();
            $table->string('mobile', 25)->nullable();
            $table->string('dni', 50)->nullable();
            $table->timestamp('birthdate')->nullable();
            $table->text('antecedent_family')->nullable();
            $table->text('antecedent_personal')->nullable();
            $table->text('antecedent_alergic')->nullable();
            $table->string('ta')->nullable()->comment('Presion arterial');
            $table->string('temperature', 20)->nullable();
            $table->string('fc', 50)->nullable()->comment('Frecuencia cardiaca');
            $table->string('fr', 50)->nullable()->comment('Frecuencia respiratoria');
            $table->string('weight', 25)->nullable();
            $table->text('current_disease')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
