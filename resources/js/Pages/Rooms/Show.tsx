import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    ChevronLeft, Edit, Building2, Users,
    CheckCircle2, HelpCircle, XCircle,
    Calendar, Settings, ShieldCheck, MapPin,
    ArrowRight, Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Room {
    id: number;
    name: string;
    capacity: number;
    facilities: string[];
    status: 'available' | 'maintenance' | 'unavailable';
    image_path: string | null;
    created_at: string;
}

interface Props {
    room: Room;
    canManage: boolean;
}

const STATUS_CONFIG = {
    available:   { 
        color: 'text-emerald-700 bg-emerald-50 border-emerald-100', 
        icon: CheckCircle2, 
        label: 'Tersedia' 
    },
    maintenance: { 
        color: 'text-amber-700 bg-amber-50 border-amber-100', 
        icon: HelpCircle, 
        label: 'Perbaikan' 
    },
    unavailable: { 
        color: 'text-rose-700 bg-rose-50 border-rose-100', 
        icon: XCircle, 
        label: 'Penuh / Tidak Tersedia' 
    },
} as const;

export default function Show({ room, canManage }: Props) {
    const status = STATUS_CONFIG[room.status];
    const StatusIcon = status.icon;

    return (
        <AuthenticatedLayout>
            <Head title={`Detail - ${room.name}`} />

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4 min-w-0">
                    <Link
                        href={route('rooms.index')}
                        className="group flex items-center justify-center h-11 w-11 rounded-2xl bg-white border-[1.5px] border-slate-200 text-slate-400 hover:text-slate-900 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all active:scale-90 shrink-0"
                    >
                        <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight truncate">{room.name}</h1>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                            <span className={cn('inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-wider', status.color)}>
                                <StatusIcon className="h-3.5 w-3.5" />
                                {status.label}
                            </span>
                            <span className="text-[12px] font-bold text-slate-400 tracking-widest uppercase">RM-{room.id.toString().padStart(3, '0')}</span>
                        </div>
                    </div>
                </div>
                {canManage && (
                    <Link
                        href={route('rooms.edit', room.id)}
                        className="flex items-center gap-2.5 h-11 px-6 rounded-2xl bg-slate-900 text-white text-[13px] font-black hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all active:scale-95 group shrink-0"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit Ruangan</span>
                    </Link>
                )}
            </div>

            {/* ── Content Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">

                {/* ── Left: Detail (2 cols) ── */}
                <div className="lg:col-span-2 space-y-8 animate-row">

                    {/* Photo Card */}
                    <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm overflow-hidden group">
                        <div className="relative h-80 sm:h-[480px] bg-slate-50 flex items-center justify-center overflow-hidden">
                            {room.image_path ? (
                                <img
                                    src={`/storage/${room.image_path}`}
                                    alt={room.name}
                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="h-20 w-20 rounded-[2rem] bg-white flex items-center justify-center shadow-xl shadow-slate-100 border border-slate-50">
                                        <Building2 className="h-10 w-10 text-slate-200" />
                                    </div>
                                    <p className="text-[13px] font-black text-slate-300 uppercase tracking-[0.2em]">No Photo Available</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            
                            {/* Overlay Info on Hover */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-between">
                                <div className="text-white">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Ruangan</p>
                                    <h2 className="text-xl font-black">{room.name}</h2>
                                </div>
                                <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                                    <Info className="h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Stats Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Kapasitas',    value: `${room.capacity} Orang`, icon: Users,      color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
                            { label: 'Tipe Ruangan', value: 'Standard',               icon: Building2,  color: 'bg-slate-50 border-slate-100 text-slate-600' },
                            { label: 'Status',       value: status.label,             icon: StatusIcon, color: status.color },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-3xl border-[1.5px] border-slate-200 shadow-sm p-5 hover:shadow-md transition-all duration-300">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{item.label}</p>
                                <div className="flex items-center gap-3">
                                    <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border', item.color)}>
                                        <item.icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-[15px] font-black text-slate-900">{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Fasilitas Section */}
                    <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                <Settings className="h-5 w-5 text-slate-400" />
                            </div>
                            <h3 className="text-[17px] font-black text-slate-900">Fasilitas & Perlengkapan</h3>
                        </div>
                        
                        {(room.facilities || []).length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {room.facilities.map((f, i) => (
                                    <div 
                                        key={i} 
                                        className="flex items-center gap-3 p-4 bg-white border-[1.5px] border-slate-100 rounded-2xl shadow-sm hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50 transition-all duration-300 group"
                                    >
                                        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                                            <ShieldCheck className="h-4 w-4 text-slate-400 group-hover:text-white" />
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-700">{f}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                <ShieldCheck className="h-10 w-10 text-slate-200 mb-2" />
                                <p className="text-[13px] font-bold text-slate-400 italic">Belum ada fasilitas ditambahkan.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right: Sidebar ── */}
                <div className="space-y-8 animate-row" style={{ animationDelay: '150ms' }}>

                    {/* Lokasi Card (Premium Dark) */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-200">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-12 translate-x-12 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
                        
                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20">
                                <MapPin className="h-6 w-6 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-black tracking-tight mb-6">Lokasi & Akses</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Gedung / Lantai</p>
                                    <p className="text-base font-bold">Gedung Utama, Lantai 2</p>
                                </div>
                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-[13px] text-white/50 leading-relaxed mb-6 font-medium">
                                        Butuh akses khusus atau bantuan teknis saat menggunakan ruangan ini? Tim operasional kami siap membantu.
                                    </p>
                                    <button className="w-full h-12 rounded-2xl bg-white text-slate-900 text-[13px] font-black hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-black/20">
                                        Hubungi Operasional
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking CTA Card */}
                    <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm p-8 text-center group hover:border-indigo-200 transition-all duration-500">
                        <div className="h-16 w-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all duration-500">
                            <Calendar className="h-8 w-8 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800">Ajukan Peminjaman</h3>
                        <p className="text-[13px] font-medium text-slate-400 mt-2 mb-6">Pastikan jadwal tersedia dan ajukan sekarang untuk mengamankan ruangan.</p>
                        <Link
                            href={route('bookings.create', { room_id: room.id })}
                            className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-teal-600 text-white text-[13px] font-black hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-100 transition-all active:scale-95 group/btn mb-4"
                        >
                            <Calendar className="h-5 w-5" />
                            SEWA RUANGAN SEKARANG
                        </Link>
                        <Link
                            href={route('calendar.index')}
                            className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-white border border-slate-200 text-slate-500 text-[12px] font-black hover:text-teal-600 hover:border-teal-200 transition-all active:scale-95 group/btn"
                        >
                            Cek Jadwal Kalender
                            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                    </div>

                    {/* Meta Info List */}
                    <div className="bg-slate-50/50 rounded-[2rem] p-6 border-[1.5px] border-slate-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Informasi Sistem</p>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] font-bold text-slate-400">ID Ruangan</span>
                                <span className="text-[13px] font-black text-slate-800 tracking-wider">RM-{room.id.toString().padStart(3, '0')}</span>
                            </div>
                            <div className="h-px bg-slate-200/50" />
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] font-bold text-slate-400">Ditambahkan</span>
                                <span className="text-[13px] font-black text-slate-800">
                                    {new Date(room.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
