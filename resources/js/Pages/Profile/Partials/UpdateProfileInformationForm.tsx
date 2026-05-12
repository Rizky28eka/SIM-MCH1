import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" className="text-slate-700 font-bold mb-1.5 ml-1" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white focus:ring-teal-500 rounded-xl transition-all"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                        placeholder="Nama lengkap Anda"
                    />
                    <InputError className="mt-2 ml-1" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" className="text-slate-700 font-bold mb-1.5 ml-1" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white focus:ring-teal-500 rounded-xl transition-all"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        placeholder="contoh@email.com"
                    />
                    <InputError className="mt-2 ml-1" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                        <p className="text-sm text-amber-800 font-medium">
                            Email Anda belum terverifikasi.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 font-black text-teal-600 underline hover:text-teal-700"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-black text-green-600">
                                Link verifikasi baru telah dikirim ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton 
                        disabled={processing}
                        className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl shadow-lg shadow-teal-100 transition-all uppercase tracking-widest"
                    >
                        Simpan Perubahan
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-bold text-teal-600 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-teal-600" /> Tersimpan
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
