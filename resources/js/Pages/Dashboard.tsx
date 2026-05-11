import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Download, CalendarRange, FileSpreadsheet, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import OverviewTab from "./Dashboard/OverviewTab";
import AnalyticsTab from "./Dashboard/AnalyticsTab";
import LaporanTab from "./Dashboard/LaporanTab";

// ── Types ────────────────────────────────────────────────────────
interface Stats {
    totalRooms: number;
    totalBookings: number;
    pendingBookings: number;
    approvedBookings: number;
    monthDelta: number;
    thisMonth: number;
}

interface RoomUsage { name: string; count: number; }

interface RecentBooking {
    id: number;
    room: { name: string };
    user: { name: string };
    start_time: string;
    status: string;
}

interface MonthlyTrend {
    bulan: string;
    bulanShort: string;
    peminjaman: number;
    disetujui: number;
    ditolak: number;
}

interface PieEntry { name: string; value: number; color: string; }

interface Analytics {
    monthlyTrend: MonthlyTrend[];
    pieData: PieEntry[];
    avgPerMonth: number;
    approvalRate: number;
    rejectRate: number;
    peakMonth: string;
    peakCount: number;
}

interface LaporanItem {
    id: string;
    judul: string;
    periode: string;
    total: number;
    status: string;
    file: string;
    year?: number;
    month?: number;
}

interface Props {
    stats: Stats;
    roomUsage: RoomUsage[];
    recentBookings: RecentBooking[];
    analytics: Analytics;
    laporan: LaporanItem[];
}

const MONTHS = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember",
];

// ── Export Modal Component ────────────────────────────────────────
function ExportModal({ onClose }: { onClose: () => void }) {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year,  setYear]  = useState(now.getFullYear());
    const [mode,  setMode]  = useState<"all" | "period">("period");
    const [loading, setLoading] = useState(false);

    const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

    const doExport = (type: "excel" | "period") => {
        setLoading(true);
        let url = "";
        if (type === "excel" && mode === "all") {
            url = route("export.bookings.excel");
        } else {
            const label = `Laporan-${MONTHS[month - 1]}-${year}`;
            url = route("export.bookings.period") + `?year=${year}&month=${month}&label=${encodeURIComponent(label)}`;
        }
        window.location.href = url;
        setTimeout(() => { setLoading(false); onClose(); }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl border-2 border-gray-200 shadow-2xl w-full max-w-md p-6 animate-row">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-[15px] font-bold text-gray-900">Export Laporan</h3>
                        <p className="text-[12px] text-gray-400 mt-0.5">Unduh data peminjaman sebagai CSV</p>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-5">
                    {(["period", "all"] as const).map(m => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={cn(
                                "py-2.5 px-3 rounded-xl border-2 text-[12px] font-semibold transition-all",
                                mode === m
                                    ? "border-gray-900 bg-gray-900 text-white"
                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                            )}
                        >
                            {m === "period" ? "Per Periode" : "Semua Data"}
                        </button>
                    ))}
                </div>

                {mode === "period" && (
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-gray-600">Bulan</label>
                            <div className="relative">
                                <select
                                    value={month}
                                    onChange={e => setMonth(Number(e.target.value))}
                                    className="w-full h-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 text-[13px] font-medium px-3 pr-8 outline-none appearance-none cursor-pointer"
                                >
                                    {MONTHS.map((m, i) => (
                                        <option key={i} value={i + 1}>{m}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-gray-600">Tahun</label>
                            <div className="relative">
                                <select
                                    value={year}
                                    onChange={e => setYear(Number(e.target.value))}
                                    className="w-full h-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 text-[13px] font-medium px-3 pr-8 outline-none appearance-none cursor-pointer"
                                >
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3 mb-5">
                    <p className="text-[12px] text-gray-500">
                        {mode === "period"
                            ? `Mengekspor data peminjaman bulan ${MONTHS[month - 1]} ${year}`
                            : "Mengekspor seluruh data peminjaman"}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => doExport(mode === "all" ? "excel" : "period")}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-60"
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        {loading ? "Mengunduh..." : "Download CSV"}
                    </button>
                    <button
                        onClick={onClose}
                        className="h-10 px-4 rounded-xl border-2 border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function Dashboard({ stats, roomUsage, recentBookings, analytics, laporan }: Props) {
    const [showExport, setShowExport] = useState(false);

    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    const endMonth = now.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {/* ── Export Modal ── */}
            {showExport && <ExportModal onClose={() => setShowExport(false)} />}

            {/* ── Page Header ── */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                        <p className="text-[13px] text-gray-400 mt-1">Pantau penggunaan ruangan dan laporan terbaru dalam satu halaman.</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-2 h-9 px-3 rounded-lg border-2 border-gray-200 bg-white text-[12px] text-gray-600 font-medium shadow-sm">
                            <CalendarRange className="h-3.5 w-3.5 text-gray-400" />
                            <span className="hidden sm:inline">{startMonth} – {endMonth}</span>
                            <span className="sm:hidden">{now.toLocaleDateString("id-ID", { month: "short", year: "numeric" })}</span>
                        </div>
                        <button
                            onClick={() => setShowExport(true)}
                            className="flex items-center gap-2 h-9 px-3 sm:px-4 rounded-lg bg-gray-900 text-white text-[12px] font-semibold hover:bg-gray-800 transition-colors active:scale-95 shadow-sm"
                        >
                            <Download className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Download</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── All Sections Joined ── */}
            <div className="space-y-10 pb-10">
                {/* 1. Overview Section (Stats & Primary Charts) */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-1 w-1 rounded-full bg-gray-900" />
                        <h2 className="text-[14px] font-bold text-gray-900 uppercase tracking-wider">Ringkasan Statistik</h2>
                    </div>
                    <OverviewTab stats={stats} roomUsage={roomUsage} recentBookings={recentBookings} />
                </section>

                <div className="border-t border-gray-100" />

                {/* 2. Analytics Section (Trends & Distribution) */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-1 w-1 rounded-full bg-gray-900" />
                        <h2 className="text-[14px] font-bold text-gray-900 uppercase tracking-wider">Analisis Data</h2>
                    </div>
                    <AnalyticsTab analytics={analytics} />
                </section>

                <div className="border-t border-gray-100" />

                {/* 3. Laporan Section (Report History) */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-1 w-1 rounded-full bg-gray-900" />
                        <h2 className="text-[14px] font-bold text-gray-900 uppercase tracking-wider">Arsip Laporan</h2>
                    </div>
                    <LaporanTab laporan={laporan} onExport={() => setShowExport(true)} />
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
