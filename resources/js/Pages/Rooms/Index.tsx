import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Building2, Users, Plus, Info, CheckCircle2,
    HelpCircle, XCircle, Edit, Trash2, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Room {
    id: number;
    name: string;
    capacity: number;
    facilities: string[];
    status: 'available' | 'maintenance' | 'unavailable';
}

interface Props {
    rooms: Room[];
    canManage: boolean;
}

const STATUS_CONFIG = {
    available:   { color: 'text-green-700 bg-green-50',  icon: CheckCircle2, label: 'Tersedia'  },
    maintenance: { color: 'text-yellow-700 bg-yellow-50', icon: HelpCircle,  label: 'Perbaikan' },
    unavailable: { color: 'text-red-700 bg-red-50',      icon: XCircle,      label: 'Penuh'     },
} as const;

export default function Index({ rooms, canManage }: Props) {
    const { delete: destroy, processing } = useForm();
    const [search, setSearch] = useState('');

    const deleteRoom = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) {
            destroy(route('rooms.destroy', id));
        }
    };

    const total       = rooms.length;
    const available   = rooms.filter(r => r.status === 'available').length;
    const maintenance = rooms.filter(r => r.status === 'maintenance').length;
    const unavailable = rooms.filter(r => r.status === 'unavailable').length;

    const statCards = [
        { label: 'Total Ruangan', value: total,       icon: Building2,    color: 'bg-gray-50 text-gray-400'    },
        { label: 'Tersedia',      value: available,   icon: CheckCircle2, color: 'bg-green-50 text-green-500'  },
        { label: 'Perbaikan',     value: maintenance, icon: HelpCircle,   color: 'bg-yellow-50 text-yellow-500' },
        { label: 'Penuh',         value: unavailable, icon: XCircle,      color: 'bg-red-50 text-red-500'      },
    ];

    const filtered = rooms.filter(r =>
        search === '' ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.status.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Ruangan" />

            {/* ── Page Header ── */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Manajemen Ruangan</h1>
                        <p className="text-[12px] text-gray-400 mt-0.5">Kelola daftar ruangan, kapasitas, dan fasilitas tersedia</p>
                    </div>
                    {canManage && (
                        <Link
                            href={route('rooms.create')}
                            className="flex items-center gap-2 h-9 px-4 rounded-lg bg-gray-900 text-white text-[12px] font-semibold hover:bg-gray-800 transition-colors"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Tambah Ruangan
                        </Link>
                    )}
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {statCards.map((s, i) => (
                        <div key={i} className="card-lift bg-white rounded-xl border-2 border-gray-200 shadow-sm px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3 animate-row" style={{ animationDelay: `${i * 60}ms` }}>
                            <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', s.color)}>
                                <s.icon className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gray-900 leading-none">{s.value}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Search ── */}
            <div className="flex items-center gap-3 bg-white border-2 border-gray-200 shadow-sm rounded-xl px-4 py-2.5 mb-4">
                <Search className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Cari nama ruangan atau status..."
                    className="flex-1 text-[13px] text-gray-700 placeholder:text-gray-400 bg-transparent outline-none"
                />
            </div>

            {/* ── Desktop Table ── */}
            <div className="hidden sm:block bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 px-5 py-3 bg-gray-50/60 border-b border-gray-200">
                    <p className="col-span-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Detail Ruangan</p>
                    <p className="col-span-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Kapasitas</p>
                    <p className="col-span-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Fasilitas</p>
                    <p className="col-span-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Aksi</p>
                </div>

                {filtered.map((room, i) => {
                    const st = STATUS_CONFIG[room.status];
                    const Icon = st.icon;
                    return (
                        <div
                            key={room.id}
                            className={cn(
                                'grid grid-cols-12 px-5 py-4 items-center hover:bg-gray-50/60 transition-colors group animate-row',
                                i < filtered.length - 1 && 'border-b border-gray-100'
                            )}
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            {/* Room name */}
                            <div className="col-span-4 flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
                                    <Building2 className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="min-w-0">
                                    <Link href={route('rooms.show', room.id)}>
                                        <p className="text-[13px] font-semibold text-gray-800 hover:text-gray-900 truncate">{room.name}</p>
                                    </Link>
                                    <p className="text-[11px] text-gray-400">RM-{room.id.toString().padStart(3, '0')}</p>
                                </div>
                            </div>

                            {/* Kapasitas */}
                            <div className="col-span-2 flex items-center gap-1.5">
                                <Users className="h-3.5 w-3.5 text-gray-400" />
                                <span className="text-[13px] font-semibold text-gray-700">{room.capacity}</span>
                                <span className="text-[11px] text-gray-400">orang</span>
                            </div>

                            {/* Fasilitas */}
                            <div className="col-span-4 flex flex-wrap gap-1.5">
                                {(room.facilities || []).slice(0, 3).map((f, fi) => (
                                    <span key={fi} className="text-[11px] font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                                        {f}
                                    </span>
                                ))}
                                {room.facilities?.length > 3 && (
                                    <span className="text-[11px] font-medium px-2 py-0.5 bg-gray-100 text-gray-400 rounded-md">
                                        +{room.facilities.length - 3}
                                    </span>
                                )}
                                {(!room.facilities || room.facilities.length === 0) && (
                                    <span className="text-[12px] text-gray-400 italic">Tidak ada</span>
                                )}
                            </div>

                            {/* Aksi */}
                            <div className="col-span-2 flex items-center justify-end gap-2">
                                <span className={cn('flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full', st.color)}>
                                    <Icon className="h-3 w-3" />
                                    {st.label}
                                </span>
                                <Link href={route('rooms.show', room.id)}>
                                    <button className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                                        <Info className="h-3.5 w-3.5" />
                                    </button>
                                </Link>
                                {canManage && (
                                    <>
                                        <Link href={route('rooms.edit', room.id)}>
                                            <button className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                                                <Edit className="h-3.5 w-3.5" />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => deleteRoom(room.id)}
                                            disabled={processing}
                                            className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <Building2 className="h-7 w-7 text-gray-200" />
                        </div>
                        <div className="text-center">
                            <p className="text-[14px] font-semibold text-gray-700">
                                {search ? 'Tidak ditemukan' : 'Belum ada ruangan'}
                            </p>
                            <p className="text-[12px] text-gray-400 mt-1">
                                {search ? `Tidak ada ruangan untuk "${search}"` : 'Belum ada ruangan yang ditambahkan ke sistem.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Mobile Card List ── */}
            <div className="sm:hidden space-y-3">
                {filtered.map((room, i) => {
                    const st = STATUS_CONFIG[room.status];
                    const Icon = st.icon;
                    return (
                        <div key={room.id} className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-4 animate-row" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                        <Building2 className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <div>
                                        <Link href={route('rooms.show', room.id)}>
                                            <p className="text-[13px] font-semibold text-gray-800">{room.name}</p>
                                        </Link>
                                        <p className="text-[11px] text-gray-400">RM-{room.id.toString().padStart(3, '0')}</p>
                                    </div>
                                </div>
                                <span className={cn('flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0', st.color)}>
                                    <Icon className="h-3 w-3" />
                                    {st.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                                    <Users className="h-3.5 w-3.5 text-gray-400" />
                                    {room.capacity} orang
                                </div>
                                {(room.facilities || []).slice(0, 2).map((f, fi) => (
                                    <span key={fi} className="text-[11px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">{f}</span>
                                ))}
                                {room.facilities?.length > 2 && <span className="text-[11px] text-gray-400">+{room.facilities.length - 2}</span>}
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <Link href={route('rooms.show', room.id)}>
                                    <button className="h-8 px-3 rounded-lg text-[12px] font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">Detail</button>
                                </Link>
                                {canManage && (
                                    <>
                                        <Link href={route('rooms.edit', room.id)}>
                                            <button className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                                                <Edit className="h-3.5 w-3.5" />
                                            </button>
                                        </Link>
                                        <button onClick={() => deleteRoom(room.id)} disabled={processing} className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <Building2 className="h-7 w-7 text-gray-200" />
                        </div>
                        <div className="text-center">
                            <p className="text-[14px] font-semibold text-gray-700">{search ? 'Tidak ditemukan' : 'Belum ada ruangan'}</p>
                            <p className="text-[12px] text-gray-400 mt-1">{search ? `"${search}" tidak ditemukan` : 'Belum ada ruangan ditambahkan.'}</p>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
