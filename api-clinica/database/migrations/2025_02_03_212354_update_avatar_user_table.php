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
        Schema::table('users', function (Blueprint $table) {
            $table->string('surname')->after('email')->nullable();
            $table->string('mobile')->after('surname')->nullable();
            $table->date('birthdate')->after('mobile')->nullable();
            $table->tinyInteger('gender')->after('birthdate')->comment('1:Male,2:Female')->nullable();
            $table->longText('education')->after('gender')->nullable();
            $table->longText('designation')->after('education')->nullable();
            $table->text('address')->after('designation')->nullable();
            $table->string('avatar')->after('address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('surname');
            $table->dropColumn('mobile');
            $table->dropColumn('birthdate');
            $table->dropColumn('gender');
            $table->dropColumn('education');
            $table->dropColumn('designation');
            $table->dropColumn('address');
            $table->dropColumn('avatar');
        });
    }
};
