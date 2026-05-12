import Checkbox from '@/components/Checkbox';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LogIn } from "lucide-react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk Ke Akun" />

            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Selamat Datang Kembali</h1>
                <p className="text-slate-500 font-medium text-sm mt-1">Silakan masuk ke akun Anda untuk melanjutkan akses sistem.</p>
            </div>

            {status && (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl text-sm font-bold text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" className="text-slate-700 font-bold mb-1.5 ml-1" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white focus:ring-teal-500 rounded-xl transition-all"
                        autoComplete="username"
                        isFocused={true}
                        placeholder="contoh@email.com"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2 ml-1" />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5 ml-1">
                        <InputLabel htmlFor="password" value="Kata Sandi" className="text-slate-700 font-bold" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-black text-teal-600 hover:text-teal-700 uppercase tracking-widest transition-colors"
                            >
                                Lupa sandi?
                            </Link>
                        )}
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white focus:ring-teal-500 rounded-xl transition-all"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2 ml-1" />
                </div>

                <div className="flex items-center">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        onChange={(e) =>
                            setData(
                                'remember',
                                (e.target.checked || false) as false,
                            )
                        }
                        className="rounded-md border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="ms-3 text-sm font-bold text-slate-500">
                        Ingat perangkat ini
                    </span>
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl shadow-xl shadow-teal-100 flex items-center justify-center gap-2 transition-all uppercase tracking-widest" 
                        disabled={processing}
                    >
                        MASUK SEKARANG <LogIn className="h-4 w-4" />
                    </PrimaryButton>
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm font-bold text-slate-400">
                        Belum punya akun?{' '}
                        <Link
                            href={route('register')}
                            className="text-teal-600 hover:text-teal-700 transition-colors underline decoration-teal-100 underline-offset-4"
                        >
                            Daftar di sini
                        </Link>
                    </p>
                </div>

                <div className="flex justify-center pt-4 border-t border-slate-100">
                    <Link
                        href="/"
                        className="text-xs font-black text-slate-400 hover:text-teal-600 uppercase tracking-[0.2em] transition-all flex items-center gap-2"
                    >
                        <span className="h-[1px] w-4 bg-slate-200" /> KEMBALI KE BERANDA
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
