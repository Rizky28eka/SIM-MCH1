import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { ShieldCheck } from "lucide-react";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Atur Ulang Kata Sandi" />

            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Atur Ulang Sandi</h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    Silakan masukkan kata sandi baru Anda untuk memulihkan akses akun.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" className="text-slate-700 font-bold mb-1.5 ml-1" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white focus:ring-indigo-500 rounded-xl transition-all"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2 ml-1" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi Baru" className="text-slate-700 font-bold mb-1.5 ml-1" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white focus:ring-indigo-500 rounded-xl transition-all"
                        autoComplete="new-password"
                        isFocused={true}
                        placeholder="Minimal 8 karakter"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2 ml-1" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Kata Sandi"
                        className="text-slate-700 font-bold mb-1.5 ml-1"
                    />

                    <TextInput
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="block w-full px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white focus:ring-indigo-500 rounded-xl transition-all"
                        autoComplete="new-password"
                        placeholder="Ulangi kata sandi"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 ml-1"
                    />
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl shadow-xl shadow-teal-100 flex items-center justify-center gap-2 transition-all uppercase tracking-widest" 
                        disabled={processing}
                    >
                        PERBARUI KATA SANDI <ShieldCheck className="h-4 w-4" />
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
