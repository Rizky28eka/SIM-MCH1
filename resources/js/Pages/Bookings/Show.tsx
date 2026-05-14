import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { 
    Calendar, Clock, FileText, Building2, 
    ChevronLeft, ArrowRight, ShieldCheck, 
    Info, AlertCircle, Upload, CheckCircle2,
    XCircle, Download, User as UserIcon, MapPin
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface Booking {
    id: number;
    room: { id: number; name: string };
    user: { id: number; name: string };
    start_time: string;
    end_time: string;
    purpose: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    statement_path: string | null;
    usage_path: string | null;
    created_at: string;
}

interface Props {
    booking: Booking;
    isAdmin: boolean;
}

const STATUS_CONFIG = {
    approved: { 
        color: 'text-emerald-700 bg-emerald-50 border-emerald-100',   
        icon: CheckCircle2, 
        label: 'Disetujui' 
    },
    rejected: { 
        color: 'text-rose-700 bg-rose-50 border-rose-100',       
        icon: XCircle,      
        label: 'Ditolak'  
    },
    pending:  { 
        color: 'text-amber-700 bg-amber-50 border-amber-100', 
        icon: Clock,        
        label: 'Pending'  
    },
    cancelled: { 
        color: 'text-slate-500 bg-slate-50 border-slate-100', 
        icon: XCircle,        
        label: 'Dibatalkan'  
    },
} as const;

export default function Show({ booking, isAdmin }: Props) {
    const [processing, setProcessing] = useState(false);
    const [uploadingType, setUploadingType] = useState<'statement' | 'usage' | null>(null);
    const status = STATUS_CONFIG[booking.status];
    const StatusIcon = status.icon;

    const handleUpload = (type: 'statement' | 'usage', file: File) => {
        setProcessing(true);
        setUploadingType(type);
        const formData = new FormData();
        formData.append('type', type);
        formData.append('file', file);
        
        router.post(
            route('bookings.upload-verification', { booking: booking.id }),
            formData as any,
            { 
                onFinish: () => {
                    setProcessing(false);
                    setUploadingType(null);
                } 
            }
        );
    };

    const updateStatus = (newStatus: string) => {
        if (!confirm(`Apakah Anda yakin ingin mengubah status menjadi ${newStatus}?`)) return;
        setProcessing(true);
        router.patch(
            route('bookings.status', { booking: booking.id }),
            { status: newStatus },
            { onFinish: () => setProcessing(false) }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Detail Peminjaman - ${booking.room.name}`} />

            <div className="max-w-6xl mx-auto pb-20">
                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4 min-w-0">
                        <Link
                            href={route('bookings.index')}
                            className="h-11 w-11 rounded-2xl bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-50 transition-all active:scale-90 shrink-0"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight truncate">Detail Peminjaman</h1>
                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                <span className={cn('inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-wider', status.color)}>
                                    <StatusIcon className="h-3.5 w-3.5" />
                                    {status.label}
                                </span>
                                <span className="text-[12px] font-bold text-slate-400 tracking-widest uppercase">REQ-{booking.id.toString().padStart(4, '0')}</span>
                            </div>
                        </div>
                    </div>

                    {isAdmin && booking.status === 'pending' && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
                            {!booking.statement_path || !booking.usage_path ? (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 animate-pulse">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="text-[11px] font-bold">Lengkapi berkas untuk menyetujui</span>
                                </div>
                            ) : null}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => updateStatus('approved')}
                                    disabled={processing || !booking.statement_path || !booking.usage_path}
                                    className={cn(
                                        "h-11 px-6 rounded-2xl text-[13px] font-black transition-all active:scale-95 disabled:opacity-50",
                                        (!booking.statement_path || !booking.usage_path) 
                                            ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                                            : "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-100"
                                    )}
                                >
                                    Setujui Pengajuan
                                </button>
                                <button
                                    onClick={() => updateStatus('rejected')}
                                    disabled={processing}
                                    className="h-11 px-6 rounded-2xl bg-white border border-rose-200 text-rose-500 text-[13px] font-black hover:bg-rose-50 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    Tolak
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ── Left Side: Main Info ── */}
                    <div className="lg:col-span-8 space-y-8 animate-row">
                        
                        {/* Summary Card */}
                        <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-8 sm:p-10 border-b border-slate-100">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                        <Building2 className="h-7 w-7 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Ruangan yang dipesan</p>
                                        <h2 className="text-xl font-black text-slate-900 leading-tight">{booking.room.name}</h2>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                                                <Calendar className="h-4.5 w-4.5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tanggal Pelaksanaan</p>
                                                <p className="text-[14px] font-bold text-slate-800">
                                                    {new Date(booking.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                                <Clock className="h-4.5 w-4.5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu Peminjaman</p>
                                                <p className="text-[14px] font-bold text-slate-800">
                                                    {new Date(booking.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} 
                                                    <span className="mx-2 text-slate-300">-</span>
                                                    {new Date(booking.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                                <UserIcon className="h-4.5 w-4.5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peminjam / Instansi</p>
                                                <p className="text-[14px] font-bold text-slate-800">{booking.user.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                <MapPin className="h-4.5 w-4.5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lokasi</p>
                                                <p className="text-[14px] font-bold text-slate-800">Makassar Creative Hub, Gedung Utama</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 sm:p-10 bg-slate-50/30">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Keperluan / Acara</p>
                                <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-inner">
                                    <p className="text-[15px] font-medium text-slate-700 leading-relaxed italic">
                                        "{booking.purpose}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Document Section (Two Columns) ── */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-black text-slate-900 ml-4 flex items-center gap-3">
                                <ShieldCheck className="h-5 w-5 text-teal-600" />
                                Verifikasi Dokumen
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Surat Pernyataan */}
                                <div className="bg-white rounded-[2rem] border-[1.5px] border-slate-200 p-6 flex flex-col gap-6 shadow-sm hover:border-teal-200 transition-all group">
                                    <div>
                                        <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <h4 className="text-[15px] font-black text-slate-900 mb-1">Surat Pernyataan</h4>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Dokumen Verifikasi #01</p>
                                    </div>

                                    {booking.statement_path ? (
                                        <div className="flex flex-col gap-3">
                                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                <span className="text-[12px] font-black text-emerald-700">Berkas Sudah Terkirim</span>
                                            </div>
                                            <a 
                                                href={route('bookings.download', { booking: booking.id, type: 'statement' })}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-slate-900 text-white text-[11px] font-black hover:bg-teal-600 transition-all shadow-lg shadow-slate-100 hover:shadow-teal-100 active:scale-95"
                                            >
                                                <Download className="h-3.5 w-3.5" /> LIHAT BERKAS
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            {!isAdmin && booking.status === 'pending' ? (
                                                <>
                                                    <div className="flex flex-col gap-2">
                                                        <a 
                                                            href={route('bookings.generate-template', { booking: booking.id, type: 'statement' })} 
                                                            target="_blank"
                                                            className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-black hover:bg-white hover:border-teal-200 transition-all"
                                                        >
                                                            <Download className="h-3.5 w-3.5" /> UNDUH TEMPLATE
                                                        </a>
                                                        <label className={cn(
                                                            "cursor-pointer group/upload",
                                                            (processing && uploadingType === 'statement') ? "pointer-events-none opacity-80" : ""
                                                        )}>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                disabled={processing}
                                                                onChange={(e) => e.target.files?.[0] && handleUpload('statement', e.target.files[0])}
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                            />
                                                            <div className={cn(
                                                                "flex items-center justify-center gap-3 w-full h-14 rounded-2xl text-[12px] font-black transition-all shadow-xl active:scale-95",
                                                                (processing && uploadingType === 'statement') 
                                                                    ? "bg-teal-50 text-teal-400 border-2 border-dashed border-teal-200" 
                                                                    : "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-100"
                                                            )}>
                                                                {processing && uploadingType === 'statement' ? (
                                                                    <>
                                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                                        MENGUNGGAH...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Upload className="h-4 w-4 group-hover/upload:-translate-y-0.5 transition-transform" />
                                                                        UNGGAH SEKARANG
                                                                    </>
                                                                )}
                                                            </div>
                                                        </label>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="py-6 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                                    <p className="text-[11px] font-bold text-slate-300 italic">Belum ada berkas.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Surat Penggunaan Tempat */}
                                <div className="bg-white rounded-[2rem] border-[1.5px] border-slate-200 p-6 flex flex-col gap-6 shadow-sm hover:border-teal-200 transition-all group">
                                    <div>
                                        <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <h4 className="text-[15px] font-black text-slate-900 mb-1">Surat Penggunaan Tempat</h4>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Dokumen Verifikasi #02</p>
                                    </div>

                                    {booking.usage_path ? (
                                        <div className="flex flex-col gap-3">
                                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                <span className="text-[12px] font-black text-emerald-700">Berkas Sudah Terkirim</span>
                                            </div>
                                            <a 
                                                href={route('bookings.download', { booking: booking.id, type: 'usage' })}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-slate-900 text-white text-[11px] font-black hover:bg-teal-600 transition-all shadow-lg shadow-slate-100 hover:shadow-teal-100 active:scale-95"
                                            >
                                                <Download className="h-3.5 w-3.5" /> LIHAT BERKAS
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            {!isAdmin && booking.status === 'pending' ? (
                                                <>
                                                    <div className="flex flex-col gap-2">
                                                        <a 
                                                            href={route('bookings.generate-template', { booking: booking.id, type: 'usage' })} 
                                                            target="_blank"
                                                            className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-black hover:bg-white hover:border-teal-200 transition-all"
                                                        >
                                                            <Download className="h-3.5 w-3.5" /> UNDUH TEMPLATE
                                                        </a>
                                                        <label className={cn(
                                                            "cursor-pointer group/upload",
                                                            (processing && uploadingType === 'usage') ? "pointer-events-none opacity-80" : ""
                                                        )}>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                disabled={processing}
                                                                onChange={(e) => e.target.files?.[0] && handleUpload('usage', e.target.files[0])}
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                            />
                                                            <div className={cn(
                                                                "flex items-center justify-center gap-3 w-full h-14 rounded-2xl text-[12px] font-black transition-all shadow-xl active:scale-95",
                                                                (processing && uploadingType === 'usage') 
                                                                    ? "bg-teal-50 text-teal-400 border-2 border-dashed border-teal-200" 
                                                                    : "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-100"
                                                            )}>
                                                                {processing && uploadingType === 'usage' ? (
                                                                    <>
                                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                                        MENGUNGGAH...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Upload className="h-4 w-4 group-hover/upload:-translate-y-0.5 transition-transform" />
                                                                        UNGGAH SEKARANG
                                                                    </>
                                                                )}
                                                            </div>
                                                        </label>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="py-6 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                                                    <p className="text-[11px] font-bold text-slate-300 italic">Belum ada berkas.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Side: Admin / Helper Card ── */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Info Card */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full -translate-y-12 translate-x-12 blur-3xl" />
                            
                            <div className="relative z-10 space-y-6">
                                <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <AlertCircle className="h-6 w-6 text-teal-400" />
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-black tracking-tight mb-2">Informasi Penting</h3>
                                    <p className="text-[13px] text-white/50 font-medium leading-relaxed">
                                        Pastikan dokumen yang diunggah sesuai dengan template yang disediakan dan sudah ditandatangani.
                                    </p>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">ID Peminjaman</span>
                                        <span className="text-[13px] font-black tracking-wider">REQ-{booking.id.toString().padStart(4, '0')}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Diajukan Pada</span>
                                        <span className="text-[13px] font-black">
                                            {new Date(booking.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tips/Help */}
                        <div className="bg-teal-50 rounded-[2rem] p-8 border border-teal-100">
                            <h4 className="text-[14px] font-black text-teal-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                                <Info className="h-4 w-4" /> Bantuan
                            </h4>
                            <ul className="space-y-4">
                                {[
                                    'Jika status Pending, harap tunggu verifikasi Admin.',
                                    'Jika status Disetujui, segera lengkapi dokumen.',
                                    'Hubungi Admin jika ada kesalahan input data.'
                                ].map((tip, i) => (
                                    <li key={i} className="flex gap-3">
                                        <span className="h-1.5 w-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                                        <p className="text-[12px] font-bold text-teal-800/80 leading-relaxed">{tip}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
