<?php

namespace App\Exports;

use App\Models\Booking;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Carbon\Carbon;

class BookingsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Booking::with(['room', 'user'])->latest()->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Ruangan',
            'Peminjam',
            'Mulai',
            'Selesai',
            'Keperluan',
            'Status',
            'Dibuat Pada',
        ];
    }

    public function map($booking): array
    {
        return [
            $booking->id,
            $booking->room->name,
            $booking->user->name,
            Carbon::parse($booking->start_time)->format('d/m/Y H:i'),
            Carbon::parse($booking->end_time)->format('d/m/Y H:i'),
            $booking->purpose,
            match($booking->status) {
                'approved' => 'Disetujui',
                'pending'  => 'Menunggu',
                'rejected' => 'Ditolak',
                default    => $booking->status,
            },
            $booking->created_at->format('d/m/Y H:i'),
        ];
    }
}
