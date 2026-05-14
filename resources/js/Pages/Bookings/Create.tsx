import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    Calendar,
    Clock,
    FileText,
    Building2,
    ChevronLeft,
    ArrowRight,
    ShieldCheck,
    Info,
    AlertCircle,
    Upload,
} from "lucide-react";
import { FormEventHandler, useState, useEffect } from "react";
import axios from "axios";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import PrimaryButton from "@/components/PrimaryButton";
import { cn } from "@/lib/utils";

interface Room {
    id: number;
    name: string;
    capacity: number;
    facilities: string[];
}

interface Props {
    rooms: Room[];
    selected_room_id?: number | string;
}

export default function Create({ rooms, selected_room_id }: Props) {
    const { templates } = usePage().props as any;
    const { data, setData, post, processing, errors } = useForm({
        room_id: selected_room_id || "",
        start_time: "",
        end_time: "",
        purpose: "",
        position: "",
        organization: "",
        phone: "",
        participants_count: "",
        event_format: "Tidak Berbayar",
        objective: "",
        document: null as File | null,
    });

    const [conflict, setConflict] = useState<any>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [roomSchedule, setRoomSchedule] = useState<any[]>([]);

    useEffect(() => {
        if (data.room_id) {
            axios.get(route('bookings.room-schedule'), { params: { room_id: data.room_id } })
                .then(res => setRoomSchedule(res.data))
                .catch(err => console.error(err));
        } else {
            setRoomSchedule([]);
        }
    }, [data.room_id]);

    useEffect(() => {
        if (data.room_id && data.start_time && data.end_time) {
            const check = async () => {
                setIsChecking(true);
                try {
                    const response = await axios.get(route('bookings.check-availability'), {
                        params: {
                            room_id: data.room_id,
                            start_time: data.start_time,
                            end_time: data.end_time
                        }
                    });
                    setConflict(response.data.available ? null : response.data.conflict);
                } catch (e) {
                    console.error("Availability check failed", e);
                } finally {
                    setIsChecking(false);
                }
            };
            
            const timer = setTimeout(check, 500); // Debounce
            return () => clearTimeout(timer);
        } else {
            setConflict(null);
        }
    }, [data.room_id, data.start_time, data.end_time]);

    const [dragActive, setDragActive] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("bookings.store"));
    };

    const selectedRoom = rooms.find((r) => r.id === Number(data.room_id));

    return (
        <AuthenticatedLayout>
            <Head title="Ajukan Peminjaman" />

            <div className="max-w-6xl mx-auto pb-24">
                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-5">
                        <Link
                            href={route("rooms.index")}
                            className="h-12 w-12 rounded-2xl bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-50 transition-all active:scale-90 shrink-0"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                Form Peminjaman
                            </h1>
                            <p className="text-[14px] text-slate-400 font-medium mt-1.5 flex items-center gap-2">
                                <Info className="h-4 w-4 text-teal-500" />
                                Lengkapi detail untuk reservasi ruangan di
                                Makassar Creative Hub
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={submit}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
                >
                    {/* ── Left Side: Form ── */}
                    <div className="lg:col-span-7 space-y-8 animate-row">
                        {/* Step 1: Ruangan */}
                        <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[13px] font-black text-slate-400">
                                    1
                                </div>
                                <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">
                                    Pilih Ruangan
                                </h3>
                            </div>
                            <div className="p-8 sm:p-10">
                                <div className="space-y-3">
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors pointer-events-none">
                                            <Building2 className="h-5 w-5" />
                                        </div>
                                        <select
                                            id="room_id"
                                            value={data.room_id}
                                            onChange={(e) =>
                                                setData(
                                                    "room_id",
                                                    e.target.value,
                                                )
                                            }
                                            className="block w-full pl-14 pr-10 py-5 bg-slate-50 border-slate-200 focus:bg-white focus:ring-teal-500 focus:border-teal-500 rounded-2xl text-[16px] font-bold text-slate-800 transition-all appearance-none"
                                        >
                                            <option value="">
                                                -- Pilih Ruangan --
                                            </option>
                                            {rooms.map((room) => (
                                                <option
                                                    key={room.id}
                                                    value={room.id}
                                                >
                                                    {room.name} (Kapasitas:{" "}
                                                    {room.capacity})
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <ArrowRight className="h-4 w-4 rotate-90" />
                                        </div>
                                    </div>
                                    <InputError
                                        message={errors.room_id}
                                        className="ml-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Waktu */}
                        <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[13px] font-black text-slate-400">
                                    2
                                </div>
                                <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">
                                    Jadwal Penggunaan
                                </h3>
                            </div>
                            <div className="p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <InputLabel
                                        htmlFor="start_time"
                                        value="Mulai Peminjaman"
                                        className="text-slate-400 font-black ml-1 uppercase tracking-widest text-[10px]"
                                    />
                                    <div className="relative group">
                                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors pointer-events-none" />
                                        <input
                                            id="start_time"
                                            type="datetime-local"
                                            value={data.start_time}
                                            onChange={(e) =>
                                                setData(
                                                    "start_time",
                                                    e.target.value,
                                                )
                                            }
                                            className="block w-full pl-14 pr-4 py-5 bg-slate-50 border-slate-200 focus:bg-white focus:ring-teal-500 focus:border-teal-500 rounded-2xl text-[16px] font-bold text-slate-800 transition-all"
                                        />
                                    </div>
                                    <InputError
                                        message={errors.start_time}
                                        className="ml-1"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <InputLabel
                                        htmlFor="end_time"
                                        value="Selesai Peminjaman"
                                        className="text-slate-400 font-black ml-1 uppercase tracking-widest text-[10px]"
                                    />
                                    <div className="relative group">
                                        <Clock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors pointer-events-none" />
                                        <input
                                            id="end_time"
                                            type="datetime-local"
                                            value={data.end_time}
                                            onChange={(e) =>
                                                setData(
                                                    "end_time",
                                                    e.target.value,
                                                )
                                            }
                                            className="block w-full pl-14 pr-4 py-5 bg-slate-50 border-slate-200 focus:bg-white focus:ring-teal-500 focus:border-teal-500 rounded-2xl text-[16px] font-bold text-slate-800 transition-all"
                                        />
                                    </div>
                                    <InputError
                                        message={errors.end_time}
                                        className="ml-1"
                                    />
                                </div>
                            </div>

                            {/* Schedule Guide Section */}
                            {data.room_id && roomSchedule.length > 0 && (
                                <div className="px-8 pb-10 sm:px-10">
                                    <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Info className="h-4 w-4 text-teal-600" />
                                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Jadwal Terisi (Gunakan Waktu Selain Ini)</p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {roomSchedule.map((s, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/60 shadow-sm">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{s.start.split(', ')[0]}</span>
                                                        <span className="text-[13px] font-bold text-slate-700">{s.start.split(', ')[1]} - {s.end}</span>
                                                    </div>
                                                    <div className="px-3 py-1 rounded-lg bg-rose-50 text-[10px] font-black text-rose-500 uppercase">Terpakai</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 3: Keperluan */}
                        <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[13px] font-black text-slate-400">
                                    3
                                </div>
                                <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">
                                    Detail Acara
                                </h3>
                            </div>
                            <div className="p-8 sm:p-10">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <InputLabel
                                            htmlFor="purpose"
                                            value="Keperluan Peminjaman"
                                            className="ml-1 text-[11px] font-black uppercase tracking-widest text-slate-400"
                                        />
                                        <div className="relative group">
                                            <FileText className="absolute left-5 top-5 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors pointer-events-none" />
                                            <textarea
                                                id="purpose"
                                                rows={4}
                                                value={data.purpose}
                                                onChange={(e) =>
                                                    setData(
                                                        "purpose",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Jelaskan secara singkat tujuan peminjaman ruangan, nama acara, dan jumlah peserta..."
                                                className="block w-full pl-14 pr-5 py-5 bg-slate-50 border-slate-200 focus:bg-white focus:ring-teal-500 focus:border-teal-500 rounded-2xl text-[16px] font-bold text-slate-800 transition-all resize-none leading-relaxed"
                                            />
                                        </div>
                                        <InputError
                                            message={errors.purpose}
                                            className="ml-1"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <InputLabel
                                                htmlFor="position"
                                                value="Jabatan"
                                                className="ml-1 text-[11px] font-black uppercase tracking-widest text-slate-400"
                                            />
                                            <TextInput
                                                id="position"
                                                value={data.position}
                                                onChange={(e) =>
                                                    setData(
                                                        "position",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: Ketua Komunitas"
                                                className="w-full h-14 bg-slate-50 border-slate-200 rounded-2xl px-5 text-[15px] font-bold text-slate-800 focus:bg-white"
                                            />
                                            <InputError
                                                message={errors.position}
                                                className="ml-1"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <InputLabel
                                                htmlFor="organization"
                                                value="Nama Komunitas / Organisasi"
                                                className="ml-1 text-[11px] font-black uppercase tracking-widest text-slate-400"
                                            />
                                            <TextInput
                                                id="organization"
                                                value={data.organization}
                                                onChange={(e) =>
                                                    setData(
                                                        "organization",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: Makassar Creative Hub"
                                                className="w-full h-14 bg-slate-50 border-slate-200 rounded-2xl px-5 text-[15px] font-bold text-slate-800 focus:bg-white"
                                            />
                                            <InputError
                                                message={errors.organization}
                                                className="ml-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <InputLabel
                                            htmlFor="phone"
                                            value="Nomor Kontak (WhatsApp)"
                                            className="ml-1 text-[11px] font-black uppercase tracking-widest text-slate-400"
                                        />
                                        <TextInput
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            placeholder="Contoh: 081234567890"
                                            className="w-full h-14 bg-slate-50 border-slate-200 rounded-2xl px-5 text-[15px] font-bold text-slate-800 focus:bg-white"
                                        />
                                        <InputError
                                            message={errors.phone}
                                            className="ml-1"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <InputLabel
                                                htmlFor="participants_count"
                                                value="Estimasi Jumlah Peserta"
                                                className="ml-1 text-[11px] font-black uppercase tracking-widest text-slate-400"
                                            />
                                            <TextInput
                                                id="participants_count"
                                                type="number"
                                                value={data.participants_count}
                                                onChange={(e) =>
                                                    setData(
                                                        "participants_count",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: 50"
                                                className="w-full h-14 bg-slate-50 border-slate-200 rounded-2xl px-5 text-[15px] font-bold text-slate-800 focus:bg-white"
                                            />
                                            <InputError
                                                message={
                                                    errors.participants_count
                                                }
                                                className="ml-1"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <InputLabel
                                                htmlFor="event_format"
                                                value="Format Kegiatan"
                                                className="ml-1 text-[11px] font-black uppercase tracking-widest text-slate-400"
                                            />
                                            <select
                                                id="event_format"
                                                value={data.event_format}
                                                onChange={(e) =>
                                                    setData(
                                                        "event_format",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full h-14 bg-slate-50 border-slate-200 rounded-2xl px-5 text-[15px] font-bold text-slate-800 focus:bg-white focus:ring-teal-500 focus:border-teal-500 transition-all"
                                            >
                                                <option value="Tidak Berbayar">
                                                    Tidak Berbayar (Gratis)
                                                </option>
                                                <option value="Berbayar">
                                                    Berbayar / Komersial
                                                </option>
                                            </select>
                                            <InputError
                                                message={errors.event_format}
                                                className="ml-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <InputLabel
                                            htmlFor="objective"
                                            value="Tujuan Kegiatan"
                                            className="ml-1 text-[11px] font-black uppercase tracking-widest text-slate-400"
                                        />
                                        <textarea
                                            id="objective"
                                            rows={3}
                                            value={data.objective}
                                            onChange={(e) =>
                                                setData(
                                                    "objective",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Jelaskan tujuan utama dari kegiatan yang akan diselenggarakan..."
                                            className="block w-full px-5 py-4 bg-slate-50 border-slate-200 focus:bg-white focus:ring-teal-500 focus:border-teal-500 rounded-2xl text-[15px] font-bold text-slate-800 transition-all resize-none"
                                        />
                                        <InputError
                                            message={errors.objective}
                                            className="ml-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Side: Sticky Summary ── */}
                    <div className="lg:col-span-5 space-y-8 sticky top-10">
                        {/* Final Action Card */}
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-300 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/20 rounded-full -translate-y-20 translate-x-20 blur-3xl group-hover:bg-teal-500/30 transition-all duration-700" />

                            <div className="relative z-10 space-y-10">
                                <div className="flex items-center justify-between">
                                    <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                        <ShieldCheck className="h-7 w-7 text-teal-400" />
                                    </div>
                                    <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                                        Konfirmasi
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-black text-white/30 uppercase tracking-widest">
                                            Ruangan Terpilih
                                        </p>
                                        <p className="text-xl font-black tracking-tight">
                                            {selectedRoom
                                                ? selectedRoom.name
                                                : "Belum Memilih"}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                                                Kapasitas
                                            </p>
                                            <p className="text-[14px] font-bold">
                                                {selectedRoom
                                                    ? `${selectedRoom.capacity} Orang`
                                                    : "-"}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Status</p>
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "h-2 w-2 rounded-full",
                                                    isChecking ? "bg-amber-400 animate-pulse" : 
                                                    (!data.start_time || !data.end_time) ? "bg-slate-500" :
                                                    (conflict ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] animate-pulse" : "bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]")
                                                )} />
                                                <p className={cn(
                                                    "text-lg font-black",
                                                    isChecking ? "text-amber-400" :
                                                    (!data.start_time || !data.end_time) ? "text-slate-500" :
                                                    (conflict ? "text-rose-400" : "text-teal-400")
                                                )}>
                                                    {isChecking ? 'Mengecek...' : 
                                                     (!data.start_time || !data.end_time) ? 'Lengkapi Waktu' :
                                                     (conflict ? 'Bentrok Jadwal' : 'Tersedia')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Conflict Info Alert */}
                                {conflict && (
                                    <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 animate-in fade-in zoom-in duration-300">
                                        <div className="flex items-start gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-rose-500 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
                                                <AlertCircle className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-black text-rose-100">Jadwal Tidak Tersedia</p>
                                                <p className="text-[11px] font-medium text-rose-100/60 mt-1 leading-relaxed">
                                                    Ruangan ini telah dipesan untuk <span className="text-rose-400 font-bold underline">"{conflict.purpose}"</span> pada pukul <span className="text-white font-bold">{conflict.start} - {conflict.end}</span>. Silakan pilih waktu lain.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className={cn(
                                        "w-full h-20 text-slate-900 font-black rounded-[2rem] shadow-2xl shadow-black/40 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[14px] group active:scale-[0.97]",
                                        (conflict || isChecking || !data.room_id || !data.start_time || !data.end_time || processing) 
                                            ? "bg-slate-700 text-white/30 cursor-not-allowed" 
                                            : "bg-white hover:bg-teal-500 hover:text-white"
                                    )}
                                    disabled={processing || !!conflict || isChecking || !data.room_id || !data.start_time || !data.end_time}
                                >
                                    {isChecking ? 'Mengecek...' : 
                                     (!data.room_id) ? 'Pilih Ruangan' :
                                     (!data.start_time || !data.end_time) ? 'Isi Jadwal' :
                                     (conflict ? 'Cari Waktu Lain' : 'Konfirmasi & Kirim')}
                                    
                                    {!conflict && !isChecking && data.room_id && data.start_time && data.end_time && (
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
