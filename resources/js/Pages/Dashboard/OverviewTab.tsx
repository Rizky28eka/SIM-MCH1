import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Building2, Calendar, CheckCircle2, Clock, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
    stats: {
        totalRooms: number;
        totalBookings: number;
        pendingBookings: number;
        approvedBookings: number;
        monthDelta: number;
        thisMonth: number;
    };
    roomUsage: { name: string; count: number }[];
    recentBookings: { id: number; room: { name: string }; user: { name: string }; start_time: string; status: string }[];
}

const CHART_COLORS = ["#0F172A", "#1E293B", "#334155", "#475569", "#64748B"];

const STATUS_BADGE: Record<string, string> = {
    approved: "bg-green-50 text-green-700",
    pending:  "bg-yellow-50 text-yellow-700",
    rejected: "bg-red-50 text-red-700",
};
const STATUS_LABEL: Record<string, string> = {
    approved: "Disetujui",
    pending:  "Menunggu",
    rejected: "Ditolak",
};

export default function OverviewTab({ stats, roomUsage, recentBookings }: Props) {
    const statCards = [
        { title: "Total Ruangan",      value: stats.totalRooms,      sub: "Ruangan aktif",                                                      isUp: true,  icon: Building2    },
        { title: "Total Peminjaman",   value: stats.totalBookings,   sub: `${stats.monthDelta >= 0 ? '+' : ''}${stats.monthDelta}% dari bln lalu`, isUp: stats.monthDelta >= 0, icon: Calendar     },
        { title: "Menunggu Approval",  value: stats.pendingBookings, sub: "Perlu diproses",                                                     isUp: false, icon: Clock        },
        { title: "Disetujui / Aktif",  value: stats.approvedBookings,sub: `${stats.thisMonth} bln ini`,                                         isUp: true,  icon: CheckCircle2 },
    ];

    return (
        <div className="space-y-5">
            {/* ── Stat Cards: 2 cols mobile → 4 cols lg ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {statCards.map((s, i) => (
                    <div
                        key={i}
                        className="card-lift bg-white rounded-xl border-2 border-gray-200 shadow-sm p-4 flex flex-col gap-2 sm:gap-3 animate-row"
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] sm:text-[12px] font-medium text-gray-500 leading-tight">{s.title}</p>
                            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                <s.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                            </div>
                        </div>
                        <div>
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</div>
                            <p className={cn("text-[10px] sm:text-[11px] font-medium mt-0.5", s.isUp ? "text-green-600" : "text-red-500")}>
                                {s.isUp ? "↑" : "↓"} {s.sub}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Chart + Activity: stack on mobile ── */}
            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
                {/* Bar Chart */}
                <Card className="lg:col-span-2 border-2 border-gray-200 shadow-sm rounded-xl">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 gap-2">
                        <div>
                            <CardTitle className="text-[14px] sm:text-[15px] font-semibold">Statistik Penggunaan</CardTitle>
                            <p className="text-[11px] sm:text-[12px] text-gray-400 mt-0.5">Distribusi peminjaman per ruangan</p>
                        </div>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-[11px] w-fit">Bulan Ini</Badge>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6">
                        <div className="h-[220px] sm:h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={roomUsage} barGap={8}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }} />
                                    <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }} width={28} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 4px 24px rgb(0 0 0 / 0.08)", padding: "10px 14px" }}
                                        itemStyle={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}
                                        cursor={{ fill: "#f8fafc", radius: 8 }}
                                    />
                                    <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={32}>
                                        {roomUsage.map((_, index) => (
                                            <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} fillOpacity={0.85} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-2 border-gray-200 shadow-sm rounded-xl">
                    <CardHeader className="pb-3 sm:pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-[14px] sm:text-[15px] font-semibold">Aktivitas Terkini</CardTitle>
                            <CalendarDays className="h-4 w-4 text-gray-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="px-3">
                        <div className="space-y-1">
                            {recentBookings.map((b, idx) => (
                                <div
                                    key={b.id}
                                    className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-gray-50 transition-colors animate-row"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                        <Building2 className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] sm:text-[13px] font-semibold text-gray-800 truncate">{b.room.name}</p>
                                        <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">{b.user.name}</p>
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0",
                                        STATUS_BADGE[b.status] ?? "bg-gray-50 text-gray-500"
                                    )}>
                                        {STATUS_LABEL[b.status] ?? b.status}
                                    </span>
                                </div>
                            ))}
                            {recentBookings.length === 0 && (
                                <p className="text-center text-[13px] text-gray-400 py-10">Belum ada aktivitas.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
