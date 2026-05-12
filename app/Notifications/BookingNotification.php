<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Booking;

class BookingNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Booking $booking,
        public string $title,
        public string $message,
        public string $type = 'info'
    ) {}

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'title'      => $this->title,
            'message'    => $this->message,
            'type'       => $this->type,
            'url'        => route('bookings.index'),
        ];
    }
}
