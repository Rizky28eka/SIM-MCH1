import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Kata Sandi Saat Ini"
                        className="text-slate-700 font-bold mb-1.5 ml-1"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white focus:ring-teal-500 rounded-xl transition-all"
                        autoComplete="current-password"
                        placeholder="••••••••"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2 ml-1"
                    />
                </div>

                <div>
                    <InputLabel 
                        htmlFor="password" 
                        value="Kata Sandi Baru" 
                        className="text-slate-700 font-bold mb-1.5 ml-1"
                    />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white focus:ring-teal-500 rounded-xl transition-all"
                        autoComplete="new-password"
                        placeholder="••••••••"
                    />

                    <InputError message={errors.password} className="mt-2 ml-1" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Kata Sandi Baru"
                        className="text-slate-700 font-bold mb-1.5 ml-1"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white focus:ring-teal-500 rounded-xl transition-all"
                        autoComplete="new-password"
                        placeholder="••••••••"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 ml-1"
                    />
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton 
                        disabled={processing}
                        className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl shadow-lg shadow-teal-100 transition-all uppercase tracking-widest"
                    >
                        Update Kata Sandi
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-bold text-teal-600 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-teal-600" /> Berhasil diperbarui
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
