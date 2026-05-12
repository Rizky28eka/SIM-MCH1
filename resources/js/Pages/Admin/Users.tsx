import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { User, Trash2, Shield, Mail, Users, UserCheck, Search, ArrowRight } from 'lucide-react';
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
        { label: 'Total Pengguna', value: total,   icon: Users,     color: 'bg-slate-50 text-slate-400 border-slate-100' },
        { label: 'Administrator',  value: admins,  icon: Shield,    color: 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' },
        { label: 'Member Biasa',   value: members, icon: UserCheck, color: 'bg-indigo-50 text-indigo-500 border-indigo-100' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Pengguna" />

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Manajemen Pengguna
                        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                    </h1>
                    <p className="text-[13px] text-slate-400 mt-1 font-medium">Kelola akses, peran, dan identitas pengguna dalam sistem.</p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 bg-white border-[1.5px] border-slate-200 shadow-sm rounded-2xl h-11 px-5 shrink-0">
                    <Shield className="h-4 w-4 text-indigo-500" />
                    <span>Admin Panel</span>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {statCards.map((s, i) => (
                    <div key={i} className="group bg-white rounded-[2rem] border-[1.5px] border-slate-200 shadow-sm p-6 flex items-center gap-4 animate-row hover:border-indigo-200 hover:shadow-md transition-all duration-300" style={{ animationDelay: `${i * 60}ms` }}>
                        <div className={cn('h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:scale-110', s.color)}>
                            <s.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900 leading-none">{s.value}</p>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-tight">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Search & Filter ── */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Cari nama atau email pengguna..."
                        className="h-12 w-full pl-11 pr-4 bg-white border-[1.5px] border-slate-200 rounded-2xl text-[14px] font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 shadow-sm transition-all"
                    />
                </div>
            </div>

            {/* ── Desktop Table (sm+) ── */}
            <div className="hidden sm:block bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm overflow-hidden mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="grid grid-cols-12 px-8 py-5 bg-slate-50/50 border-b border-slate-200">
                    <p className="col-span-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Informasi User</p>
                    <p className="col-span-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Alamat Email</p>
                    <p className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Peran Sistem</p>
                    <p className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Manajemen</p>
                </div>

                {/* Rows */}
                {filtered.map((user, i) => {
                    const isAdmin = user.roles.some(r => r.name === 'admin');
                    return (
                        <div
                            key={user.id}
                            className={cn(
                                'grid grid-cols-12 px-8 py-6 items-center hover:bg-slate-50/50 transition-all group animate-row',
                                i < filtered.length - 1 && 'border-b border-slate-100'
                            )}
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            {/* Name */}
                            <div className="col-span-4 flex items-center gap-4">
                                <div className="h-11 w-11 rounded-2xl bg-slate-900 border border-slate-900 flex items-center justify-center text-white font-black text-[15px] shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md shadow-slate-200">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[14px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{user.name}</p>
                                    <p className="text-[11px] font-bold text-slate-400 tracking-widest mt-0.5">USR-{user.id.toString().padStart(3, '0')}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="col-span-4 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                    <Mail className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                                </div>
                                <span className="text-[13px] font-bold text-slate-600 truncate">{user.email}</span>
                            </div>

                            {/* Role */}
                            <div className="col-span-2">
                                <span className={cn(
                                    'inline-flex items-center gap-2 text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-wider',
                                    isAdmin ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                                )}>
                                    {isAdmin && <Shield className="h-3 w-3" />}
                                    {isAdmin ? 'Admin' : 'Member'}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="col-span-2 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    disabled={processing}
                                    className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all active:scale-90 disabled:opacity-50"
                                    title="Hapus Pengguna"
                                >
                                    <Trash2 className="h-4.5 w-4.5" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && <EmptyState search={search} />}
            </div>

            {/* ── Mobile Card List (hidden sm+) ── */}
            <div className="sm:hidden space-y-4 mb-12">
                {filtered.map((user, i) => {
                    const isAdmin = user.roles.some(r => r.name === 'admin');
                    return (
                        <div
                            key={user.id}
                            className="bg-white rounded-[2rem] border-[1.5px] border-slate-200 shadow-sm p-6 animate-row"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-[16px] shrink-0 border border-slate-900 shadow-lg shadow-slate-100">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[15px] font-black text-slate-900 leading-tight">{user.name}</p>
                                        <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">USR-{user.id.toString().padStart(3, '0')}</p>
                                    </div>
                                </div>
                                {/* Role badge */}
                                <span className={cn(
                                    'flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full shrink-0 border uppercase tracking-wider',
                                    isAdmin ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-100'
                                )}>
                                    {isAdmin && <Shield className="h-3 w-3" />}
                                    {isAdmin ? 'Admin' : 'Member'}
                                </span>
                            </div>

                            {/* Email */}
                            <div className="flex items-center justify-between gap-4 py-4 border-t border-slate-100 mt-4">
                                <div className="flex items-center gap-2 min-w-0">
                                    <Mail className="h-4 w-4 text-slate-300 shrink-0" />
                                    <span className="text-[13px] font-bold text-slate-500 truncate">{user.email}</span>
                                </div>
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    disabled={processing}
                                    className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 transition-all active:scale-90 disabled:opacity-50 shrink-0"
                                >
                                    <Trash2 className="h-4.5 w-4.5" />
                                </button>
                            </div>
                        </div>
                    );
                })}

                {filtered.length === 0 && <EmptyState search={search} />}
            </div>
        </AuthenticatedLayout>
    );
}

function EmptyState({ search }: { search: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4 animate-in fade-in duration-700">
            <div className="h-20 w-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                <Users className="h-10 w-10 text-slate-200" />
            </div>
            <div className="text-center max-w-xs px-6">
                <p className="text-[16px] font-black text-slate-900 tracking-tight">{search ? 'Pencarian Nihil' : 'Belum Ada Pengguna'}</p>
                <p className="text-[13px] font-bold text-slate-400 mt-2 leading-relaxed">{search ? `Maaf, kami tidak menemukan data pengguna yang cocok dengan kata kunci "${search}"` : 'Sepertinya sistem belum memiliki daftar pengguna terdaftar untuk saat ini.'}</p>
            </div>
        </div>
    );
}
