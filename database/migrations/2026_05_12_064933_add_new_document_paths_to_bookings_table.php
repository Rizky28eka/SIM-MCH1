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
        Schema::table('bookings', function (Blueprint $column) {
            $column->string('statement_path')->nullable()->after('status');
            $column->string('usage_path')->nullable()->after('statement_path');
            $column->dropColumn('verification_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $column) {
            $column->dropColumn(['statement_path', 'usage_path']);
            $column->string('verification_path')->nullable();
        });
    }
};
