import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
    ChevronLeft, Save, Building2, Users, ChevronDown,
    Trash2, Plus, X, Image as ImageIcon, ShieldCheck,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Room {
    id: number;
    name: string;
    capacity: number;
    facilities: string[];
    status: 'available' | 'maintenance' | 'unavailable';
    image_path: string | null;
}

interface Props {
    room: Room;
}

export default function Edit({ room }: Props) {
    const [facilityInput, setFacilityInput] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(
        room.image_path ? `/storage/${room.image_path}` : null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, delete: destroy } = useForm({
        name: room.name,
        capacity: room.capacity.toString(),
        status: room.status,
        facilities: room.facilities || [],
        image: null as File | null,
        _method: 'PATCH',
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
        post(route('rooms.update', room.id));
    };

    const deleteRoom = () => {
        if (confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) {
            destroy(route('rooms.destroy', room.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit - ${room.name}`} />

            {/* ── Page Header ── */}
            <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('rooms.show', room.id)}
                        className="group flex items-center justify-center h-9 w-9 rounded-lg bg-white border-2 border-gray-200 text-gray-400 hover:text-gray-900 transition-all shadow-sm active:scale-95 shrink-0"
                    >
                        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    </Link>
                    <div>
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight">Edit Ruangan</h1>
                        <p className="text-[12px] text-gray-400 mt-0.5 hidden sm:block">
                            Mengubah: <span className="text-gray-700 font-semibold">{room.name}</span>
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={deleteRoom}
                    className="flex items-center gap-2 h-9 px-3 rounded-lg border-2 border-red-100 bg-red-50 text-red-600 text-[12px] font-semibold hover:bg-red-100 transition-colors"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    Hapus
                </button>
            </div>

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                    {/* ── Left: Forms ── */}
                    <div className="lg:col-span-8 space-y-5">

                        {/* Update Informasi */}
                        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-4 sm:p-6">
                            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                                <div className="h-9 w-9 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
                                    <Building2 className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-[14px] font-semibold text-gray-800">Update Informasi</h2>
                                    <p className="text-[11px] text-gray-400">Detail ruangan & kapasitas</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-[12px] font-semibold text-gray-700">Nama Ruangan</Label>
                                    <Input
                                        id="name"
                                        placeholder="Contoh: Ruang Aula Utama"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="h-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:bg-white text-[13px] font-medium px-3"
                                    />
                                    {errors.name && <p className="text-[11px] font-medium text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="capacity" className="text-[12px] font-semibold text-gray-700">Kapasitas (Orang)</Label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                        <Input
                                            id="capacity"
                                            type="number"
                                            placeholder="0"
                                            value={data.capacity}
                                            onChange={(e) => setData('capacity', e.target.value)}
                                            className="h-10 pl-9 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:bg-white text-[13px] font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                    {errors.capacity && <p className="text-[11px] font-medium text-red-500">{errors.capacity}</p>}
                                </div>
                            </div>

                            <div className="mt-5 space-y-1.5">
                                <Label htmlFor="status" className="text-[12px] font-semibold text-gray-700">Status Ruangan</Label>
                                <div className="relative">
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as Room['status'])}
                                        className="w-full h-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:bg-white text-[13px] font-medium px-3 pr-9 outline-none appearance-none cursor-pointer focus:border-gray-400 transition-colors"
                                    >
                                        <option value="available">Tersedia (Available)</option>
                                        <option value="maintenance">Dalam Perbaikan (Maintenance)</option>
                                        <option value="unavailable">Penuh / Tidak Tersedia</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                                {errors.status && <p className="text-[11px] font-medium text-red-500">{errors.status}</p>}
                            </div>
                        </div>

                        {/* Fasilitas */}
                        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-4 sm:p-6">
                            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                                <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="h-4 w-4 text-gray-500" />
                                </div>
                                <div>
                                    <h2 className="text-[14px] font-semibold text-gray-800">Fasilitas Ruangan</h2>
                                    <p className="text-[11px] text-gray-400">Tambahkan AC, Proyektor, dll.</p>
                                </div>
                            </div>

                            <div className="flex gap-3 mb-4">
                                <Input
                                    placeholder="Ketik fasilitas lalu tekan Enter..."
                                    value={facilityInput}
                                    onChange={(e) => setFacilityInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                                    className="flex-1 h-10 rounded-lg border-2 border-gray-200 bg-gray-50/50 focus:bg-white text-[13px] font-medium px-3"
                                />
                                <button
                                    type="button"
                                    onClick={addFacility}
                                    className="h-10 w-10 rounded-lg bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors shrink-0"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {data.facilities.map((f, i) => (
                                    <span key={i} className="flex items-center gap-2 h-8 pl-3 pr-2 bg-gray-900 text-white rounded-lg text-[12px] font-medium">
                                        {f}
                                        <button
                                            type="button"
                                            onClick={() => removeFacility(i)}
                                            className="h-5 w-5 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                                {data.facilities.length === 0 && (
                                    <div className="w-full py-6 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                        <p className="text-[12px] text-gray-400 italic">Belum ada fasilitas ditambahkan.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Right: Photo + Actions ── */}
                    <div className="lg:col-span-4 space-y-5">

                        {/* Photo Upload */}
                        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-4 sm:p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <ImageIcon className="h-4 w-4 text-gray-500" />
                                </div>
                                <h2 className="text-[14px] font-semibold text-gray-800">Foto Ruangan</h2>
                            </div>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    'relative h-56 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group overflow-hidden',
                                    imagePreview
                                        ? 'border-transparent shadow-lg'
                                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                )}
                            >
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[11px] font-semibold text-gray-900">
                                                Klik untuk Ganti Foto
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-center p-6">
                                        <div className="h-14 w-14 rounded-xl bg-gray-100 flex items-center justify-center mb-3 text-gray-300 group-hover:text-gray-500 group-hover:bg-gray-200 transition-all duration-300">
                                            <Plus className="h-7 w-7" />
                                        </div>
                                        <p className="text-[13px] font-semibold text-gray-700">Upload Foto Baru</p>
                                        <p className="text-[11px] text-gray-400 mt-1">JPG, PNG • Max 2MB</p>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                            </div>

                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setImagePreview(null); setData('image', null); }}
                                    className="mt-3 w-full h-9 rounded-lg text-red-500 hover:bg-red-50 text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                                >
                                    <X className="h-3.5 w-3.5" />
                                    Hapus Foto
                                </button>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-11 rounded-xl bg-gray-900 text-white text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors active:scale-95 disabled:opacity-60 shadow-sm"
                            >
                                <Save className="h-4 w-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                            <Link href={route('rooms.show', room.id)} className="block">
                                <button type="button" className="w-full h-10 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-[13px] font-medium transition-colors">
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
