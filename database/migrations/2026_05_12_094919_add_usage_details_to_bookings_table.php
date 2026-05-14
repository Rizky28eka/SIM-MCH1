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
        Schema::table('bookings', function (Blueprint $table) {
            $table->integer('participants_count')->nullable()->after('phone');
            $table->string('event_format')->nullable()->after('participants_count'); // Berbayar / Tidak
            $table->text('objective')->nullable()->after('event_format');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['participants_count', 'event_format', 'objective']);
        });
    }
};
