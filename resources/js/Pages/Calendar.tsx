import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
    Clock, Building2, User, Info, Filter, ArrowRight
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { 
    format, addMonths, subMonths, startOfMonth, endOfMonth, 
    startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, 
    parseISO, isWithinInterval 
} from 'date-fns';
import { id } from 'date-fns/locale';

interface Event {
    id: number;
    title: string;
    start: string;
    end: string;
    status: 'pending' | 'approved';
    purpose: string;
    user_id: number;
}

interface Room {
    id: number;
    name: string;
}

interface Props {
    events: Event[];
    rooms: Room[];
}

export default function Calendar({ events, rooms }: Props) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const isAdmin = user.roles?.some((r: any) => r.name === 'admin') || user.email === 'admin@mch.com';

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filterRoom, setFilterRoom] = useState<number | 'all'>('all');

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const calendarDays = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentDate));
        const end = endOfWeek(endOfMonth(currentDate));
        const days = [];
        let day = start;

        while (day <= end) {
            days.push(day);
            day = addDays(day, 1);
        }
        return days;
    }, [currentDate]);

    const filteredEvents = useMemo(() => {
        return events.filter(e => filterRoom === 'all' || e.title.includes(rooms.find(r => r.id === filterRoom)?.name || ''));
    }, [events, filterRoom]);

    const getEventsForDay = (date: Date) => {
        return filteredEvents.filter(e => isSameDay(parseISO(e.start), date));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kalender Jadwal" />

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 animate-row">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Kalender Jadwal
                        <CalendarIcon className="h-6 w-6 text-indigo-500" />
                    </h1>
                    <p className="text-[13px] text-slate-400 mt-1 font-medium italic">Pantau ketersediaan dan jadwal pemakaian ruangan secara real-time.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border-[1.5px] border-slate-200 shadow-sm">
                    <button onClick={prevMonth} className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 transition-all active:scale-90"><ChevronLeft className="h-5 w-5" /></button>
                    <div className="px-4 text-[13px] font-black text-slate-900 min-w-[140px] text-center uppercase tracking-widest">{format(currentDate, 'MMMM yyyy', { locale: id })}</div>
                    <button onClick={nextMonth} className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400 transition-all active:scale-90"><ChevronRight className="h-5 w-5" /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-20">
                
                {/* ── Sidebar Filters & Selected Day Info ── */}
                <div className="lg:col-span-1 space-y-6 animate-row" style={{ animationDelay: '100ms' }}>
                    
                    {/* Room Filter */}
                    <div className="bg-white rounded-[2rem] border-[1.5px] border-slate-200 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className="h-4 w-4 text-indigo-500" />
                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Filter Ruangan</p>
                        </div>
                        <select 
                            value={filterRoom} 
                            onChange={(e) => setFilterRoom(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                            className="w-full h-11 px-4 rounded-xl border-[1.5px] border-slate-100 bg-slate-50 text-[13px] font-bold text-slate-700 focus:outline-none focus:border-indigo-400 transition-all"
                        >
                            <option value="all">Semua Ruangan</option>
                            {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>

                    {/* Selected Date Details */}
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-12 translate-x-12 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <Clock className="h-6 w-6 text-indigo-400" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{format(selectedDate, 'EEEE', { locale: id })}</p>
                                    <p className="text-xl font-black">{format(selectedDate, 'dd MMMM', { locale: id })}</p>
                                </div>
                            </div>
                            
                            <p className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-4">Agenda Hari Ini</p>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {getEventsForDay(selectedDate).length > 0 ? (
                                    getEventsForDay(selectedDate).map((e) => {
                                        const canAccess = isAdmin || e.user_id === user.id;
                                        return canAccess ? (
                                            <Link 
                                                key={e.id} 
                                                href={route('bookings.show', e.id)}
                                                className="block p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/15 hover:border-indigo-500/50 transition-all group/item relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                    <ArrowRight className="h-4 w-4 text-indigo-400" />
                                                </div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={cn('text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter', e.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400')}>
                                                        {e.status}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-white/40">{format(parseISO(e.start), 'HH:mm')}</span>
                                                </div>
                                                <p className="text-[13px] font-black text-white leading-tight mb-1 group-hover/item:text-indigo-400 transition-colors">{e.title.split(' (')[0]}</p>
                                                <p className="text-[11px] font-medium text-white/40 truncate mb-3">{e.purpose}</p>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest pt-3 border-t border-white/5">
                                                    Lihat Detail
                                                    <ArrowRight className="h-3 w-3" />
                                                </div>
                                            </Link>
                                        ) : (
                                            <div 
                                                key={e.id} 
                                                className="block p-4 rounded-2xl bg-white/5 border border-white/5 opacity-50 cursor-not-allowed"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter bg-slate-500/20 text-slate-400">
                                                        Terisi
                                                    </span>
                                                    <span className="text-[10px] font-bold text-white/40">{format(parseISO(e.start), 'HH:mm')}</span>
                                                </div>
                                                <p className="text-[13px] font-black text-white/60 leading-tight mb-1 italic">Private Event</p>
                                                <p className="text-[11px] font-medium text-white/20 truncate">Jadwal telah terisi</p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-10 text-center opacity-30">
                                        <Info className="h-8 w-8 mx-auto mb-2" />
                                        <p className="text-[11px] font-bold">Tidak ada jadwal</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Main Calendar Grid ── */}
                <div className="lg:col-span-3 animate-row" style={{ animationDelay: '200ms' }}>
                    <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 shadow-sm overflow-hidden">
                        {/* Days of Week */}
                        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
                            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                                <div key={d} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 auto-rows-fr">
                            {calendarDays.map((day, idx) => {
                                const isSelected = isSameDay(day, selectedDate);
                                const isToday = isSameDay(day, new Date());
                                const isCurrentMonth = isSameMonth(day, currentDate);
                                const dayEvents = getEventsForDay(day);

                                return (
                                    <div 
                                        key={idx}
                                        onClick={() => setSelectedDate(day)}
                                        className={cn(
                                            'min-h-[120px] p-3 border-r border-b border-slate-100 transition-all cursor-pointer relative group',
                                            !isCurrentMonth ? 'bg-slate-50/30' : 'bg-white hover:bg-indigo-50/30',
                                            isSelected && 'bg-indigo-50/50 z-10 shadow-[inset_0_0_0_2px_rgba(99,102,241,0.5)]'
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={cn(
                                                'inline-flex h-7 w-7 items-center justify-center rounded-lg text-[13px] font-black transition-all',
                                                isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 
                                                isCurrentMonth ? 'text-slate-900' : 'text-slate-300'
                                            )}>
                                                {format(day, 'd')}
                                            </span>
                                            {dayEvents.length > 0 && (
                                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">{dayEvents.length}</span>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-1.5 max-h-[70px] overflow-hidden">
                                            {dayEvents.slice(0, 2).map((e) => {
                                                const canAccess = isAdmin || e.user_id === user.id;
                                                
                                                return canAccess ? (
                                                    <Link 
                                                        key={e.id} 
                                                        href={route('bookings.show', e.id)}
                                                        className={cn('block px-2 py-1 rounded-md text-[9px] font-black truncate border transition-all hover:scale-105 active:scale-95', e.status === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100')}
                                                    >
                                                        {e.title.split(' (')[0]}
                                                    </Link>
                                                ) : (
                                                    <div 
                                                        key={e.id} 
                                                        className="px-2 py-1 rounded-md text-[9px] font-black truncate border bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                                                        title="Jadwal Terisi"
                                                    >
                                                        {e.title.split(' (')[0]}
                                                    </div>
                                                );
                                            })}
                                            {dayEvents.length > 2 && (
                                                <p className="text-[9px] font-bold text-slate-400 pl-1">+{dayEvents.length - 2} lainnya...</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-6 mt-6 px-4">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-emerald-500" />
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Disetujui</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-amber-500" />
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending</span>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <Info className="h-4 w-4 text-slate-300" />
                            <span className="text-[11px] font-medium text-slate-400 italic">Klik pada tanggal untuk melihat detail agenda harian.</span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
