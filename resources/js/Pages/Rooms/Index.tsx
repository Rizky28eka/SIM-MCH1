import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Building2, Users, Plus, Info, CheckCircle2,
    HelpCircle, XCircle, Edit, Trash2, Search,
    LayoutGrid, List, SlidersHorizontal, ArrowRight,
    Calendar
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
        label: 'Penuh' 
    },
} as const;

export default function Index({ rooms, canManage }: Props) {
    const { delete: destroy, processing } = useForm();
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

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
        { label: 'Total Ruangan', value: total,       icon: Building2,    color: 'bg-slate-50 text-slate-400 border-slate-100'    },
        { label: 'Tersedia',      value: available,   icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-500 border-emerald-100'  },
        { label: 'Perbaikan',     value: maintenance, icon: HelpCircle,   color: 'bg-amber-50 text-amber-500 border-amber-100' },
        { label: 'Penuh',         value: unavailable, icon: XCircle,      color: 'bg-rose-50 text-rose-500 border-rose-100'      },
    ];

    const filtered = rooms.filter(r =>
        search === '' ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.status.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Ruangan" />

            {/* ── Page Header ── */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            Manajemen Ruangan
                            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                        </h1>
                        <p className="text-[13px] text-slate-400 mt-1 font-medium">
                            Kelola daftar ruangan, kapasitas, dan fasilitas tersedia secara efisien.
                        </p>
                    </div>
                    {canManage && (
                        <Link
                            href={route('rooms.create')}
                            className="flex items-center gap-2 h-11 px-6 rounded-2xl bg-slate-900 text-white text-[13px] font-bold hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 group"
                        >
                            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                            Tambah Ruangan
                        </Link>
                    )}
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((s, i) => (
                        <div 
                            key={i} 
                            className="group bg-white rounded-2xl border-[1.5px] border-slate-200 shadow-sm p-4 flex items-center gap-4 animate-row hover:border-indigo-200 hover:shadow-md transition-all duration-300" 
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-110', s.color)}>
                                <s.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 leading-none tracking-tight">{s.value}</p>
                                <p className="text-[12px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Filter & Search Bar ── */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Cari nama ruangan, kode, atau status..."
                        className="h-12 w-full pl-11 pr-4 bg-white border-[1.5px] border-slate-200 rounded-2xl text-[14px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 shadow-sm transition-all"
                    />
                </div>
                
                <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-xl border border-slate-200 shrink-0">
                    <button 
                        onClick={() => setViewMode('table')}
                        className={cn(
                            "h-10 px-4 rounded-lg flex items-center gap-2 text-[13px] font-bold transition-all",
                            viewMode === 'table' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <List className="h-4 w-4" />
                        Table
                    </button>
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            "h-10 px-4 rounded-lg flex items-center gap-2 text-[13px] font-bold transition-all",
                            viewMode === 'grid' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <LayoutGrid className="h-4 w-4" />
                        Grid
                    </button>
                </div>
            </div>

            {/* ── Table View ── */}
            {viewMode === 'table' && (
                <div className="hidden sm:block bg-white rounded-3xl border-[1.5px] border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ruangan</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Kapasitas</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Fasilitas</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((room, i) => {
                                const st = STATUS_CONFIG[room.status];
                                const Icon = st.icon;
                                return (
                                    <tr 
                                        key={room.id} 
                                        className="hover:bg-slate-50/50 transition-colors group animate-row"
                                        style={{ animationDelay: `${i * 30}ms` }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-white group-hover:shadow-md transition-all">
                                                    <Building2 className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <div className="min-w-0">
                                                    <Link href={route('rooms.show', room.id)} className="block">
                                                        <p className="text-[14px] font-bold text-slate-800 hover:text-indigo-600 transition-colors truncate">{room.name}</p>
                                                    </Link>
                                                    <p className="text-[11px] font-medium text-slate-400 tracking-tight uppercase mt-0.5">RM-{room.id.toString().padStart(3, '0')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[13px] border border-slate-200">
                                                    {room.capacity}
                                                </div>
                                                <span className="text-[11px] font-medium text-slate-400">Orang</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {(room.facilities || []).slice(0, 3).map((f, fi) => (
                                                    <span key={fi} className="text-[10px] font-bold px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-lg shadow-sm">
                                                        {f}
                                                    </span>
                                                ))}
                                                {room.facilities?.length > 3 && (
                                                    <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-400 rounded-lg">
                                                        +{room.facilities.length - 3}
                                                    </span>
                                                )}
                                                {(!room.facilities || room.facilities.length === 0) && (
                                                    <span className="text-[12px] text-slate-300 italic">No facilities</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn('inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border', st.color)}>
                                                <Icon className="h-3.5 w-3.5" />
                                                {st.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link href={route('bookings.create', { room_id: room.id })} title="Sewa Ruangan">
                                                    <button className="h-9 px-4 rounded-xl flex items-center justify-center gap-2 bg-teal-600 text-white text-[11px] font-black hover:bg-teal-700 transition-all active:scale-95 shadow-sm shadow-teal-100">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        SEWA
                                                    </button>
                                                </Link>
                                                <Link href={route('rooms.show', room.id)} title="Detail">
                                                    <button className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 border border-transparent hover:border-teal-100 transition-all active:scale-90">
                                                        <ArrowRight className="h-4 w-4" />
                                                    </button>
                                                </Link>
                                                {canManage && (
                                                    <>
                                                        <Link href={route('rooms.edit', room.id)} title="Edit">
                                                            <button className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-100 transition-all active:scale-90">
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteRoom(room.id)}
                                                            disabled={processing}
                                                            title="Hapus"
                                                            className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all active:scale-90 disabled:opacity-30"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Grid View ── */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((room, i) => {
                        const st = STATUS_CONFIG[room.status];
                        return (
                            <div 
                                key={room.id} 
                                className="group bg-white rounded-[2rem] border-[1.5px] border-slate-200 shadow-sm p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-200 transition-all duration-500 animate-row relative overflow-hidden"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    <span className={cn('flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-wider', st.color)}>
                                        <st.icon className="h-3 w-3" />
                                        {st.label}
                                    </span>
                                </div>
                                
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all duration-500">
                                            <Building2 className="h-7 w-7 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                        </div>
                                        <div>
                                            <Link href={route('rooms.show', room.id)}>
                                                <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                                                    {room.name}
                                                </h3>
                                            </Link>
                                            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">RM-{room.id.toString().padStart(3, '0')}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kapasitas</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-slate-900">{room.capacity}</span>
                                                <span className="text-[11px] font-bold text-slate-400">Orang</span>
                                            </div>
                                        </div>
                                        <div className="h-8 w-px bg-slate-200" />
                                        <div className="flex flex-col flex-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fasilitas</span>
                                            <p className="text-[12px] font-bold text-slate-700 truncate">
                                                {room.facilities?.length > 0 ? room.facilities.join(', ') : 'None'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-3 pt-2">
                                        <div className="flex items-center gap-2">
                                            {canManage && (
                                                <>
                                                    <Link href={route('rooms.edit', room.id)}>
                                                        <button className="h-10 w-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-200 hover:shadow-sm transition-all active:scale-95">
                                                            <Edit className="h-4.5 w-4.5" />
                                                        </button>
                                                    </Link>
                                                    <button 
                                                        onClick={() => deleteRoom(room.id)}
                                                        disabled={processing}
                                                        className="h-10 w-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-300 hover:text-rose-600 hover:border-rose-200 hover:shadow-sm transition-all active:scale-95 disabled:opacity-30"
                                                    >
                                                        <Trash2 className="h-4.5 w-4.5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                        <Link href={route('bookings.create', { room_id: room.id })} className="flex-1">
                                            <button className="w-full h-10 px-4 rounded-xl bg-teal-600 text-white text-[12px] font-black hover:bg-teal-700 transition-all shadow-sm hover:shadow-lg hover:shadow-teal-100 flex items-center justify-center gap-2 group/btn">
                                                <Calendar className="h-4 w-4" />
                                                SEWA RUANGAN
                                            </button>
                                        </Link>
                                        <Link href={route('rooms.show', room.id)} className="flex-1 max-w-[100px]">
                                            <button className="w-full h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-400 text-[12px] font-black hover:text-teal-600 hover:border-teal-200 transition-all shadow-sm flex items-center justify-center gap-2 group/btn">
                                                DETAIL 
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Mobile View (Cards) ── */}
            <div className="sm:hidden space-y-4">
                {filtered.map((room, i) => {
                    const st = STATUS_CONFIG[room.status];
                    return (
                        <div key={room.id} className="bg-white rounded-3xl border-[1.5px] border-slate-200 shadow-sm p-5 animate-row" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200">
                                        <Building2 className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <Link href={route('rooms.show', room.id)}>
                                            <p className="text-[15px] font-black text-slate-900 leading-tight">{room.name}</p>
                                        </Link>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">RM-{room.id.toString().padStart(3, '0')}</p>
                                    </div>
                                </div>
                                <span className={cn('inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1.5 rounded-full border uppercase tracking-wider shrink-0', st.color)}>
                                    <st.icon className="h-3 w-3" />
                                    {st.label}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kapasitas</p>
                                    <p className="text-sm font-black text-slate-800">{room.capacity} Orang</p>
                                </div>
                                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fasilitas</p>
                                    <p className="text-sm font-black text-slate-800 truncate">{room.facilities?.length || 0} Item</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    {canManage && (
                                        <>
                                            <Link href={route('rooms.edit', room.id)}>
                                                <button className="h-9 w-9 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-200">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                            </Link>
                                            <button onClick={() => deleteRoom(room.id)} disabled={processing} className="h-9 w-9 rounded-xl flex items-center justify-center bg-slate-50 text-slate-300 border border-slate-200">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                                <Link href={route('bookings.create', { room_id: room.id })} className="flex-[2]">
                                    <button className="w-full h-11 rounded-xl bg-teal-600 text-white text-[12px] font-black hover:bg-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-100">
                                        <Calendar className="h-4 w-4" /> SEWA RUANGAN
                                    </button>
                                </Link>
                                <Link href={route('rooms.show', room.id)} className="flex-1">
                                    <button className="w-full h-11 rounded-xl bg-slate-100 text-slate-400 text-[12px] font-bold hover:bg-white border border-transparent hover:border-slate-200 transition-all flex items-center justify-center">
                                        DETAIL
                                    </button>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Empty State ── */}
            {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-[2.5rem] border-[1.5px] border-dashed border-slate-200 shadow-inner">
                    <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-100">
                        <Building2 className="h-10 w-10 text-slate-200" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-black text-slate-800 tracking-tight">
                            {search ? 'Tidak Ditemukan' : 'Ruangan Masih Kosong'}
                        </p>
                        <p className="text-[14px] text-slate-400 mt-2 font-medium max-w-[280px] mx-auto">
                            {search ? `Maaf, kami tidak menemukan ruangan dengan kata kunci "${search}".` : 'Mulai kelola aset ruangan Anda dengan menambahkan data ruangan baru.'}
                        </p>
                    </div>
                    {canManage && !search && (
                        <Link
                            href={route('rooms.create')}
                            className="mt-2 flex items-center gap-2 h-11 px-8 rounded-2xl bg-indigo-600 text-white text-[13px] font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Ruangan Pertama
                        </Link>
                    )}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
