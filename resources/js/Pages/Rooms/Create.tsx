import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
    ChevronLeft, Save, Building2, Users, ChevronDown,
    Plus, X, Image as ImageIcon, ShieldCheck,
    ArrowRight,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function Create() {
    const [facilityInput, setFacilityInput] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        capacity: '',
        status: 'available',
        facilities: [] as string[],
        image: null as File | null,
    });

    const addFacility = () => {
        if (facilityInput.trim() && !data.facilities.includes(facilityInput.trim())) {
            setData('facilities', [...data.facilities, facilityInput.trim()]);
            setFacilityInput('');
        }
    };

    const removeFacility = (index: number) => {
        setData('facilities', data.facilities.filter((_, i) => i !== index));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('rooms.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Ruangan" />

            {/* ── Page Header ── */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href={route('rooms.index')}
                    className="group flex items-center justify-center h-11 w-11 rounded-2xl bg-white border-[1.5px] border-slate-200 text-slate-400 hover:text-slate-900 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all active:scale-90 shrink-0"
                >
                    <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
                </Link>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Tambah Ruangan
                        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                    </h1>
                    <p className="text-[13px] text-slate-400 mt-1 font-medium hidden sm:block">Lengkapi informasi, fasilitas, dan foto ruangan baru.</p>
                </div>
            </div>

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">

                    {/* ── Left: Forms ── */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Informasi Dasar */}
                        <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm p-6 sm:p-8 animate-row">
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                                <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center shrink-0 shadow-lg shadow-slate-200">
                                    <Building2 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-800">Informasi Dasar</h2>
                                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Detail ruangan & kapasitas</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-[13px] font-bold text-slate-700 ml-1">Nama Ruangan</Label>
                                    <Input
                                        id="name"
                                        placeholder="Contoh: Ruang Aula Utama"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="h-12 rounded-2xl border-[1.5px] border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 text-[14px] font-bold px-4 shadow-sm transition-all"
                                    />
                                    {errors.name && <p className="text-[11px] font-bold text-rose-500 ml-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="capacity" className="text-[13px] font-bold text-slate-700 ml-1">Kapasitas (Orang)</Label>
                                    <div className="relative group">
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                                        <Input
                                            id="capacity"
                                            type="number"
                                            placeholder="0"
                                            value={data.capacity}
                                            onChange={(e) => setData('capacity', e.target.value)}
                                            className="h-12 pl-12 rounded-2xl border-[1.5px] border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 text-[14px] font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-sm transition-all"
                                        />
                                    </div>
                                    {errors.capacity && <p className="text-[11px] font-bold text-rose-500 ml-1">{errors.capacity}</p>}
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <Label htmlFor="status" className="text-[13px] font-bold text-slate-700 ml-1">Status Awal</Label>
                                <div className="relative group">
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as 'available' | 'maintenance' | 'unavailable')}
                                        className="w-full h-12 rounded-2xl border-[1.5px] border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 text-[14px] font-bold px-4 pr-10 outline-none appearance-none cursor-pointer shadow-sm transition-all"
                                    >
                                        <option value="available">Tersedia (Available)</option>
                                        <option value="maintenance">Dalam Perbaikan (Maintenance)</option>
                                        <option value="unavailable">Penuh / Tidak Tersedia</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
                                </div>
                                {errors.status && <p className="text-[11px] font-bold text-rose-500 ml-1">{errors.status}</p>}
                            </div>
                        </div>

                        {/* Fasilitas */}
                        <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm p-6 sm:p-8 animate-row" style={{ animationDelay: '100ms' }}>
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                    <ShieldCheck className="h-5 w-5 text-slate-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-800">Fasilitas Ruangan</h2>
                                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Tambahkan perlengkapan yang tersedia</p>
                                </div>
                            </div>

                            <div className="flex gap-3 mb-6 group">
                                <Input
                                    placeholder="Ketik fasilitas lalu tekan Enter..."
                                    value={facilityInput}
                                    onChange={(e) => setFacilityInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                                    className="flex-1 h-12 rounded-2xl border-[1.5px] border-slate-200 bg-slate-50/50 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 text-[14px] font-bold px-4 shadow-sm transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={addFacility}
                                    className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-100 transition-all active:scale-90 shrink-0"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2.5">
                                {data.facilities.map((f, i) => (
                                    <span key={i} className="flex items-center gap-2 h-10 pl-4 pr-2 bg-slate-900 text-white rounded-xl text-[12px] font-black shadow-md shadow-slate-200 group animate-in zoom-in-95 duration-200">
                                        {f}
                                        <button
                                            type="button"
                                            onClick={() => removeFacility(i)}
                                            className="h-6 w-6 rounded-lg bg-white/10 flex items-center justify-center hover:bg-rose-500 transition-colors"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </span>
                                ))}
                                {data.facilities.length === 0 && (
                                    <div className="w-full py-10 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2">
                                        <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                            <Plus className="h-5 w-5 text-slate-300" />
                                        </div>
                                        <p className="text-[13px] font-bold text-slate-400 italic">Belum ada fasilitas ditambahkan.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Photo + Actions ── */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Photo Upload */}
                        <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm p-6 animate-row" style={{ animationDelay: '200ms' }}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                    <ImageIcon className="h-4.5 w-4.5 text-slate-500" />
                                </div>
                                <h2 className="text-[15px] font-black text-slate-800">Foto Ruangan</h2>
                            </div>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    'relative h-64 rounded-3xl border-[2px] border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group overflow-hidden',
                                    imagePreview
                                        ? 'border-transparent shadow-xl'
                                        : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                                )}
                            >
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="bg-white px-5 py-2 rounded-2xl text-[12px] font-black text-slate-900 shadow-xl scale-90 group-hover:scale-100 transition-transform">
                                                Ganti Foto
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-center p-6">
                                        <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 text-slate-300 group-hover:text-indigo-500 group-hover:bg-white group-hover:shadow-lg group-hover:shadow-indigo-100 transition-all duration-500 border border-slate-100">
                                            <Plus className="h-8 w-8" />
                                        </div>
                                        <p className="text-[14px] font-black text-slate-700 group-hover:text-indigo-600 transition-colors">Upload Foto</p>
                                        <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-widest">JPG, PNG • MAX 2MB</p>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                            </div>

                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setImagePreview(null); setData('image', null); }}
                                    className="mt-4 w-full h-11 rounded-2xl text-rose-500 hover:bg-rose-50 text-[12px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border border-transparent hover:border-rose-100"
                                >
                                    <X className="h-4 w-4" />
                                    Hapus Foto
                                </button>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 animate-row" style={{ animationDelay: '300ms' }}>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-14 rounded-2xl bg-slate-900 text-white text-[14px] font-black flex items-center justify-center gap-3 hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all active:scale-95 disabled:opacity-60 shadow-lg shadow-slate-200 group"
                            >
                                {processing ? (
                                    'Menyimpan...'
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        Simpan Ruangan
                                        <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </>
                                )}
                            </button>
                            <Link href={route('rooms.index')} className="block">
                                <button type="button" className="w-full h-12 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 text-[14px] font-bold transition-all active:scale-95">
                                    Batal
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
