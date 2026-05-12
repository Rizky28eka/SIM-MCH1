import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { User, ShieldCheck, Trash2 } from "lucide-react";

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout>
            <Head title="Pengaturan Profil" />

            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pengaturan Profil</h1>
                <p className="text-slate-500 font-bold text-sm mt-1">Kelola informasi identitas dan keamanan akun Anda dalam satu tempat.</p>
            </div>

            <div className="grid grid-cols-1 gap-10">
                {/* ── PROFILE INFORMATION ── */}
                <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-8 md:p-10 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
                        <div className="h-12 w-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-100">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-black text-slate-900 tracking-tight">Informasi Dasar</h2>
                            <p className="text-[12px] font-bold text-slate-400 mt-0.5">Update nama dan alamat email akun Anda.</p>
                        </div>
                    </div>
                    <div className="p-8 md:p-10">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-2xl"
                        />
                    </div>
                </div>

                {/* ── PASSWORD UPDATE ── */}
                <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-8 md:p-10 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
                        <div className="h-12 w-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-100">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-black text-slate-900 tracking-tight">Keamanan & Sandi</h2>
                            <p className="text-[12px] font-bold text-slate-400 mt-0.5">Pastikan Anda menggunakan kata sandi yang kuat.</p>
                        </div>
                    </div>
                    <div className="p-8 md:p-10">
                        <UpdatePasswordForm className="max-w-2xl" />
                    </div>
                </div>

                {/* ── DELETE ACCOUNT ── */}
                <div className="bg-white rounded-[2.5rem] border-[1.5px] border-red-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-8 md:p-10 border-b border-red-50 flex items-center gap-4 bg-red-50/30">
                        <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-100">
                            <Trash2 className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-black text-red-600 tracking-tight">Hapus Akun</h2>
                            <p className="text-[12px] font-bold text-red-400 mt-0.5">Tindakan ini bersifat permanen dan tidak dapat dibatalkan.</p>
                        </div>
                    </div>
                    <div className="p-8 md:p-10">
                        <DeleteUserForm className="max-w-2xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
