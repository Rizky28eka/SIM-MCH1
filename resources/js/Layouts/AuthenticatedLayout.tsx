import ApplicationLogo from '@/components/ApplicationLogo';
import Dropdown from '@/components/Dropdown';
import { Link, usePage, router } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';
import {
    LayoutDashboard, Building2, CalendarCheck, Users,
    Settings, Search, Bell, LogOut, User, ChevronRight,
    X, CheckCircle2, AlertCircle, PanelLeftClose, PanelLeftOpen,
    Menu, Camera, ExternalLink, Calendar as CalendarIcon, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Authenticated({ header, children }: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, flash } = usePage().props as any;
    const user = auth.user;

    // Desktop: sidebar open/collapsed. Mobile: overlay drawer
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ type: 'success', text: '' });

    useEffect(() => {
        if (flash?.message || flash?.error) {
            setToastMessage({ type: flash.message ? 'success' : 'error', text: flash.message || flash.error });
            setShowToast(true);
            const timer = setTimeout(() => setShowToast(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Close mobile drawer on route change
    useEffect(() => { setIsMobileOpen(false); }, []);

    const mainNavItems = [
        { name: 'Dashboard',   href: route('dashboard'),       icon: LayoutDashboard, active: route().current('dashboard')   },
        { name: 'Kalender',    href: route('calendar.index'),  icon: CalendarIcon,    active: route().current('calendar.*')  },
        { name: 'Ruangan',     href: route('rooms.index'),     icon: Building2,       active: route().current('rooms.*')     },
        { name: 'Peminjaman',  href: route('bookings.index'),  icon: CalendarCheck,   active: route().current('bookings.*')  },
    ];
    const adminNavItems = [
        { name: 'Manajemen User', href: route('admin.users.index'), icon: Users,     active: route().current('admin.users.*') },
        { name: 'Pengaturan',     href: route('profile.edit'),      icon: Settings,  active: route().current('profile.*')    },
    ];
    const isAdmin = user.roles?.some((r: any) => r.name === 'admin') || user.email === 'admin@mch.com';

    // ── Sidebar inner content (shared between desktop & mobile) ──────────────
    const SidebarContent = ({ compact = false }: { compact?: boolean }) => (
        <>
            {/* Logo */}
            <div className={cn(
                'flex items-center h-[64px] border-b border-gray-200 px-4 shrink-0',
                compact ? 'justify-center' : 'justify-start'
            )}>
                <Link href="/" className="flex items-center w-full min-w-0">
                    <div className="h-12 w-full flex items-center justify-start">
                        <ApplicationLogo className="h-10 w-auto object-contain" />
                    </div>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
                <div>
                    {!compact && <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Menu</p>}
                    <ul className="space-y-0.5">
                        {mainNavItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    title={compact ? item.name : undefined}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group',
                                        compact ? 'justify-center' : '',
                                        item.active ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                    )}
                                >
                                    <item.icon className={cn('h-4 w-4 shrink-0', item.active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600')} />
                                    {!compact && <span className="text-[13px] font-medium flex-1">{item.name}</span>}
                                    {!compact && item.active && <ChevronRight className="h-3.5 w-3.5 text-white/50" />}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                {isAdmin && (
                    <div>
                        {!compact && <p className="px-3 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Administrator</p>}
                        <ul className="space-y-0.5">
                            {adminNavItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        title={compact ? item.name : undefined}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group',
                                            compact ? 'justify-center' : '',
                                            item.active ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                        )}
                                    >
                                        <item.icon className={cn('h-4 w-4 shrink-0', item.active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600')} />
                                        {!compact && <span className="text-[13px] font-medium flex-1">{item.name}</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Social Media Link */}
                {!compact && (
                    <div className="pt-4 px-2">
                        <a 
                            href="https://www.instagram.com/makassar.creativehub" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex flex-col gap-3 p-4 rounded-2xl bg-teal-50 border border-teal-100 group hover:bg-teal-600 transition-all duration-500"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-teal-600 shadow-sm group-hover:bg-white/20 group-hover:text-white transition-colors">
                                    <Camera className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-teal-900 group-hover:text-white leading-tight">Instagram</p>
                                    <p className="text-[9px] font-bold text-teal-400 group-hover:text-teal-200 mt-0.5">@makassar.creativehub</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 text-teal-600 group-hover:text-white transition-colors">
                                <span className="text-[10px] font-black uppercase tracking-widest">Visit Profile</span>
                                <ExternalLink className="h-3 w-3" />
                            </div>
                        </a>
                    </div>
                )}
            </nav>

            {/* User Account Section */}
            <div className="border-t border-gray-100 mt-auto shrink-0 bg-gray-50/50">
                <div className={cn('p-4 space-y-4', compact && 'p-2')}>
                    {!compact && (
                        <div className="flex items-center gap-3 px-2 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg shadow-gray-200">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[13px] font-black text-gray-900 truncate leading-tight">{user.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 truncate mt-0.5">{user.email}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <Link
                            href={route('profile.edit')}
                            title={compact ? "Profil Saya" : undefined}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                compact ? "justify-center" : "",
                                route().current('profile.edit') ? "bg-white border border-gray-200 text-gray-900 shadow-sm" : "text-gray-500 hover:bg-white hover:text-gray-900"
                            )}
                        >
                            <User className={cn("h-4 w-4 shrink-0", route().current('profile.edit') ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-600")} />
                            {!compact && <span className="text-[12px] font-black">Profil Saya</span>}
                        </Link>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            title={compact ? "Keluar" : undefined}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group w-full text-left",
                                compact ? "justify-center" : "",
                                "text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                            )}
                        >
                            <LogOut className="h-4 w-4 shrink-0" />
                            {!compact && <span className="text-[12px] font-black">Keluar</span>}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-white">

            {/* ── Mobile Overlay ── */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* ── Mobile Sidebar Drawer ── */}
            <aside className={cn(
                'fixed inset-y-0 left-0 z-50 flex flex-col w-[260px] bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:hidden',
                isMobileOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                {/* Close button */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="absolute top-4 right-4 h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
                <SidebarContent compact={false} />
            </aside>

            {/* ── Desktop Sidebar ── */}
            <aside className={cn(
                'hidden lg:fixed lg:flex lg:inset-y-0 lg:left-0 lg:z-50 lg:flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
                isSidebarOpen ? 'w-[240px]' : 'w-[70px]'
            )}>
                <SidebarContent compact={!isSidebarOpen} />
            </aside>

            {/* ── Main Content ── */}
            <main className={cn(
                'flex-1 flex flex-col min-h-screen bg-white transition-all duration-300 ease-in-out',
                'pl-0',
                isSidebarOpen ? 'lg:pl-[240px]' : 'lg:pl-[70px]'
            )}>
                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-white border-b border-gray-200 h-[64px] flex items-center justify-between px-4 md:px-6 shrink-0">
                    <div className="flex items-center gap-3 flex-1">
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="lg:hidden h-9 w-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        {/* Desktop expand sidebar */}
                        {!isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="hidden lg:flex h-8 w-8 rounded-lg items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <PanelLeftOpen className="h-4 w-4" />
                            </button>
                        )}

                        {/* Search — hidden on small mobile, shown md+ */}
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                const search = (e.target as any).search.value;
                                router.get(window.location.pathname, { search }, { preserveState: true });
                            }}
                            className="relative max-w-xs w-full hidden sm:flex items-center"
                        >
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                            <input
                                type="text"
                                name="search"
                                defaultValue={new URLSearchParams(window.location.search).get('search') || ''}
                                placeholder="Cari..."
                                className="h-9 w-full pl-9 pr-4 bg-gray-50 border-2 border-gray-200 rounded-lg text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-teal-500 transition-all"
                            />
                        </form>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-1.5">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="relative h-9 w-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Bell className="h-4 w-4" />
                                    {auth.notifications?.length > 0 && (
                                        <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                                    )}
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="right" contentClasses="py-0 bg-white border-2 border-gray-200 shadow-2xl rounded-2xl w-80 mt-1 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Notifikasi</p>
                                    {auth.notifications?.length > 0 && (
                                        <button 
                                            onClick={() => router.post(route('notifications.mark-as-read'))}
                                            className="text-[10px] font-bold text-teal-600 hover:text-teal-700"
                                        >
                                            Tandai semua dibaca
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[320px] overflow-y-auto">
                                    {auth.notifications?.length > 0 ? (
                                        auth.notifications.map((n: any) => (
                                            <button 
                                                key={n.id} 
                                                onClick={() => {
                                                    router.post(route('notifications.mark-as-read'), { id: n.id }, {
                                                        onSuccess: () => router.visit(n.data.url)
                                                    });
                                                }}
                                                className="w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors group/item relative"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={cn(
                                                        "h-2 w-2 rounded-full mt-1.5 shrink-0",
                                                        n.data.type === 'success' ? 'bg-emerald-500' : 
                                                        n.data.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                                                    )} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                            <p className="text-[12px] font-black text-slate-900 truncate">{n.data.title}</p>
                                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tight shrink-0">Baru</span>
                                                        </div>
                                                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2">{n.data.message}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                                            <Bell className="h-8 w-8 text-slate-200 mb-2" />
                                            <p className="text-[12px] font-bold text-slate-400">Tidak ada notifikasi baru</p>
                                        </div>
                                    )}
                                </div>
                            </Dropdown.Content>
                        </Dropdown>
                        
                        <div className="h-6 w-px bg-gray-100 mx-1 hidden sm:block" />
                        
                        <div className="hidden sm:flex items-center gap-3 pl-2">
                            <div className="text-right">
                                <p className="text-[12px] font-black text-gray-900 leading-none">{user.name.split(' ')[0]}</p>
                                <p className="text-[9px] font-bold text-teal-600 uppercase tracking-widest mt-1">{isAdmin ? 'Administrator' : 'User'}</p>
                            </div>
                            <div className="h-9 w-9 rounded-xl bg-gray-900 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-gray-200">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
                    {header && <div className="mb-6 md:mb-8">{header}</div>}
                    {children}
                </div>
            </main>

            {/* ── Toast ── */}
            {showToast && (
                <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border bg-white text-sm max-w-[calc(100vw-2rem)]',
                        toastMessage.type === 'success' ? 'border-green-100 text-green-800' : 'border-red-100 text-red-700'
                    )}>
                        <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', toastMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500')}>
                            {toastMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-[13px] leading-none">{toastMessage.type === 'success' ? 'Berhasil!' : 'Terjadi Kesalahan'}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[200px] sm:max-w-[240px]">{toastMessage.text}</p>
                        </div>
                        <button onClick={() => setShowToast(false)} className="ml-1 h-6 w-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors shrink-0">
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
