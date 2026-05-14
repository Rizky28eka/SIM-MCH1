<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Permohonan Peminjaman Tempat - MCH</title>
    <style>
        @page { margin: 2cm; }
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.5; 
            color: #000; 
            font-size: 11pt; 
            margin: 0; 
        }
        .kop-surat {
            text-align: center;
            font-weight: bold;
            font-size: 14pt;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        .date-section {
            text-align: right;
            margin-bottom: 20px;
        }
        .reference-section {
            margin-bottom: 25px;
        }
        .reference-table td {
            padding: 2px 0;
            vertical-align: top;
        }
        .recipient-section {
            margin-bottom: 25px;
        }
        .greeting {
            margin-bottom: 15px;
        }
        .body-text {
            text-align: justify;
            margin-bottom: 15px;
            text-indent: 1cm;
        }
        .details-section {
            margin-left: 1cm;
            margin-bottom: 20px;
        }
        .details-table {
            width: 100%;
        }
        .details-table td {
            padding: 4px 0;
            vertical-align: top;
        }
        .details-table td.label {
            font-weight: bold;
            width: 180px;
        }
        .closing-text {
            text-align: justify;
            margin-bottom: 40px;
        }
        .signature-section {
            float: right;
            width: 250px;
            text-align: center;
        }
        .signature-name {
            margin-top: 70px;
            font-weight: bold;
        }
        .footer-note {
            clear: both;
            font-size: 8pt;
            color: #666;
            font-style: italic;
            margin-top: 50px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="kop-surat">
        KOP {{ $booking->organization }}
    </div>

    <div class="date-section">
        Makassar, {{ \Carbon\Carbon::parse($booking->created_at)->translatedFormat('d F Y') }}
    </div>

    <div class="reference-section">
        <table class="reference-table">
            <tr>
                <td width="80">Nomor</td>
                <td width="20">:</td>
                <td>{{ str_pad($booking->id, 3, '0', STR_PAD_LEFT) }}/MCH/USAGE/{{ \Carbon\Carbon::parse($booking->created_at)->format('m/Y') }}</td>
            </tr>
            <tr>
                <td>Lampiran</td>
                <td>:</td>
                <td>1 (satu) Berkas</td>
            </tr>
            <tr>
                <td>Perihal</td>
                <td>:</td>
                <td>Permohonan Peminjaman Tempat</td>
            </tr>
        </table>
    </div>

    <div class="recipient-section">
        Yth. Direktur Makassar Creative Hub<br>
        di Tempat
    </div>

    <div class="greeting">
        Dengan Hormat,
    </div>

    <div class="body-text">
        Kami dari komunitas/instansi <strong>{{ $booking->organization }}</strong> bermaksud untuk mengajukan permohonan penggunaan ruangan di <strong>Makassar Creative Hub</strong> untuk kegiatan kami <strong>{{ $booking->purpose }}</strong>.
    </div>

    <div class="body-text">
        Kegiatan ini bertujuan untuk {{ $booking->objective }}.
    </div>

    <div class="body-text">
        Adapun rincian kegiatan yang akan kami selenggarakan adalah sebagai berikut:
    </div>

    <div class="details-section">
        <table class="details-table">
            <tr>
                <td class="label">Nama Kegiatan</td>
                <td width="20">:</td>
                <td>{{ $booking->purpose }}</td>
            </tr>
            <tr>
                <td class="label">Hari/Tanggal</td>
                <td width="20">:</td>
                <td>{{ \Carbon\Carbon::parse($booking->start_time)->translatedFormat('l, d F Y') }}</td>
            </tr>
            <tr>
                <td class="label">Waktu</td>
                <td width="20">:</td>
                <td>{{ \Carbon\Carbon::parse($booking->start_time)->format('H:i') }} - {{ \Carbon\Carbon::parse($booking->end_time)->format('H:i') }} WITA</td>
            </tr>
            <tr>
                <td class="label">Jumlah Peserta</td>
                <td width="20">:</td>
                <td>{{ $booking->participants_count }} Orang</td>
            </tr>
            <tr>
                <td class="label">Format Kegiatan</td>
                <td width="20">:</td>
                <td>{{ $booking->event_format }}</td>
            </tr>
        </table>
    </div>

    <div class="body-text">
        Kami sangat berharap dapat menggunakan fasilitas di Makassar Creative Hub yang kami yakini sangat mendukung keberlangsungan kegiatan kami. Kami berkomitmen untuk menjaga kebersihan dan ketertiban selama penggunaan ruangan.
    </div>

    <div class="closing-text">
        Besar harapan kami agar permohonan ini dapat diterima. Atas perhatian dan kerjasamanya, kami mengucapkan terima kasih.
    </div>

    <div class="signature-section">
        Hormat Kami,<br><br><br><br><br>
        <div class="signature-name">{{ $booking->user->name }}</div>
        ({{ $booking->organization }})
    </div>

    <div class="footer-note">
        Dokumen ini diterbitkan secara otomatis oleh SIM-MCH
    </div>
</body>
</html>
