import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Profil Pengguna
                    </h2>
                    <p className="text-sm text-gray-500">Kelola informasi akun dan pengaturan keamanan Anda.</p>
                </div>
            }
        >
            <Head title="Profile" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="bg-white p-4 shadow-sm border-2 border-gray-200 rounded-xl sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow-sm border-2 border-gray-200 rounded-xl sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow-sm border-2 border-gray-200 rounded-xl sm:p-8 text-red-600">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
