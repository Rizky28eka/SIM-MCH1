import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import {
    Calendar, Clock, CheckCircle2, XCircle, FileText,
    Download, MoreHorizontal, User as UserIcon, Building2,
    CalendarCheck, Search, Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Booking {
    id: number;
    room: { name: string };
    user: { name: string };
    start_time: string;
    end_time: string;
    purpose: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface Props {
    bookings: Booking[];
    isAdmin: boolean;
}

const STATUS_CONFIG = {
    approved: { color: 'text-green-700 bg-green-50',   icon: CheckCircle2, label: 'Disetujui' },
    rejected: { color: 'text-red-700 bg-red-50',       icon: XCircle,      label: 'Ditolak'  },
    pending:  { color: 'text-yellow-700 bg-yellow-50', icon: Clock,        label: 'Pending'  },
} as const;

const TABS = [
    { id: 'semua',    label: 'Semua'     },
    { id: 'pending',  label: 'Pending'   },
    { id: 'approved', label: 'Disetujui' },
    { id: 'rejected', label: 'Ditolak'   },
];

export default function Index({ bookings, isAdmin }: Props) {
    const [processing, setProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState('semua');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [visible, setVisible] = useState(true);
    const PER_PAGE = 10;

    const updateStatus = (id: number, status: string) => {
        setProcessing(true);
        router.patch(
            route('bookings.status', { booking: id }),
            { status },
            { onFinish: () => setProcessing(false) }
        );
    };

    // Animasi fade-out → update state → fade-in
    const changePage = (newPage: number) => {
        setVisible(false);
        setTimeout(() => { setPage(newPage); setVisible(true); }, 180);
    };

    const handleTabChange = (tab: string) => {
        setVisible(false);
        setTimeout(() => { setActiveTab(tab); setPage(1); setVisible(true); }, 180);
    };

    const handleSearch = (q: string) => {
        setSearch(q);
        setPage(1);
    };

    const total    = bookings.length;
    const pending  = bookings.filter(b => b.status === 'pending').length;
    const approved = bookings.filter(b => b.status === 'approved').length;
    const rejected = bookings.filter(b => b.status === 'rejected').length;

    const statCards = [
        { label: 'Total',      value: total,    icon: CalendarCheck, color: 'bg-gray-50 text-gray-400'    },
        { label: 'Menunggu',   value: pending,  icon: Clock,         color: 'bg-yellow-50 text-yellow-500' },
        { label: 'Disetujui',  value: approved, icon: CheckCircle2,  color: 'bg-green-50 text-green-500'  },
        { label: 'Ditolak',    value: rejected, icon: XCircle,       color: 'bg-red-50 text-red-500'      },
    ];

    const filtered = bookings.filter(b => {
        const matchTab    = activeTab === 'semua' || b.status === activeTab;
        const matchSearch = search === '' ||
            b.room.name.toLowerCase().includes(search.toLowerCase()) ||
            b.user.name.toLowerCase().includes(search.toLowerCase()) ||
            b.purpose.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <AuthenticatedLayout>
            <Head title="Peminjaman" />

            {/* ── Page Header ── */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-start sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Peminjaman Ruangan</h1>
                        <p className="text-[12px] text-gray-400 mt-0.5">Kelola semua pengajuan peminjaman ruangan</p>
                    </div>
                    {isAdmin && (
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => window.open(route('export.bookings.excel'))}
                                className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 bg-white text-[12px] text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                            >
                                <FileText className="h-3.5 w-3.5 text-green-600" />
                                <span className="hidden sm:inline">Excel</span>
                            </button>
                            <button
                                onClick={() => window.open(route('export.bookings.pdf'))}
                                className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 bg-white text-[12px] text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                            >
                                <Download className="h-3.5 w-3.5 text-red-500" />
                                <span className="hidden sm:inline">PDF</span>
                            </button>
                        </div>
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

                {/* Tab Navigation — horizontally scrollable on mobile */}
                <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                    {TABS.map(tab => {
                        const count = tab.id === 'semua' ? total : tab.id === 'pending' ? pending : tab.id === 'approved' ? approved : rejected;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={cn(
                                    'flex items-center gap-2 px-3 sm:px-4 py-2.5 text-[13px] font-medium transition-all duration-200 border-b-2 -mb-px whitespace-nowrap shrink-0',
                                    activeTab === tab.id ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-200'
                                )}
                            >
                                {tab.label}
                                <span className={cn('inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold', activeTab === tab.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500')}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Search ── */}
            <div className="flex items-center gap-3 bg-white border-2 border-gray-200 shadow-sm rounded-xl px-4 py-2.5 mb-4">
                <Search className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                    type="text"
                    value={search}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Cari ruangan, peminjam..."
                    className="flex-1 text-[13px] text-gray-700 placeholder:text-gray-400 bg-transparent outline-none min-w-0"
                />
            </div>

            {/* ── Desktop Table (hidden on mobile) ── */}
            <div
                className={cn(
                    'hidden sm:block bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden transition-all duration-200',
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                )}
            >
                <div className="grid grid-cols-12 px-5 py-3 bg-gray-50/60 border-b border-gray-200">
                    <p className="col-span-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Detail Peminjaman</p>
                    <p className="col-span-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Waktu</p>
                    <p className="col-span-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Keperluan</p>
                    <p className="col-span-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Aksi</p>
                </div>
                {paginated.map((booking, i) => {
                    const st = STATUS_CONFIG[booking.status];
                    const Icon = st.icon;
                    return (
                        <div
                            key={booking.id}
                            className={cn('grid grid-cols-12 px-5 py-4 items-center hover:bg-gray-50/60 transition-colors group animate-row', i < paginated.length - 1 && 'border-b border-gray-100')}
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            <div className="col-span-4 flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
                                    <Building2 className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13px] font-semibold text-gray-800 truncate">{booking.room.name}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <UserIcon className="h-3 w-3 text-gray-300" />
                                        <p className="text-[11px] text-gray-400 truncate">{booking.user.name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3">
                                <div className="flex items-center gap-1.5 text-[12px] font-medium text-gray-700">
                                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                    {new Date(booking.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
                                    <Clock className="h-3 w-3" />
                                    {new Date(booking.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    {' – '}
                                    {new Date(booking.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <div className="col-span-3">
                                <p className="text-[12px] text-gray-600 line-clamp-2 pr-4">{booking.purpose}</p>
                            </div>
                            <div className="col-span-2 flex items-center justify-end gap-2">
                                <span className={cn('flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full', st.color)}>
                                    <Icon className="h-3 w-3" />
                                    {st.label}
                                </span>
                                {isAdmin && booking.status === 'pending' && (
                                    <div className="flex gap-1.5">
                                        <button onClick={() => updateStatus(booking.id, 'approved')} disabled={processing} className="h-7 px-2.5 rounded-lg bg-green-50 text-green-700 text-[11px] font-semibold hover:bg-green-100 transition-colors disabled:opacity-50">
                                            Setujui
                                        </button>
                                        <button onClick={() => updateStatus(booking.id, 'rejected')} disabled={processing} className="h-7 px-2.5 rounded-lg bg-red-50 text-red-700 text-[11px] font-semibold hover:bg-red-100 transition-colors disabled:opacity-50">
                                            Tolak
                                        </button>
                                    </div>
                                )}
                                {!(isAdmin && booking.status === 'pending') && (
                                    <button className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
                {paginated.length === 0 && <EmptyState search={search} icon={CalendarCheck} label="peminjaman" />}
            </div>

            {/* ── Mobile Card List (hidden on sm+) ── */}
            <div
                className={cn(
                    'sm:hidden space-y-3 transition-all duration-200',
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                )}
            >
                {paginated.map((booking, i) => {
                    const st = STATUS_CONFIG[booking.status];
                    const Icon = st.icon;
                    return (
                        <div key={booking.id} className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-4 animate-row" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                        <Building2 className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-gray-800">{booking.room.name}</p>
                                        <div className="flex items-center gap-1">
                                            <UserIcon className="h-3 w-3 text-gray-300" />
                                            <p className="text-[11px] text-gray-400">{booking.user.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <span className={cn('flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0', st.color)}>
                                    <Icon className="h-3 w-3" />
                                    {st.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-[12px] text-gray-500 mb-2">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                    {new Date(booking.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    {new Date(booking.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}–{new Date(booking.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <p className="text-[12px] text-gray-500 line-clamp-1 mb-3">{booking.purpose}</p>
                            {isAdmin && booking.status === 'pending' && (
                                <div className="flex gap-2">
                                    <button onClick={() => updateStatus(booking.id, 'approved')} disabled={processing} className="flex-1 h-9 rounded-lg bg-green-50 text-green-700 text-[12px] font-semibold hover:bg-green-100 transition-colors disabled:opacity-50">Setujui</button>
                                    <button onClick={() => updateStatus(booking.id, 'rejected')} disabled={processing} className="flex-1 h-9 rounded-lg bg-red-50 text-red-700 text-[12px] font-semibold hover:bg-red-100 transition-colors disabled:opacity-50">Tolak</button>
                                </div>
                            )}
                        </div>
                    );
                })}
                {paginated.length === 0 && <EmptyState search={search} icon={CalendarCheck} label="peminjaman" />}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 bg-white border-2 border-gray-200 shadow-sm rounded-xl px-4 py-3">
                    <p className="text-[12px] text-gray-400">
                        <span className="font-semibold text-gray-700">{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)}</span>{' '}
                        dari <span className="font-semibold text-gray-700">{filtered.length}</span> peminjaman
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => changePage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="h-8 px-3 rounded-lg border-2 border-gray-200 text-[12px] font-semibold text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-95"
                        >
                            ← Prev
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => changePage(p)}
                                    className={cn(
                                        'h-8 w-8 rounded-lg text-[12px] font-semibold transition-all duration-150 active:scale-95',
                                        p === page
                                            ? 'bg-gray-900 text-white border-2 border-gray-900'
                                            : 'border-2 border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-800'
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => changePage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="h-8 px-3 rounded-lg border-2 border-gray-200 text-[12px] font-semibold text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 active:scale-95"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

function EmptyState({ search, icon: Icon, label }: { search: string; icon: any; label: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                <Icon className="h-7 w-7 text-gray-200" />
            </div>
            <div className="text-center">
                <p className="text-[14px] font-semibold text-gray-700">{search ? 'Tidak ditemukan' : `Belum ada ${label}`}</p>
                <p className="text-[12px] text-gray-400 mt-1">{search ? `Tidak ada hasil untuk "${search}"` : `Belum ada ${label} saat ini.`}</p>
            </div>
        </div>
    );
}
