<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Pernyataan Penggunaan Tempat - MCH</title>
    <style>
        @page { margin: 2cm; }
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.4; 
            color: #000; 
            font-size: 11pt; 
            margin: 0; 
        }
        .header { 
            text-align: center; 
            margin-bottom: 40px; 
            font-weight: bold;
        }
        .header .title {
            text-decoration: underline;
            font-size: 12pt;
            display: block;
        }
        .header .subtitle {
            font-size: 12pt;
            display: block;
            margin-top: 2px;
        }
        .intro { margin-bottom: 15px; }
        .identity-table { 
            width: 100%; 
            margin-bottom: 20px; 
            border-collapse: collapse;
        }
        .identity-table td { 
            padding: 2px 0; 
            vertical-align: top; 
        }
        .commitment-intro { margin-bottom: 10px; text-align: justify; }
        .points { 
            margin-left: -25px; 
            text-align: justify;
        }
        .points li { 
            margin-bottom: 5px; 
            padding-left: 5px;
        }
        .closing { 
            margin-top: 15px; 
            text-align: justify; 
            margin-bottom: 30px;
        }
        .signature-section { 
            width: 100%;
        }
        .sig-content {
            width: 300px;
            text-align: left;
        }
        .materai-box {
            font-style: italic;
            font-size: 9pt;
            margin: 25px 0;
            color: #444;
        }
        .name-box {
            font-weight: bold;
            text-decoration: underline;
        }
        .sub-text {
            font-size: 9pt;
            margin-top: 2px;
        }
    </style>
</head>
<body>
    <div class="header">
        <span class="title">SURAT PERNYATAAN PENGGUNAAN TEMPAT</span>
        <span class="subtitle">MAKASSAR CREATIVE HUB</span>
    </div>

    <div class="intro">
        Saya yang bertanda tangan di bawah ini:
    </div>

    <table class="identity-table">
        <tr>
            <td width="220">Nama</td>
            <td width="20">:</td>
            <td>{{ $booking->user->name }}</td>
        </tr>
        <tr>
            <td>Jabatan</td>
            <td>:</td>
            <td>{{ $booking->position }}</td>
        </tr>
        <tr>
            <td>Nama Kegiatan</td>
            <td>:</td>
            <td>{{ $booking->purpose }}</td>
        </tr>
        <tr>
            <td>Nama Komunitas/Organisasi</td>
            <td>:</td>
            <td>{{ $booking->organization }}</td>
        </tr>
        <tr>
            <td>Tanggal Kegiatan</td>
            <td>:</td>
            <td>{{ \Carbon\Carbon::parse($booking->start_time)->translatedFormat('d F Y') }}</td>
        </tr>
        <tr>
            <td>Nomor Kontak</td>
            <td>:</td>
            <td>{{ $booking->phone }}</td>
        </tr>
    </table>

    <div class="commitment-intro">
        Dengan ini menyatakan bahwa saya selaku penanggung jawab kegiatan, serta seluruh anggota/peserta kegiatan yang berlangsung di <strong>Makassar Creative Hub (MCH)</strong>, menyatakan dan berkomitmen terhadap hal-hal berikut:
    </div>

    <ol class="points">
        <li>Tidak akan melakukan tindakan kekerasan dalam bentuk apapun, baik fisik maupun verbal, selama berada di lingkungan MCH.</li>
        <li>Tidak akan melakukan tindak kriminal termasuk tetapi tidak terbatas pada pencurian, perusakan fasilitas, penggunaan narkoba, atau tindakan melanggar hukum lainnya.</li>
        <li>Bertanggung jawab penuh terhadap kebersihan ruangan sebelum, selama, dan setelah kegiatan berlangsung, termasuk membuang sampah pada <i>trash bag</i> yang Anda/panitia sediakan.</li>
        <li>Bertanggung jawab atas pemulihan dan perawatan fasilitas jika terjadi kerusakan yang disebabkan oleh kelalaian panitia atau peserta kegiatan.</li>
        <li>Bersedia mengikuti semua aturan dan ketentuan yang berlaku di lingkungan Makassar Creative Hub.</li>
    </ol>

    <div class="closing">
        Demikian surat pernyataan ini dibuat dengan sebenarnya tanpa tekanan atau paksaan dari pihak manapun. Apabila di kemudian hari terjadi pelanggaran terhadap poin-poin di atas, saya bersedia menerima konsekuensi dan sanksi sesuai kebijakan MCH.
    </div>

    <div class="signature-section">
        <div class="sig-content">
            Makassar, {{ \Carbon\Carbon::parse($booking->created_at)->translatedFormat('d F Y') }}<br><br>
            Hormat saya,<br>
            Penanggung Jawab Kegiatan<br><br>
            <div class="materai-box">[materai 10.000]</div>
            <br>
            <span class="name-box">({{ $booking->user->name }})</span><br>
            <span class="sub-text">(tanda tangan & nama terang)</span>
        </div>
    </div>
</body>
</html>
