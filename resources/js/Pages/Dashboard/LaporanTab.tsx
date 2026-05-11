import { useState } from "react";
import { FileText, Download, Search, CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
    laporan: LaporanItem[]; 
    onExport?: () => void;
}

const STATUS_STYLE: Record<string, string> = {
    selesai: "bg-green-50 text-green-700",
    proses:  "bg-yellow-50 text-yellow-700",
    gagal:   "bg-red-50 text-red-700",
};

const STATUS_LABEL: Record<string, string> = {
    selesai: "Selesai",
    proses:  "Proses",
    gagal:   "Gagal",
};

const STATUS_ICON: Record<string, React.ElementType> = {
    selesai: CheckCircle2,
    proses:  Clock,
    gagal:   XCircle,
};

export default function LaporanTab({ laporan, onExport }: Props) {
    const [search, setSearch] = useState("");
    const filtered = laporan.filter(r =>
        r.judul.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Search & Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex-1 flex items-center gap-3 bg-white border-2 border-gray-200 shadow-sm rounded-xl px-4 py-2.5 w-full">
                    <Search className="h-4 w-4 text-gray-400 shrink-0" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Cari laporan..."
                        className="flex-1 text-[13px] text-gray-700 placeholder:text-gray-400 bg-transparent outline-none min-w-0"
                    />
                </div>
                <button 
                    onClick={onExport}
                    className="flex items-center gap-2 h-[46px] px-6 rounded-xl bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-800 transition-all active:scale-95 shadow-sm w-full sm:w-auto justify-center"
                >
                    <FileText className="h-4 w-4 shrink-0" />
                    Buat Laporan Baru
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block bg-white border-2 border-gray-200 shadow-sm rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 px-5 py-3 border-b border-gray-100 bg-gray-50/60">
                    <p className="col-span-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Judul Laporan</p>
                    <p className="col-span-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Periode</p>
                    <p className="col-span-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total</p>
                    <p className="col-span-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Status</p>
                </div>

                {filtered.map((r, i) => {
                    const Icon = STATUS_ICON[r.status] ?? CheckCircle2;
                    return (
                        <div
                            key={r.id}
                            className={cn(
                                "grid grid-cols-12 px-5 py-4 items-center hover:bg-gray-50/70 transition-colors group animate-row",
                                i < filtered.length - 1 && "border-b border-gray-100"
                            )}
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            <div className="col-span-5 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                    <FileText className="h-4 w-4 text-gray-400" />
                                </div>
                                <p className="text-[13px] font-medium text-gray-800 truncate">{r.judul}</p>
                            </div>
                            <p className="col-span-3 text-[12px] text-gray-500">{r.periode}</p>
                            <p className="col-span-2 text-[13px] font-semibold text-gray-700">
                                {r.total > 0 ? `${r.total} item` : "—"}
                            </p>
                            <div className="col-span-2 flex items-center justify-end gap-2">
                                <span className={cn("flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full", STATUS_STYLE[r.status])}>
                                    <Icon className="h-3 w-3" />
                                    {STATUS_LABEL[r.status]}
                                </span>
                                {r.file && (
                                    <button className="h-7 w-7 rounded-lg border-2 border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors active:scale-95">
                                        <Download className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="py-16 text-center text-[13px] text-gray-400">Tidak ada laporan ditemukan.</div>
                )}
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
                {filtered.map((r, i) => {
                    const Icon = STATUS_ICON[r.status] ?? CheckCircle2;
                    return (
                        <div
                            key={r.id}
                            className="bg-white border-2 border-gray-200 shadow-sm rounded-xl p-4 animate-row"
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            <div className="flex items-start gap-3">
                                <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <FileText className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold text-gray-800 leading-snug">{r.judul}</p>
                                    <p className="text-[12px] text-gray-400 mt-0.5">{r.periode}</p>
                                </div>
                                {r.file && (
                                    <button className="h-8 w-8 rounded-lg border-2 border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors shrink-0 active:scale-95">
                                        <Download className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] text-gray-400">Total:</span>
                                    <span className="text-[13px] font-semibold text-gray-700">
                                        {r.total > 0 ? `${r.total} item` : "—"}
                                    </span>
                                </div>
                                <span className={cn("flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full", STATUS_STYLE[r.status])}>
                                    <Icon className="h-3 w-3" />
                                    {STATUS_LABEL[r.status]}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="py-12 text-center">
                        <FileText className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                        <p className="text-[13px] text-gray-400">Tidak ada laporan ditemukan.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
