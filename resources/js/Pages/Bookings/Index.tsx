import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import {
    Calendar, Clock, CheckCircle2, XCircle, FileText,
    Download, MoreHorizontal, User as UserIcon, Building2,
    CalendarCheck, Search, Filter, ArrowRight, ChevronLeft,
    ChevronRight, Upload, FileCheck,
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
    document_path: string | null;
    verification_path: string | null;
}

interface Props {
    bookings: Booking[];
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

    const [downloadedIds, setDownloadedIds] = useState<number[]>([]);

    const markAsDownloaded = (id: number) => {
        if (!downloadedIds.includes(id)) {
            setDownloadedIds(prev => [...prev, id]);
        }
    };

    const handleUpload = (id: number, file: File) => {
        if (!downloadedIds.includes(id)) {
            alert('Harap download template terlebih dahulu sebelum mengunggah konfirmasi.');
            return;
        }
        setProcessing(true);
        const formData = new FormData();
        formData.append('verification_document', file);
        
        router.post(
            route('bookings.upload-verification', { booking: id }),
            formData as any,
            { onFinish: () => setProcessing(false) }
        );
    };

    const updateStatus = (id: number, status: string) => {
        setProcessing(true);
        router.patch(
            route('bookings.status', { booking: id }),
            { status },
            { onFinish: () => setProcessing(false) }
        );
    };

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
        { label: 'Total Pengajuan', value: total,    icon: CalendarCheck, color: 'bg-slate-50 text-slate-400 border-slate-100' },
        { label: 'Menunggu Konfirmasi', value: pending,  icon: Clock,         color: 'bg-amber-50 text-amber-500 border-amber-100' },
        { label: 'Telah Disetujui', value: approved, icon: CheckCircle2,  color: 'bg-emerald-50 text-emerald-500 border-emerald-100' },
        { label: 'Permintaan Ditolak', value: rejected, icon: XCircle,       color: 'bg-rose-50 text-rose-500 border-rose-100' },
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
            <div className="flex flex-col gap-8 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            Peminjaman Ruangan
                            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                        </h1>
                        <p className="text-[13px] text-slate-400 mt-1 font-medium">Kelola dan pantau semua pengajuan peminjaman ruangan.</p>
                    </div>
                    {isAdmin && (
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={() => window.open(route('export.bookings.excel'))}
                                className="flex items-center gap-2 h-11 px-5 rounded-2xl border-[1.5px] border-slate-200 bg-white text-[13px] text-slate-600 font-bold hover:bg-slate-50 hover:border-indigo-200 transition-all active:scale-95 shadow-sm"
                            >
                                <FileText className="h-4 w-4 text-emerald-600" />
                                <span>Excel</span>
                            </button>
                            <button
                                onClick={() => window.open(route('export.bookings.pdf'))}
                                className="flex items-center gap-2 h-11 px-5 rounded-2xl border-[1.5px] border-slate-200 bg-white text-[13px] text-slate-600 font-bold hover:bg-slate-50 hover:border-indigo-200 transition-all active:scale-95 shadow-sm"
                            >
                                <Download className="h-4 w-4 text-rose-500" />
                                <span>PDF</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((s, i) => (
                        <div key={i} className="group bg-white rounded-[2rem] border-[1.5px] border-slate-200 shadow-sm p-5 flex items-center gap-4 animate-row hover:border-indigo-200 hover:shadow-md transition-all duration-300" style={{ animationDelay: `${i * 60}ms` }}>
                            <div className={cn('h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform duration-500', s.color)}>
                                <s.icon className="h-6 w-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-black text-slate-900 leading-none">{s.value}</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 truncate">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                    {TABS.map(tab => {
                        const count = tab.id === 'semua' ? total : tab.id === 'pending' ? pending : tab.id === 'approved' ? approved : rejected;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={cn(
                                    'flex items-center gap-2.5 px-6 py-4 text-[13px] font-black transition-all duration-300 border-b-2 -mb-px whitespace-nowrap shrink-0 relative',
                                    isActive 
                                        ? 'border-indigo-500 text-slate-900' 
                                        : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
                                )}
                            >
                                {tab.label}
                                <span className={cn(
                                    'inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-lg text-[10px] font-black transition-colors duration-300', 
                                    isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                                )}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Search & Filter ── */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => handleSearch(e.target.value)}
                        placeholder="Cari nama ruangan, peminjam, atau keperluan..."
                        className="h-12 w-full pl-11 pr-4 bg-white border-[1.5px] border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 shadow-sm transition-all"
                    />
                </div>
            </div>

            {/* ── Desktop Table ── */}
            <div
                className={cn(
                    'hidden sm:block bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm overflow-hidden transition-all duration-500',
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
            >
                <div className="grid grid-cols-12 px-8 py-5 bg-slate-50/50 border-b border-slate-200">
                    <p className="col-span-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Detail Peminjaman</p>
                    <p className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Waktu & Jadwal</p>
                    <p className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Keperluan</p>
                    <p className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Status & Aksi</p>
                </div>
                {paginated.map((booking, i) => {
                    const st = STATUS_CONFIG[booking.status];
                    const Icon = st.icon;
                    return (
                        <div
                            key={booking.id}
                            className={cn('grid grid-cols-12 px-8 py-6 items-center hover:bg-slate-50/50 transition-all group animate-row', i < paginated.length - 1 && 'border-b border-slate-100')}
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            <div className="col-span-4 flex items-center gap-4">
                                <div className="h-11 w-11 rounded-[1rem] bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-md group-hover:border-indigo-100 transition-all duration-300">
                                    <Building2 className="h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[14px] font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{booking.room.name}</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <UserIcon className="h-3.5 w-3.5 text-slate-300" />
                                        <p className="text-[12px] font-bold text-slate-400 truncate tracking-tight">{booking.user.name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3">
                                <div className="flex items-center gap-2 text-[13px] font-black text-slate-800">
                                    <Calendar className="h-4 w-4 text-indigo-500" />
                                    {new Date(booking.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mt-1.5 ml-6">
                                    <Clock className="h-3.5 w-3.5" />
                                    {new Date(booking.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    <span className="opacity-50 mx-1">/</span>
                                    {new Date(booking.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <div className="col-span-3">
                                <p className="text-[13px] font-bold text-slate-600 line-clamp-2 pr-6 leading-relaxed">{booking.purpose}</p>
                            </div>
                            <div className="col-span-2 flex flex-col items-end gap-3">
                                <span className={cn('inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-wider', st.color)}>
                                    <Icon className="h-3.5 w-3.5" />
                                    {st.label}
                                </span>
                                {isAdmin && booking.status === 'pending' && (
                                    <div className="flex gap-2 animate-in zoom-in-95">
                                        <button 
                                            onClick={() => updateStatus(booking.id, 'approved')} 
                                            disabled={processing} 
                                            className="h-8 px-3 rounded-xl bg-emerald-500 text-white text-[11px] font-black hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-100 transition-all disabled:opacity-50 active:scale-95"
                                        >
                                            Setujui
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(booking.id, 'rejected')} 
                                            disabled={processing} 
                                            className="h-8 px-3 rounded-xl bg-white border border-rose-200 text-rose-500 text-[11px] font-black hover:bg-rose-50 transition-all disabled:opacity-50 active:scale-95"
                                        >
                                            Tolak
                                        </button>
                                    </div>
                                )}
                                {!isAdmin && booking.status === 'approved' && (
                                    <div className="flex flex-col items-end gap-2">
                                        {booking.verification_path ? (
                                            <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 uppercase tracking-wider">
                                                <FileCheck className="h-3.5 w-3.5" />
                                                Berkas Terkirim
                                            </span>
                                        ) : (
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <a 
                                                        href="/templates/MCH Usage Application.docx"
                                                        download
                                                        onClick={() => markAsDownloaded(booking.id)}
                                                        className="flex items-center gap-2 h-8 px-4 rounded-xl bg-amber-500 text-white text-[10px] font-black hover:bg-amber-600 shadow-lg shadow-amber-100 transition-all active:scale-95"
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                        Template Aplikasi
                                                    </a>
                                                    <a 
                                                        href="/templates/Peminjaman Tempat (1).docx"
                                                        download
                                                        onClick={() => markAsDownloaded(booking.id)}
                                                        className="flex items-center gap-2 h-8 px-4 rounded-xl bg-slate-700 text-white text-[10px] font-black hover:bg-slate-800 shadow-lg shadow-slate-100 transition-all active:scale-95"
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                        Template Peminjaman
                                                    </a>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        id={`upload-${booking.id}`}
                                                        className="hidden"
                                                        onChange={(e) => e.target.files?.[0] && handleUpload(booking.id, e.target.files[0])}
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        disabled={!downloadedIds.includes(booking.id)}
                                                    />
                                                    <button 
                                                        onClick={() => document.getElementById(`upload-${booking.id}`)?.click()}
                                                        disabled={processing || !downloadedIds.includes(booking.id)}
                                                        className={cn(
                                                            "flex items-center gap-2 h-9 px-4 rounded-xl text-white text-[11px] font-black transition-all active:scale-95 shadow-lg",
                                                            downloadedIds.includes(booking.id) 
                                                                ? "bg-teal-600 hover:bg-teal-700 shadow-teal-100" 
                                                                : "bg-slate-300 cursor-not-allowed shadow-none"
                                                        )}
                                                    >
                                                        <Upload className="h-3.5 w-3.5" />
                                                        Upload Konfirmasi
                                                    </button>
                                                    {!downloadedIds.includes(booking.id) && (
                                                        <p className="text-[9px] font-bold text-rose-400 mt-1 animate-pulse">Download template dulu</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                {paginated.length === 0 && <EmptyState search={search} icon={CalendarCheck} label="peminjaman" />}
            </div>

            {/* ── Mobile Card List ── */}
            <div
                className={cn(
                    'sm:hidden space-y-4 transition-all duration-500',
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
            >
                {paginated.map((booking, i) => {
                    const st = STATUS_CONFIG[booking.status];
                    const Icon = st.icon;
                    return (
                        <div key={booking.id} className="bg-white rounded-[2rem] border-[1.5px] border-slate-200 shadow-sm p-6 animate-row" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                        <Building2 className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[14px] font-black text-slate-900 truncate">{booking.room.name}</p>
                                        <p className="text-[12px] font-bold text-slate-400 truncate">{booking.user.name}</p>
                                    </div>
                                </div>
                                <span className={cn('inline-flex items-center gap-1 text-[9px] font-black px-2.5 py-1.5 rounded-full border uppercase tracking-wider shrink-0', st.color)}>
                                    <Icon className="h-3 w-3" />
                                    {st.label}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Tanggal</p>
                                    <div className="flex items-center gap-2 text-[13px] font-black text-slate-700">
                                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                                        {new Date(booking.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1.5">Waktu</p>
                                    <div className="flex items-center gap-2 text-[13px] font-black text-slate-700">
                                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                                        {new Date(booking.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                            <p className="text-[13px] font-bold text-slate-500 mb-6 leading-relaxed">{booking.purpose}</p>
                            {isAdmin && booking.status === 'pending' && (
                                <div className="flex gap-3">
                                    <button onClick={() => updateStatus(booking.id, 'approved')} disabled={processing} className="flex-1 h-12 rounded-[1.25rem] bg-emerald-500 text-white text-[13px] font-black hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-100">Setujui</button>
                                    <button onClick={() => updateStatus(booking.id, 'rejected')} disabled={processing} className="flex-1 h-12 rounded-[1.25rem] bg-slate-50 text-slate-600 border border-slate-200 text-[13px] font-black hover:bg-white transition-all active:scale-95">Tolak</button>
                                </div>
                            )}
                        </div>
                    );
                })}
                {paginated.length === 0 && <EmptyState search={search} icon={CalendarCheck} label="peminjaman" />}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-8 bg-white border-[1.5px] border-slate-200 shadow-sm rounded-[2rem] px-8 py-5 gap-4">
                    <p className="text-[13px] font-bold text-slate-400">
                        Menampilkan <span className="text-slate-900 font-black">{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)}</span>{' '}
                        dari <span className="text-slate-900 font-black">{filtered.length}</span> pengajuan
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => changePage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="h-10 w-10 flex items-center justify-center rounded-xl border-[1.5px] border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 transition-all active:scale-90"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button
                                    key={p}
                                    onClick={() => changePage(p)}
                                    className={cn(
                                        'h-10 w-10 rounded-xl text-[13px] font-black transition-all active:scale-90',
                                        p === page
                                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                                            : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => changePage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="h-10 w-10 flex items-center justify-center rounded-xl border-[1.5px] border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 transition-all active:scale-90"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

function EmptyState({ search, icon: Icon, label }: { search: string; icon: any; label: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 animate-in fade-in duration-700">
            <div className="h-20 w-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                <Icon className="h-10 w-10 text-slate-200" />
            </div>
            <div className="text-center max-w-xs">
                <p className="text-[16px] font-black text-slate-900 tracking-tight">{search ? 'Pencarian Nihil' : `Belum Ada ${label}`}</p>
                <p className="text-[13px] font-bold text-slate-400 mt-2 leading-relaxed">{search ? `Maaf, kami tidak menemukan data yang cocok dengan kata kunci "${search}"` : `Sepertinya belum ada daftar ${label} yang masuk untuk saat ini.`}</p>
            </div>
        </div>
    );
}
