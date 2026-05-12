import DangerButton from '@/components/DangerButton';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import Modal from '@/components/Modal';
import SecondaryButton from '@/components/SecondaryButton';
import TextInput from '@/components/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <DangerButton onClick={confirmUserDeletion}>
                Hapus Akun Permanen
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-10">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
                        Apakah Anda yakin ingin menghapus akun?
                    </h2>

                    <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
                        Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen. 
                        Silakan masukkan kata sandi Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun secara permanen.
                    </p>

                    <div className="space-y-4">
                        <InputLabel
                            htmlFor="password"
                            value="Konfirmasi Kata Sandi"
                            className="text-slate-700 font-bold ml-1"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="block w-full px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white focus:ring-red-500 rounded-xl transition-all"
                            isFocused
                            placeholder="Masukkan kata sandi Anda"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2 ml-1"
                        />
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row justify-end gap-3">
                        <SecondaryButton onClick={closeModal} className="justify-center">
                            Batalkan
                        </SecondaryButton>

                        <DangerButton disabled={processing} className="justify-center">
                            Ya, Hapus Akun Saya
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
