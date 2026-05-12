<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Peminjaman Ruangan</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #334155; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 20px; color: #0f172a; }
        .header p { margin: 5px 0 0; color: #64748b; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #f8fafc; color: #475569; font-weight: bold; text-align: left; padding: 10px; border: 1px solid #e2e8f0; text-transform: uppercase; font-size: 10px; }
        td { padding: 10px; border: 1px solid #e2e8f0; vertical-align: top; }
        .status { font-weight: bold; padding: 3px 8px; border-radius: 4px; font-size: 10px; text-transform: uppercase; }
        .status-approved { background-color: #dcfce7; color: #15803d; }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-rejected { background-color: #fee2e2; color: #b91c1c; }
        .footer { margin-top: 30px; text-align: right; font-size: 10px; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Makassar Creative Hub</h1>
        <p>Laporan Peminjaman Ruangan - SIM JADWAL</p>
        <p style="font-size: 10px;">Dicetak pada: {{ now()->format('d/m/Y H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th width="5%">No</th>
                <th width="20%">Ruangan</th>
                <th width="20%">Peminjam</th>
                <th width="20%">Jadwal</th>
                <th width="20%">Keperluan</th>
                <th width="15%">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($bookings as $i => $b)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td><strong>{{ $b->room->name }}</strong></td>
                <td>{{ $b->user->name }}</td>
                <td>
                    {{ \Carbon\Carbon::parse($b->start_time)->format('d/m/Y') }}<br>
                    <small>{{ \Carbon\Carbon::parse($b->start_time)->format('H:i') }} - {{ \Carbon\Carbon::parse($b->end_time)->format('H:i') }}</small>
                </td>
                <td>{{ $b->purpose }}</td>
                <td>
                    <span class="status status-{{ $b->status }}">
                        {{ $b->status == 'approved' ? 'Disetujui' : ($b->status == 'pending' ? 'Menunggu' : 'Ditolak') }}
                    </span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Dokumen ini dibuat otomatis oleh Sistem Manajemen Makassar Creative Hub.
    </div>
</body>
</html>
