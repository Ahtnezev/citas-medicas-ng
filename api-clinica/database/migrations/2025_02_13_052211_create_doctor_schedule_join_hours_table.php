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
        Schema::create('doctor_schedule_join_hours', function (Blueprint $table) {
            $table->id();
            $table->integer("doctor_schedule_day_id"); // change to bigint xd -> Referencing column 'doctor_schedule_day_id' and referenced column 'id' in foreign key constraint 'doctor_schedule_day_join' are incompatible.
            $table->integer("doctor_schedule_hour_id");
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop("doctor_schedule_join_hours");
    }
};
