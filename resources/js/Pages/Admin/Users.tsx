import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { User, Trash2, Shield, Mail, Users, UserCheck, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Role { name: string }
interface UserData { id: number; name: string; email: string; roles: Role[] }
interface Props { users: UserData[] }

export default function UsersPage({ users }: Props) {
    const { delete: destroy, processing } = useForm();
    const [search, setSearch] = useState('');

    const deleteUser = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            destroy(route('admin.users.destroy', id));
        }
    };

    const total  = users.length;
    const admins = users.filter(u => u.roles.some(r => r.name === 'admin')).length;
    const members = total - admins;

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const statCards = [
        { label: 'Total Pengguna', value: total,   icon: Users,     color: 'bg-gray-50 text-gray-400'   },
        { label: 'Administrator',  value: admins,  icon: Shield,    color: 'bg-gray-900 text-white'      },
        { label: 'Member Biasa',   value: members, icon: UserCheck, color: 'bg-blue-50 text-blue-500'   },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Pengguna" />

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Manajemen Pengguna</h1>
                    <p className="text-[12px] text-gray-400 mt-0.5">Kelola akses dan peran pengguna dalam sistem</p>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-500 bg-white border-2 border-gray-200 shadow-sm rounded-lg h-9 px-3 shrink-0">
                    <Shield className="h-3.5 w-3.5 text-gray-400" />
                    <span>Admin Panel</span>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                {statCards.map((s, i) => (
                    <div key={i} className="bg-white rounded-xl border-2 border-gray-200 shadow-sm px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3">
                        <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', s.color)}>
                            <s.icon className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-lg sm:text-xl font-bold text-gray-900 leading-none">{s.value}</p>
                            <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 leading-tight">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Search ── */}
            <div className="flex items-center gap-3 bg-white border-2 border-gray-200 shadow-sm rounded-xl px-4 py-2.5 mb-4">
                <Search className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Cari nama atau email pengguna..."
                    className="flex-1 text-[13px] text-gray-700 placeholder:text-gray-400 bg-transparent outline-none min-w-0"
                />
            </div>

            {/* ── Desktop Table (sm+) ── */}
            <div className="hidden sm:block bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 px-5 py-3 bg-gray-50/60 border-b border-gray-100">
                    <p className="col-span-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Informasi User</p>
                    <p className="col-span-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Email</p>
                    <p className="col-span-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Role</p>
                    <p className="col-span-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Aksi</p>
                </div>

                {/* Rows */}
                {filtered.map((user, i) => {
                    const isAdmin = user.roles.some(r => r.name === 'admin');
                    return (
                        <div
                            key={user.id}
                            className={cn(
                                'grid grid-cols-12 px-5 py-4 items-center hover:bg-gray-50/60 transition-colors group animate-row',
                                i < filtered.length - 1 && 'border-b border-gray-100'
                            )}
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            {/* Name */}
                            <div className="col-span-4 flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-[13px] shrink-0 group-hover:scale-105 transition-transform">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13px] font-semibold text-gray-800 truncate">{user.name}</p>
                                    <p className="text-[10px] text-gray-400">USR-{user.id.toString().padStart(3, '0')}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="col-span-4 flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                                <span className="text-[12px] text-gray-500 truncate">{user.email}</span>
                            </div>

                            {/* Role */}
                            <div className="col-span-2">
                                <span className={cn(
                                    'inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full',
                                    isAdmin ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                                )}>
                                    {isAdmin && <Shield className="h-3 w-3" />}
                                    {isAdmin ? 'Admin' : 'Member'}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="col-span-2 flex items-center justify-end gap-2">
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    disabled={processing}
                                    className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <Users className="h-7 w-7 text-gray-200" />
                        </div>
                        <p className="text-[14px] font-semibold text-gray-700">
                            {search ? 'Pengguna tidak ditemukan' : 'Belum ada pengguna'}
                        </p>
                        <p className="text-[12px] text-gray-400">
                            {search ? `Tidak ada hasil untuk "${search}"` : 'Belum ada pengguna terdaftar.'}
                        </p>
                    </div>
                )}
            </div>

            {/* ── Mobile Card List (hidden sm+) ── */}
            <div className="sm:hidden space-y-3">
                {filtered.map((user, i) => {
                    const isAdmin = user.roles.some(r => r.name === 'admin');
                    return (
                        <div
                            key={user.id}
                            className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-4 animate-row"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-[14px] shrink-0">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[13px] font-semibold text-gray-800 leading-tight">{user.name}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">USR-{user.id.toString().padStart(3, '0')}</p>
                                    </div>
                                </div>
                                {/* Role badge */}
                                <span className={cn(
                                    'flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0',
                                    isAdmin ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
                                )}>
                                    {isAdmin && <Shield className="h-3 w-3" />}
                                    {isAdmin ? 'Admin' : 'Member'}
                                </span>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                <Mail className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                                <span className="text-[12px] text-gray-500 truncate flex-1">{user.email}</span>
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    disabled={processing}
                                    className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 shrink-0"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <Users className="h-7 w-7 text-gray-200" />
                        </div>
                        <p className="text-[14px] font-semibold text-gray-700">
                            {search ? 'Tidak ditemukan' : 'Belum ada pengguna'}
                        </p>
                        <p className="text-[12px] text-gray-400 text-center">
                            {search ? `"${search}" tidak cocok dengan pengguna manapun` : 'Belum ada pengguna terdaftar.'}
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
