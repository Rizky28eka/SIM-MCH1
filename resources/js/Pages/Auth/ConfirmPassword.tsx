import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Lock } from "lucide-react";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Konfirmasi Kata Sandi" />

            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Area Keamanan</h1>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    Ini adalah area aman. Silakan konfirmasi kata sandi Anda sebelum melanjutkan.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi" className="text-slate-700 font-bold mb-1.5 ml-1" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white focus:ring-indigo-500 rounded-xl transition-all"
                        isFocused={true}
                        placeholder="Masukkan kata sandi Anda"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2 ml-1" />
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl shadow-xl shadow-teal-100 flex items-center justify-center gap-2 transition-all uppercase tracking-widest" 
                        disabled={processing}
                    >
                        KONFIRMASI AKSES <Lock className="h-4 w-4" />
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
