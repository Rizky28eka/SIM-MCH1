import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Calendar, Clock, FileText, Building2, 
    ChevronLeft, ArrowRight, ShieldCheck, 
    Info, AlertCircle, Upload
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import TextInput from '@/components/TextInput';
import PrimaryButton from '@/components/PrimaryButton';
import { cn } from '@/lib/utils';

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
    const { data, setData, post, processing, errors } = useForm({
        room_id: selected_room_id || '',
        start_time: '',
        end_time: '',
        purpose: '',
        document: null as File | null,
    });

    const [dragActive, setDragActive] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('bookings.store'));
    };

    const selectedRoom = rooms.find(r => r.id === Number(data.room_id));

    return (
        <AuthenticatedLayout>
            <Head title="Ajukan Peminjaman" />

            <div className="max-w-4xl mx-auto pb-20">
                {/* ── Header ── */}
                <div className="flex flex-col gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('rooms.index')}
                            className="h-11 w-11 rounded-2xl bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all active:scale-90"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Form Peminjaman</h1>
                            <p className="text-[13px] text-slate-400 font-medium mt-1">Lengkapi detail berikut untuk mengajukan peminjaman ruangan.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ── Left Side: Form ── */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Main Info Card */}
                        <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm p-8 sm:p-10 space-y-8">
                            
                            {/* Room Selection */}
                            <div className="space-y-3">
                                <InputLabel htmlFor="room_id" value="Pilih Ruangan" className="text-slate-700 font-black ml-1 uppercase tracking-widest text-[10px]" />
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <select
                                        id="room_id"
                                        value={data.room_id}
                                        onChange={(e) => setData('room_id', e.target.value)}
                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-200 focus:bg-white focus:ring-teal-500 focus:border-teal-500 rounded-2xl text-[15px] font-bold text-slate-800 transition-all appearance-none"
                                    >
                                        <option value="">-- Pilih Ruangan --</option>
                                        {rooms.map((room) => (
                                            <option key={room.id} value={room.id}>
                                                {room.name} (Kapasitas: {room.capacity})
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <ArrowRight className="h-4 w-4 rotate-90" />
                                    </div>
                                </div>
                                <InputError message={errors.room_id} className="ml-1" />
                            </div>

                            {/* Time Selection */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <InputLabel htmlFor="start_time" value="Mulai Peminjaman" className="text-slate-700 font-black ml-1 uppercase tracking-widest text-[10px]" />
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                        <input
                                            id="start_time"
                                            type="datetime-local"
                                            value={data.start_time}
                                            onChange={(e) => setData('start_time', e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-200 focus:bg-white focus:ring-teal-500 focus:border-teal-500 rounded-2xl text-[15px] font-bold text-slate-800 transition-all"
                                        />
                                    </div>
                                    <InputError message={errors.start_time} className="ml-1" />
                                </div>

                                <div className="space-y-3">
                                    <InputLabel htmlFor="end_time" value="Selesai Peminjaman" className="text-slate-700 font-black ml-1 uppercase tracking-widest text-[10px]" />
                                    <div className="relative group">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                        <input
                                            id="end_time"
                                            type="datetime-local"
                                            value={data.end_time}
                                            onChange={(e) => setData('end_time', e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-200 focus:bg-white focus:ring-teal-500 focus:border-teal-500 rounded-2xl text-[15px] font-bold text-slate-800 transition-all"
                                        />
                                    </div>
                                    <InputError message={errors.end_time} className="ml-1" />
                                </div>
                            </div>

                            {/* Purpose */}
                            <div className="space-y-3">
                                <InputLabel htmlFor="purpose" value="Keperluan / Acara" className="text-slate-700 font-black ml-1 uppercase tracking-widest text-[10px]" />
                                <div className="relative group">
                                    <FileText className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                    <textarea
                                        id="purpose"
                                        rows={6}
                                        value={data.purpose}
                                        onChange={(e) => setData('purpose', e.target.value)}
                                        placeholder="Jelaskan secara singkat tujuan peminjaman ruangan..."
                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-200 focus:bg-white focus:ring-teal-500 focus:border-teal-500 rounded-2xl text-[15px] font-bold text-slate-800 transition-all resize-none"
                                    />
                                </div>
                                <InputError message={errors.purpose} className="ml-1" />
                            </div>
                        </div>
                    </div>

                    {/* ── Right Side: Info & Summary ── */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Summary Card */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full -translate-y-12 translate-x-12 blur-3xl" />
                            
                            <div className="relative z-10 space-y-8">
                                <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <ShieldCheck className="h-6 w-6 text-teal-400" />
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-black tracking-tight mb-2">Konfirmasi Pengajuan</h3>
                                    <p className="text-[13px] text-white/50 font-medium leading-relaxed">
                                        Setiap pengajuan akan diverifikasi oleh Admin. Harap tunggu email notifikasi setelah pengajuan dikirim.
                                    </p>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Ruangan</span>
                                        <span className="text-[13px] font-black">{selectedRoom ? selectedRoom.name : '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Kapasitas</span>
                                        <span className="text-[13px] font-black">{selectedRoom ? `${selectedRoom.capacity} Orang` : '-'}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-14 bg-white text-slate-900 hover:bg-teal-500 hover:text-white font-black rounded-2xl shadow-xl shadow-black/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50"
                                    disabled={processing}
                                >
                                    KIRIM PENGAJUAN <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Tips Card */}
                        <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                                <h4 className="text-[14px] font-black text-amber-900 uppercase tracking-tight">Tips Peminjaman</h4>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    'Pesan minimal 24 jam sebelum pemakaian.',
                                    'Lengkapi dokumen jika acara bersifat publik.',
                                    'Pastikan waktu selesai tidak melebihi batas operasional.'
                                ].map((tip, i) => (
                                    <li key={i} className="flex gap-3">
                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                        <p className="text-[12px] font-bold text-amber-700/80 leading-relaxed">{tip}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
