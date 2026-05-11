import { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NotifType = "info" | "success" | "warning";

interface NotifItem {
    id: number;
    type: NotifType;
    judul: string;
    pesan: string;
    waktu: string;
    dibaca: boolean;
}

interface Props { initialNotifs: NotifItem[]; }

const TYPE_CONFIG: Record<NotifType, { icon: React.ElementType; bg: string; iconColor: string; dot: string }> = {
    success: { icon: CheckCircle2,  bg: "bg-green-50",  iconColor: "text-green-600",  dot: "bg-green-500"  },
    warning: { icon: AlertTriangle, bg: "bg-yellow-50", iconColor: "text-yellow-600", dot: "bg-yellow-500" },
    info:    { icon: Info,          bg: "bg-blue-50",   iconColor: "text-blue-600",   dot: "bg-blue-500"   },
};

export default function NotifikasiTab({ initialNotifs }: Props) {
    const [notifs, setNotifs] = useState<NotifItem[]>(initialNotifs);
    const [filter, setFilter] = useState<"semua" | "belum" | "dibaca">("semua");

    const unread      = notifs.filter(n => !n.dibaca).length;
    const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, dibaca: true })));
    const dismiss     = (id: number) => setNotifs(prev => prev.filter(n => n.id !== id));
    const markRead    = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, dibaca: true } : n));

    const filtered = notifs.filter(n => {
        if (filter === "belum")  return !n.dibaca;
        if (filter === "dibaca") return n.dibaca;
        return true;
    });

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-[15px] font-semibold text-gray-800 flex items-center gap-2">
                        Notifikasi
                        {unread > 0 && (
                            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-gray-900 text-white text-[10px] font-bold">
                                {unread}
                            </span>
                        )}
                    </h2>
                    <p className="text-[12px] text-gray-400 mt-0.5">{unread} notifikasi belum dibaca</p>
                </div>
                {unread > 0 && (
                    <button
                        onClick={markAllRead}
                        className="text-[12px] text-gray-500 hover:text-gray-800 font-medium transition-colors"
                    >
                        Tandai semua dibaca
                    </button>
                )}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                {(["semua", "belum", "dibaca"] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-medium transition-all border-b-2 -mb-px whitespace-nowrap shrink-0",
                            filter === f ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
                        )}
                    >
                        {f === "semua" ? "Semua" : f === "belum" ? "Belum Dibaca" : "Sudah Dibaca"}
                    </button>
                ))}
            </div>

            {/* Notif List */}
            <div className="space-y-2">
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <Bell className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-[13px] text-gray-400">Tidak ada notifikasi.</p>
                    </div>
                )}

                {filtered.map((n, idx) => {
                    const cfg  = TYPE_CONFIG[n.type];
                    const Icon = cfg.icon;
                    return (
                        <div
                            key={n.id}
                            className={cn(
                                "flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer animate-row",
                                n.dibaca
                                    ? "bg-white border-gray-100 shadow-sm hover:bg-gray-50"
                                    : "bg-white border-gray-200 shadow-sm"
                            )}
                            style={{ animationDelay: `${idx * 40}ms` }}
                            onClick={() => markRead(n.id)}
                        >
                            {/* Icon */}
                            <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5", cfg.bg)}>
                                <Icon className={cn("h-4 w-4", cfg.iconColor)} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        {!n.dibaca && <div className={cn("h-2 w-2 rounded-full shrink-0 mt-1 pulse-dot", cfg.dot)} />}
                                        <p className={cn("text-[12px] sm:text-[13px] font-semibold truncate", n.dibaca ? "text-gray-700" : "text-gray-900")}>
                                            {n.judul}
                                        </p>
                                    </div>
                                    <span className="text-[10px] sm:text-[11px] text-gray-400 shrink-0 hidden sm:inline">{n.waktu}</span>
                                </div>
                                <p className="text-[11px] sm:text-[12px] text-gray-500 mt-1 leading-relaxed">{n.pesan}</p>
                                <span className="text-[10px] text-gray-400 mt-1 block sm:hidden">{n.waktu}</span>
                            </div>

                            {/* Dismiss */}
                            <button
                                onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                                className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0 active:scale-95"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
