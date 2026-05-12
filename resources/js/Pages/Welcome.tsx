import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    Calendar, 
    ArrowRight,
    MapPin,
    Camera,
    Users,
    Coffee,
    Zap,
    Layout
} from "lucide-react";
import ApplicationLogo from '@/components/ApplicationLogo';
import { cn } from '@/lib/utils';

export default function Welcome({
    auth,
    rooms = []
}: PageProps & { rooms: any[] }) {
    return (
        <>
            <Head title="Makassar Creative Hub | Ruang Kolaborasi Kreator" />
            <div className="min-h-screen bg-white font-sans selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden text-slate-900">
                
                {/* ── MINIMAL NAVBAR ── */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        <ApplicationLogo className="h-9 w-auto" />

                        <div className="hidden md:flex items-center gap-10">
                            <a href="#about" className="text-[13px] font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase tracking-widest">Tentang</a>
                            <a href="#rooms" className="text-[13px] font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase tracking-widest">Ruangan</a>
                            <a href="#community" className="text-[13px] font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase tracking-widest">Komunitas</a>
                        </div>

                        <div className="flex items-center gap-6">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-6 py-2.5 bg-slate-900 text-white text-[12px] font-black rounded-full hover:bg-teal-600 transition-all flex items-center gap-2 uppercase tracking-widest"
                                >
                                    Dashboard <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-[12px] font-black text-slate-900 uppercase tracking-widest hover:text-teal-600 transition-colors"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-8 py-3 bg-teal-600 text-white text-[12px] font-black rounded-full hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 uppercase tracking-widest"
                                    >
                                        Gabung
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* ── EDITORIAL HERO ── */}
                <section className="relative pt-32 pb-20 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-5 z-10">
                            <p className="text-teal-600 font-black text-[12px] uppercase tracking-[0.4em] mb-6">MCH Digital Portal</p>
                            <h1 className="text-[56px] md:text-[84px] font-black leading-[0.9] tracking-tighter mb-10">
                                Ruang <br /> 
                                <span className="text-slate-300">Kolaborasi</span> <br /> 
                                Kreator Makassar.
                            </h1>
                            <p className="text-[18px] font-medium text-slate-500 leading-relaxed mb-12 max-w-md">
                                Bukan sekadar aplikasi booking, ini adalah pintu masuk menuju ekosistem kreatif terbesar di Makassar. Temukan ruang, teman diskusi, dan peluang baru.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link href={route('register')} className="px-10 py-5 bg-teal-600 text-white font-black rounded-2xl hover:bg-teal-700 transition-all text-lg tracking-tight">
                                    Mulai Berkarya
                                </Link>
                                <a href="#rooms" className="px-10 py-5 bg-slate-50 text-slate-900 font-black rounded-2xl border border-slate-100 hover:bg-white hover:border-teal-200 transition-all text-lg">
                                    Cek Ruangan
                                </a>
                            </div>
                        </div>
                        <div className="lg:col-span-7 relative">
                            <div className="aspect-[4/5] md:aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl relative group">
                                <img 
                                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
                                    alt="Interior MCH" 
                                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                <div className="absolute bottom-10 left-10 text-white">
                                    <p className="text-[12px] font-black uppercase tracking-widest opacity-80 mb-2">Makassar Creative Hub</p>
                                    <p className="text-2xl font-black tracking-tight">Vibe Kerja yang Berbeda.</p>
                                </div>
                            </div>
                            {/* Abstract Floating Element */}
                            <div className="absolute -bottom-10 -left-10 bg-yellow-400 p-8 rounded-[2rem] shadow-2xl hidden md:block animate-bounce-slow">
                                <Coffee className="h-8 w-8 text-slate-900 mb-4" />
                                <p className="text-slate-900 font-black text-xl leading-tight">Mulai dengan <br /> Segelas Kopi.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── STATS / TRUST ── */}
                <section className="py-20 border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                            <div>
                                <p className="text-[42px] font-black text-slate-900 tracking-tighter">500+</p>
                                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Kreator Aktif</p>
                            </div>
                            <div>
                                <p className="text-[42px] font-black text-teal-600 tracking-tighter">{rooms.length}</p>
                                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Ruang Studio</p>
                            </div>
                            <div>
                                <p className="text-[42px] font-black text-slate-900 tracking-tighter">24/7</p>
                                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Akses Komunitas</p>
                            </div>
                            <div>
                                <p className="text-[42px] font-black text-teal-600 tracking-tighter">100%</p>
                                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Proses Digital</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── ROOMS EXPLORATION ── */}
                <section id="rooms" className="py-32 bg-slate-50/50 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 mb-20">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <p className="text-teal-600 font-black text-[12px] uppercase tracking-[0.4em] mb-4">Space & Studio</p>
                                <h2 className="text-[42px] md:text-[56px] font-black leading-tight tracking-tighter text-slate-900">
                                    Pilih Ruang yang <br /> Sesuai Kebutuhan.
                                </h2>
                            </div>
                            <div className="flex items-center gap-4 pb-2">
                                <div className="h-1 w-24 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-teal-600 w-1/3" />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scroll ke samping</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="flex overflow-x-auto gap-10 px-6 md:px-[calc((100vw-1280px)/2+24px)] pb-10 no-scrollbar snap-x snap-mandatory">
                            {rooms.length > 0 ? rooms.map((room) => (
                                <div key={room.id} className="min-w-[320px] md:min-w-[440px] snap-start">
                                    <div className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-teal-900/5 transition-all duration-500 h-full flex flex-col">
                                        <div className="aspect-[16/10] relative overflow-hidden shrink-0">
                                            {room.image_path ? (
                                                <img 
                                                    src={`/storage/${room.image_path}`} 
                                                    alt={room.name} 
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                                    <Layout className="h-12 w-12 text-slate-300" />
                                                </div>
                                            )}
                                            <div className="absolute top-6 left-6">
                                                <span className={cn(
                                                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm",
                                                    room.status === 'tersedia' ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
                                                )}>
                                                    {room.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-10 flex-1 flex flex-col">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{room.name}</h3>
                                                <div className="flex items-center gap-1.5 text-slate-400">
                                                    <Users className="h-4 w-4" />
                                                    <span className="text-sm font-bold">{room.capacity}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {room.facilities && JSON.parse(typeof room.facilities === 'string' ? room.facilities : JSON.stringify(room.facilities)).map((facility: string, idx: number) => (
                                                    <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-lg border border-slate-100 uppercase tracking-tighter">
                                                        {facility}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="mt-auto">
                                                <Link 
                                                    href={route('login')}
                                                    className="w-full py-4 bg-slate-900 text-white text-[12px] font-black rounded-xl hover:bg-teal-600 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                                                >
                                                    Booking Sekarang <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="w-full py-20 text-center bg-white rounded-[3rem] border border-slate-100 mx-6 shrink-0">
                                    <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                                        <Layout className="h-10 w-10" />
                                    </div>
                                    <p className="text-slate-400 font-bold">Belum ada ruangan yang tersedia untuk saat ini.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── STORY SECTION 01 ── */}
                <section id="about" className="py-32 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-xl">
                                <img 
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                                    alt="Kolaborasi" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="text-[42px] font-black leading-tight tracking-tighter mb-8">
                                Dari Ide Kecil <br /> Jadi Karya Besar.
                            </h2>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
                                Makassar Creative Hub dibangun untuk menjawab keresahan para kreator akan ruang kerja yang representatif. Melalui portal SIM-MCH, kami mempermudah akses Anda ke seluruh fasilitas yang ada.
                            </p>
                            <ul className="space-y-6">
                                <li className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 shrink-0">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-slate-700">Booking cepat dalam hitungan detik.</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 shrink-0">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-slate-700">Terhubung dengan ribuan kreator lokal.</span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shrink-0">
                                        <Layout className="h-5 w-5" />
                                    </div>
                                    <span className="font-bold text-slate-700">Manajemen jadwal yang transparan.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ── FOOTER ── */}
                <footer className="bg-slate-50 py-24 px-6 border-t border-slate-100">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
                            <div className="max-w-xs">
                                <ApplicationLogo className="h-10 w-auto mb-8" />
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    Wadah berekspresi, berinovasi, dan berkolaborasi bagi seluruh anak muda kreatif di Kota Makassar.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-20">
                                <div>
                                    <h4 className="font-black text-[12px] uppercase tracking-widest text-slate-400 mb-8">Eksplor</h4>
                                    <ul className="space-y-4 font-bold text-slate-600">
                                        <li><a href="#" className="hover:text-teal-600 transition-colors">Daftar Ruangan</a></li>
                                        <li><a href="#" className="hover:text-teal-600 transition-colors">Jadwal Kegiatan</a></li>
                                        <li><a href="#" className="hover:text-teal-600 transition-colors">FAQ</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-black text-[12px] uppercase tracking-widest text-slate-400 mb-8">Sosial</h4>
                                    <ul className="space-y-4 font-bold text-slate-600">
                                        <li>
                                            <a href="https://www.instagram.com/makassar.creativehub" target="_blank" className="flex items-center gap-2 hover:text-teal-600 transition-colors">
                                                <Camera className="h-4 w-4" /> Instagram
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="flex items-center gap-2 hover:text-teal-600 transition-colors">
                                                <MapPin className="h-4 w-4" /> Lokasi
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-slate-400 text-[13px] font-bold uppercase tracking-tight">
                                &copy; {new Date().getFullYear()} Makassar Creative Hub Digital.
                            </p>
                            <p className="text-slate-400 text-[13px] font-bold flex items-center gap-2 uppercase tracking-tight">
                                Made with Pride in <span className="text-teal-600 font-black">Makassar</span>
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes bounceSlow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .animate-bounce-slow {
                    animation: bounceSlow 4s ease-in-out infinite;
                }
            `}} />
        </>
    );
}
