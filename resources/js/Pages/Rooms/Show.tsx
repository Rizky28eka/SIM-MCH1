import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import {
    ChevronLeft, Edit, Building2, Users,
    CheckCircle2, HelpCircle, XCircle,
    Calendar, Settings, ShieldCheck, MapPin,
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
    available:   { color: 'text-green-700 bg-green-50',   icon: CheckCircle2, label: 'Tersedia'               },
    maintenance: { color: 'text-yellow-700 bg-yellow-50', icon: HelpCircle,   label: 'Perbaikan'              },
    unavailable: { color: 'text-red-700 bg-red-50',       icon: XCircle,      label: 'Penuh / Tidak Tersedia' },
} as const;

export default function Show({ room, canManage }: Props) {
    const status = STATUS_CONFIG[room.status];
    const StatusIcon = status.icon;

    return (
        <AuthenticatedLayout>
            <Head title={`Detail - ${room.name}`} />

            {/* ── Page Header ── */}
            <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
                <div className="flex items-center gap-3 min-w-0">
                    <Link
                        href={route('rooms.index')}
                        className="group flex items-center justify-center h-9 w-9 rounded-lg bg-white border-2 border-gray-200 text-gray-400 hover:text-gray-900 transition-all shadow-sm active:scale-95 shrink-0"
                    >
                        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight truncate">{room.name}</h1>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className={cn('flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full', status.color)}>
                                <StatusIcon className="h-3 w-3" />
                                {status.label}
                            </span>
                            <span className="text-[11px] text-gray-400">RM-{room.id.toString().padStart(3, '0')}</span>
                        </div>
                    </div>
                </div>
                {canManage && (
                    <Link
                        href={route('rooms.edit', room.id)}
                        className="flex items-center gap-1.5 sm:gap-2 h-9 px-3 sm:px-4 rounded-lg bg-gray-900 text-white text-[12px] font-semibold hover:bg-gray-800 transition-colors shrink-0"
                    >
                        <Edit className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Edit Ruangan</span>
                        <span className="sm:hidden">Edit</span>
                    </Link>
                )}
            </div>

            {/* ── Content Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* ── Left: Detail (2 cols) ── */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Photo */}
                    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
                        <div className="relative h-72 sm:h-96 bg-gray-50 flex items-center justify-center group overflow-hidden">
                            {room.image_path ? (
                                <img
                                    src={`/storage/${room.image_path}`}
                                    alt={room.name}
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                        <Building2 className="h-8 w-8 text-gray-200" />
                                    </div>
                                    <p className="text-[12px] font-semibold text-gray-300 uppercase tracking-widest">Belum Ada Foto</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    </div>

                    {/* Info Stats: 1 col xs → 3 cols sm */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { label: 'Kapasitas',    value: `${room.capacity} Orang`, icon: Users,      bg: 'bg-blue-50',   ic: 'text-blue-500'   },
                            { label: 'Tipe Ruangan', value: 'Standard',               icon: Building2,  bg: 'bg-purple-50', ic: 'text-purple-500' },
                            { label: 'Status',       value: status.label,             icon: StatusIcon, bg: status.color.split(' ')[1] + ' ' + status.color.split(' ')[1], ic: status.color.split(' ')[0] },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-3 sm:p-4">
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{item.label}</p>
                                <div className="flex items-center gap-2">
                                    <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', item.bg)}>
                                        <item.icon className={cn('h-4 w-4', item.ic)} />
                                    </div>
                                    <span className="text-[13px] font-bold text-gray-800">{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Fasilitas */}
                    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Settings className="h-4 w-4 text-gray-400" />
                            <h3 className="text-[14px] font-semibold text-gray-800">Fasilitas Tersedia</h3>
                        </div>
                        {(room.facilities || []).length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {room.facilities.map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all group">
                                        <ShieldCheck className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                        <span className="text-[12px] font-semibold text-gray-700">{f}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[12px] text-gray-400 italic py-4">Belum ada fasilitas yang ditambahkan.</p>
                        )}
                    </div>
                </div>

                {/* ── Right: Sidebar ── */}
                <div className="space-y-5">

                    {/* Lokasi Card (dark) */}
                    <div className="bg-gray-900 rounded-xl p-5 text-white">
                        <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                            <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-[15px] font-bold tracking-tight mb-4">Lokasi & Akses</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">Gedung / Lantai</p>
                                <p className="text-[13px] font-semibold">Gedung Utama, Lantai 2</p>
                            </div>
                            <div className="pt-4 border-t border-white/10">
                                <p className="text-[11px] text-white/40 leading-relaxed mb-3">
                                    Butuh akses kunci atau bantuan teknis? Hubungi tim Operasional.
                                </p>
                                <button className="w-full h-10 rounded-lg bg-white text-gray-900 text-[12px] font-semibold hover:bg-gray-100 transition-colors active:scale-95">
                                    Hubungi Tim Operasional
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Booking CTA */}
                    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-5 text-center">
                        <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                            <Calendar className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-[14px] font-semibold text-gray-800">Ingin Menggunakan Ruangan?</h3>
                        <p className="text-[12px] text-gray-400 mt-1 mb-4">Segera ajukan jadwal sebelum slot terisi.</p>
                        <Link
                            href={route('bookings.index')}
                            className="w-full h-10 rounded-lg border-2 border-gray-200 bg-white text-[12px] font-semibold text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 flex items-center justify-center"
                        >
                            Ajukan Peminjaman
                        </Link>
                    </div>

                    {/* Meta info */}
                    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-5">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Informasi Sistem</p>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-[12px] text-gray-400">ID Ruangan</span>
                                <span className="text-[12px] font-semibold text-gray-700">RM-{room.id.toString().padStart(3, '0')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[12px] text-gray-400">Ditambahkan</span>
                                <span className="text-[12px] font-semibold text-gray-700">
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
