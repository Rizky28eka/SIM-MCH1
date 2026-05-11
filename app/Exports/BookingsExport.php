<?php

namespace App\Exports;

use App\Models\Booking;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class BookingsExport implements FromCollection, WithHeadings, WithMapping
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Booking::with(['user', 'room'])->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Peminjam',
            'Ruangan',
            'Waktu Mulai',
            'Waktu Selesai',
            'Tujuan',
            'Status',
        ];
    }

    public function map($booking): array
    {
        return [
            $booking->id,
            $booking->user->name,
            $booking->room->name,
            $booking->start_time,
            $booking->end_time,
            $booking->purpose,
            $booking->status,
        ];
    }
}
