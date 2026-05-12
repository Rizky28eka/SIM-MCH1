import InputError from '@/components/InputError';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Kata Sandi" />

            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Lupa Kata Sandi?</h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    Jangan khawatir. Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
                </p>
            </div>

            {status && (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl text-sm font-bold text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white focus:ring-indigo-500 rounded-xl transition-all"
                        isFocused={true}
                        placeholder="Masukkan alamat email Anda"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2 ml-1" />
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl shadow-xl shadow-teal-100 flex items-center justify-center gap-2 transition-all uppercase tracking-widest" 
                        disabled={processing}
                    >
                        KIRIM TAUTAN RESET <Mail className="h-4 w-4" />
                    </PrimaryButton>
                </div>

                <div className="text-center mt-6">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-teal-600 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" /> Kembali ke Login
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
