<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'name',
        'capacity',
        'facilities',
        'status',
        'image_path',
    ];

    protected $casts = [
        'facilities' => 'json',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
