import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    CalendarRange,
    Building2,
    Calendar as CalendarIcon,
    CheckCircle2,
    Clock,
    CalendarDays,
    XCircle,
    ChevronDown,
    ArrowRight,
} from "lucide-react";
import {
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { DateRange } from "react-day-picker";

// ── Types & Interfaces ──────────────────────────────────────────
interface Stats {
    totalRooms: number;
    totalBookings: number;
    pendingBookings: number;
    approvedBookings: number;
    monthDelta: number;
    thisMonth: number;
}

interface RoomUsage {
    name: string;
    count: number;
}

interface RecentBooking {
    id: number;
    room: { name: string };
    user: { name: string };
    start_time: string;
    status: string;
}

interface Props {
    stats: Stats;
    roomUsage: RoomUsage[];
    recentBookings: RecentBooking[];
    isAdmin: boolean;
    filters: {
        from: string;
        to: string;
    };
}

// ── Constants ───────────────────────────────────────────────────
const CHART_COLORS = ["#26A69A", "#E9AF2F", "#A02525", "#333333", "#4DB6AC"];
const DONUT_COLORS = {
    approved: "#26A69A", // Teal
    pending:  "#E9AF2F", // Gold
    rejected: "#A02525", // Maroon
};

const STATUS_BADGE: Record<string, string> = {
    approved: "bg-green-50 text-green-700",
    pending: "bg-yellow-50 text-yellow-700",
    rejected: "bg-red-50 text-red-700",
};

const STATUS_LABEL: Record<string, string> = {
    approved: "Disetujui",
    pending: "Menunggu",
    rejected: "Ditolak",
};

const tooltipStyle = {
    borderRadius: "12px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 4px 24px rgb(0 0 0 / 0.08)",
    fontSize: "12px",
};

// ── Main Dashboard Function ─────────────────────────────────────
export default function Dashboard({
    stats,
    roomUsage,
    recentBookings,
    isAdmin,
    filters,
}: Props) {
    const [date, setDate] = useState<DateRange | undefined>({
        from: parseISO(filters.from),
        to: parseISO(filters.to),
    });

    // Update URL when date changes
    const handleSelect = (range: DateRange | undefined) => {
        setDate(range);
        if (range?.from && range?.to) {
            router.get(
                route("dashboard"),
                {
                    from: format(range.from, "yyyy-MM-dd"),
                    to: format(range.to, "yyyy-MM-dd"),
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ["stats", "roomUsage", "recentBookings", "filters"],
                },
            );
        }
    };

    const statCards = isAdmin ? [
        {
            title: "Total Ruangan",
            value: stats.totalRooms,
            label: "Ruangan Terdaftar",
            trend: "+2",
            isUp: true,
            icon: Building2,
            color: "text-teal-600 bg-teal-50"
        },
        {
            title: "Total Peminjaman",
            value: stats.totalBookings,
            label: "Periode terpilih",
            trend: `${stats.monthDelta >= 0 ? "+" : ""}${stats.monthDelta}%`,
            isUp: stats.monthDelta >= 0,
            icon: CalendarIcon,
            color: "text-slate-600 bg-slate-50"
        },
        {
            title: "Menunggu Approval",
            value: stats.pendingBookings,
            label: "Perlu diverifikasi",
            trend: "Action",
            isUp: false,
            icon: Clock,
            color: "text-amber-600 bg-amber-50"
        },
        {
            title: "Disetujui / Aktif",
            value: stats.approvedBookings,
            label: "Jadwal berjalan",
            trend: "Live",
            isUp: true,
            icon: CheckCircle2,
            color: "text-emerald-600 bg-emerald-50"
        },
    ] : [
        {
            title: "Peminjaman Saya",
            value: stats.totalBookings,
            label: "Total pengajuan",
            trend: "Total",
            isUp: true,
            icon: CalendarIcon,
            color: "text-teal-600 bg-teal-50"
        },
        {
            title: "Menunggu Approval",
            value: stats.pendingBookings,
            label: "Dalam proses",
            trend: "Wait",
            isUp: false,
            icon: Clock,
            color: "text-amber-600 bg-amber-50"
        },
        {
            title: "Disetujui",
            value: stats.approvedBookings,
            label: "Siap digunakan",
            trend: "Ready",
            isUp: true,
            icon: CheckCircle2,
            color: "text-emerald-600 bg-emerald-50"
        },
        {
            title: "Ditolak",
            value: stats.totalBookings - stats.approvedBookings - stats.pendingBookings,
            label: "Tidak disetujui",
            trend: "Rejected",
            isUp: false,
            icon: XCircle,
            color: "text-rose-600 bg-rose-50"
        },
    ];

    const pieData = [
        { name: 'Disetujui', value: stats.approvedBookings, color: DONUT_COLORS.approved },
        { name: 'Pending', value: stats.pendingBookings, color: DONUT_COLORS.pending },
        { name: 'Ditolak', value: stats.totalBookings - stats.approvedBookings - stats.pendingBookings, color: DONUT_COLORS.rejected },
    ].filter(d => d.value > 0);

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div className="animate-row">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {isAdmin ? 'System Dashboard' : 'My Dashboard'}
                    </h1>
                    <p className="text-[13px] font-bold text-slate-400 mt-1 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                        {isAdmin 
                            ? 'Overview of Makassar Creative Hub resource allocation.' 
                            : 'Monitor your room reservation status and history.'}
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 animate-row">
                    <Popover>
                        <PopoverTrigger className="flex items-center gap-3 h-11 px-5 rounded-2xl border-[1.5px] border-slate-200 bg-white text-[13px] text-slate-700 font-black shadow-sm hover:border-teal-400 hover:shadow-md transition-all active:scale-95 group outline-none">
                            <CalendarRange className="h-4 w-4 text-slate-400 group-hover:text-teal-500" />
                            {date?.from ? (
                                date.to ? (
                                    <span className="truncate">
                                        {format(date.from, "d MMM", { locale: id })} – {format(date.to, "d MMM yyyy", { locale: id })}
                                    </span>
                                ) : (
                                    <span className="truncate">{format(date.from, "d MMM yyyy", { locale: id })}</span>
                                )
                            ) : (
                                <span>Pilih Tanggal</span>
                            )}
                            <ChevronDown className="h-4 w-4 text-slate-300" />
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-auto p-0 border-2 border-slate-200 rounded-[2rem] shadow-2xl bg-white z-[100]"
                            align="end"
                        >
                            <Calendar
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={handleSelect}
                                numberOfMonths={1}
                                locale={id}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="space-y-8 pb-10">
                {/* ── STAT CARDS ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((s, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-[2rem] border-[1.5px] border-slate-200 shadow-sm p-6 flex flex-col gap-6 animate-row hover:border-teal-200 hover:shadow-md transition-all duration-300"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            <div className="flex items-center justify-between">
                                <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border", s.color)}>
                                    <s.icon className="h-5 w-5" />
                                </div>
                                <div className={cn(
                                    "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                                    s.isUp ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                                )}>
                                    {s.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">
                                    {s.title}
                                </p>
                                <div className="text-3xl font-black text-slate-900 tracking-tight">
                                    {s.value.toLocaleString()}
                                </div>
                                <p className="text-[11px] font-bold text-slate-400 mt-1">
                                    {s.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── CHARTS & ACTIVITY ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Bar Chart Card */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm overflow-hidden animate-row" style={{ animationDelay: '250ms' }}>
                        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-[16px] font-black text-slate-900 tracking-tight">Traffic Penggunaan</h3>
                                <p className="text-[12px] font-bold text-slate-400 mt-1">Distribusi peminjaman per ruangan</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-teal-50 text-teal-600 text-[10px] font-black uppercase px-3 py-1">Monthly View</Badge>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="h-[320px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={roomUsage} barGap={12}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontWeight: 700 }} dy={10} />
                                        <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontWeight: 700 }} width={28} />
                                        <Tooltip 
                                            contentStyle={tooltipStyle} 
                                            cursor={{ fill: "#f8fafc", radius: 12 }}
                                            itemStyle={{ fontSize: "12px", fontWeight: "800", color: "#26A69A" }}
                                        />
                                        <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                                            {roomUsage.map((_, index) => (
                                                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} fillOpacity={0.9} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Donut Chart Card */}
                    <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm overflow-hidden animate-row" style={{ animationDelay: '300ms' }}>
                        <div className="p-8 border-b border-slate-50">
                            <h3 className="text-[16px] font-black text-slate-900 tracking-tight">Status Distribution</h3>
                            <p className="text-[12px] font-bold text-slate-400 mt-1">Proporsi status peminjaman</p>
                        </div>
                        <div className="p-8">
                            <div className="h-[240px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={tooltipStyle} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <p className="text-2xl font-black text-slate-900">{stats.totalBookings}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
                                </div>
                            </div>
                            <div className="mt-8 space-y-3">
                                {pieData.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                                            <span className="text-[12px] font-bold text-slate-600">{d.name}</span>
                                        </div>
                                        <span className="text-[12px] font-black text-slate-900">{Math.round((d.value / stats.totalBookings) * 100)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Card */}
                    <div className="lg:col-span-3 bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm overflow-hidden animate-row" style={{ animationDelay: '350ms' }}>
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-[16px] font-black text-slate-900 tracking-tight">Recent Activity</h3>
                                <p className="text-[12px] font-bold text-slate-400 mt-1">Log peminjaman terbaru</p>
                            </div>
                            <Link 
                                href={route('bookings.index')} 
                                className="text-[11px] font-black text-teal-600 uppercase tracking-widest hover:text-teal-700 transition-colors"
                            >
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">User & Room</th>
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                                        <th className="px-8 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentBookings.map((b, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-teal-600 group-hover:text-white transition-all duration-500">
                                                        {b.user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-black text-slate-900 leading-tight">{b.room.name}</p>
                                                        <p className="text-[11px] font-bold text-slate-400 mt-1">{b.user.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 text-[12px] font-black text-slate-700">
                                                    <CalendarIcon className="h-3.5 w-3.5 text-teal-500" />
                                                    {format(parseISO(b.start_time), 'dd MMM yyyy')}
                                                </div>
                                                <p className="text-[11px] font-bold text-slate-400 mt-1 ml-5">{format(parseISO(b.start_time), 'HH:mm')}</p>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 rounded-full border uppercase tracking-wider",
                                                    STATUS_BADGE[b.status] ?? "bg-slate-50 text-slate-500 border-slate-100"
                                                )}>
                                                    {STATUS_LABEL[b.status] ?? b.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-teal-600 hover:border-teal-200 transition-all">
                                                    <ArrowRight className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
