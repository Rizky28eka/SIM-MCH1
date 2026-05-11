import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { TrendingUp, TrendingDown, Activity, BarChart2 } from "lucide-react";

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

interface Props { analytics: Analytics; }

const tooltipStyle = {
    borderRadius: "10px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 4px 20px rgb(0 0 0/0.08)",
    fontSize: "12px",
};

export default function AnalyticsTab({ analytics }: Props) {
    const { monthlyTrend, pieData, avgPerMonth, approvalRate, rejectRate, peakMonth, peakCount } = analytics;

    const kpiCards = [
        {
            label: "Rata-rata / Bulan",
            value: `${avgPerMonth}`,
            unit: "peminjaman",
            icon: Activity,
            up: true,
            delta: `${avgPerMonth} rata-rata`,
        },
        {
            label: "Tingkat Approval",
            value: `${approvalRate}%`,
            unit: "dari total",
            icon: TrendingUp,
            up: approvalRate >= 70,
            delta: `${approvalRate}% disetujui`,
        },
        {
            label: "Tingkat Penolakan",
            value: `${rejectRate}%`,
            unit: "dari total",
            icon: TrendingDown,
            up: rejectRate < 20,
            delta: rejectRate < 20 ? "Rendah ✓" : "Perlu perhatian",
        },
        {
            label: "Peak Month",
            value: peakMonth,
            unit: "tertinggi",
            icon: BarChart2,
            up: true,
            delta: `${peakCount} peminjaman`,
        },
    ];

    // Use bulanShort for chart label (shorter)
    const chartData = monthlyTrend.map(m => ({ ...m, bulan: m.bulanShort }));

    return (
        <div className="space-y-4 sm:space-y-5">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {kpiCards.map((k, i) => (
                    <div key={i} className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-3 sm:p-4 animate-row" style={{ animationDelay: `${i * 60}ms` }}>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 leading-tight">{k.label}</p>
                            <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                <k.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400" />
                            </div>
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-gray-900">
                            {k.value}
                            <span className="text-[10px] font-normal text-gray-400 ml-1">{k.unit}</span>
                        </div>
                        <p className={`text-[10px] sm:text-[11px] mt-1 font-medium ${k.up ? "text-green-600" : "text-red-500"}`}>
                            {k.delta}
                        </p>
                    </div>
                ))}
            </div>

            {/* Line + Pie */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2 border-2 border-gray-200 shadow-sm rounded-xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-[14px] sm:text-[15px] font-semibold">Tren Peminjaman {new Date().getFullYear()}</CardTitle>
                        <p className="text-[11px] text-gray-400">Perbandingan per bulan</p>
                    </CardHeader>
                    <CardContent className="px-2 sm:px-6">
                        <div className="h-[190px] sm:h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="bulan" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }} />
                                    <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }} width={22} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px" }} />
                                    <Line type="monotone" dataKey="peminjaman" stroke="#0F172A" strokeWidth={2} dot={false} name="Total" />
                                    <Line type="monotone" dataKey="disetujui"  stroke="#22c55e" strokeWidth={2} dot={false} name="Disetujui" />
                                    <Line type="monotone" dataKey="ditolak"    stroke="#ef4444" strokeWidth={2} dot={false} name="Ditolak" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 shadow-sm rounded-xl">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-[14px] sm:text-[15px] font-semibold">Distribusi Status</CardTitle>
                        <p className="text-[11px] text-gray-400">Komposisi semua peminjaman</p>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[150px] sm:h-[170px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} dataKey="value" paddingAngle={3}>
                                        {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-2 mt-2">
                            {pieData.map((d, i) => (
                                <div key={i} className="flex items-center justify-between text-[12px]">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                                        <span className="text-gray-600">{d.name}</span>
                                    </div>
                                    <span className="font-semibold text-gray-800">{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bar monthly */}
            <Card className="border-2 border-gray-200 shadow-sm rounded-xl">
                <CardHeader className="pb-3">
                    <CardTitle className="text-[14px] sm:text-[15px] font-semibold">Penggunaan Bulanan</CardTitle>
                    <p className="text-[11px] text-gray-400">Total peminjaman tiap bulan tahun {new Date().getFullYear()}</p>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                    <div className="h-[150px] sm:h-[190px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} barSize={18}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="bulan" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }} />
                                <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }} width={22} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Bar dataKey="peminjaman" radius={[5, 5, 0, 0]} fill="#0F172A" fillOpacity={0.85} name="Peminjaman" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
