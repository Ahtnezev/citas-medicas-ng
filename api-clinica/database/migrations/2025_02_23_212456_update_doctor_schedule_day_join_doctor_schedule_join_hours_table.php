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
        Schema::table('doctor_schedule_join_hours', function (Blueprint $table) {
            // $table->foreignId('doctor_schedule_day_join')->after('doctor_schedule_hour_id')->constrained('doctor_schedule_days', 'doctor_schedule_day_id')->onDelete('cascade');
            $table->bigInteger('doctor_schedule_day_id')->unsigned()->change();
            $table->bigInteger('doctor_schedule_hour_id')->unsigned()->change();
            // SQL
            // ALTER TABLE `doctor_schedule_join_hours`
            // ADD CONSTRAINT `doctor_schedule_day_join`
            // FOREIGN KEY (`doctor_schedule_day_id`)
            // REFERENCES `doctor_schedule_days`(`id`)
            // ON DELETE CASCADE
            // ON UPDATE CASCADE;
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('doctor_schedule_join_hours', function (Blueprint $table) {
            // $table->dropConstrainedForeignId('doctor_schedule_day_join');
            $table->integer('doctor_schedule_day_id')->change();
            $table->integer('doctor_schedule_hour_id')->change();
        });
    }
};
