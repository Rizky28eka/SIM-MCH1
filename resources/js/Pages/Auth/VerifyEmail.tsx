import PrimaryButton from '@/components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { MailCheck, LogOut } from "lucide-react";

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email" />

            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Verifikasi Email</h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    Terima kasih telah mendaftar! Sebelum memulai, silakan verifikasi alamat email Anda melalui tautan yang baru saja kami kirimkan.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl text-sm font-bold text-green-600">
                    Tautan verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div className="flex flex-col gap-4">
                    <PrimaryButton 
                        className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl shadow-xl shadow-teal-100 flex items-center justify-center gap-2 transition-all uppercase tracking-widest" 
                        disabled={processing}
                    >
                        KIRIM ULANG EMAIL VERIFIKASI <MailCheck className="h-4 w-4" />
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <LogOut className="h-4 w-4" /> Keluar Sesi
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
