import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import ApplicationLogo from '@/components/ApplicationLogo';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans overflow-hidden">
            
            {/* ── LEFT SIDE: BRANDING / DECORATION ── */}
            <div className="hidden lg:flex lg:w-1/2 bg-teal-600 relative items-center justify-center p-20 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
                    className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[0.5]"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600/90 via-teal-600/80 to-yellow-600/70"></div>
                
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full -mr-64 -mt-64 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white opacity-5 rounded-full -ml-40 -mb-40"></div>
                
                <div className="relative z-10 text-center max-w-lg">
                    <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-xl px-8 py-4 rounded-[2rem] border border-white/20 mb-12 mx-auto">
                        <div className="bg-white p-1.5 rounded-lg shadow-xl">
                            <ApplicationLogo className="h-8 w-auto" />
                        </div>
                    </div>
                    <h2 className="text-[48px] font-black text-white leading-[1] mb-8 tracking-tighter">
                        Inovasi Kreatif <br /> Masa Depan Makassar.
                    </h2>
                    <p className="text-teal-50 text-xl font-medium leading-relaxed opacity-90">
                        Kelola jadwal, booking ruangan, dan bangun ekosistem kreatif Anda bersama Makassar Creative Hub.
                    </p>
                </div>

                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center text-teal-100 text-[11px] font-black tracking-[0.3em] uppercase opacity-60">
                    <span>Makassar Creative Hub</span>
                    <span>Official Portal</span>
                </div>
            </div>

            {/* ── RIGHT SIDE: FORM CONTENT ── */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-20 relative bg-white lg:bg-slate-50">
                <div className="absolute top-10 left-10 lg:hidden flex items-center gap-3">
                    <ApplicationLogo className="h-8 w-auto" />
                </div>

                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="bg-white rounded-[2.5rem] border-[1.5px] border-slate-200 p-10 md:p-14 shadow-2xl shadow-slate-200/40">
                        {children}
                    </div>
                    
                    <p className="text-center mt-10 text-slate-400 text-[13px] font-bold tracking-tight uppercase">
                        &copy; {new Date().getFullYear()} SIM-MCH Makassar.
                    </p>
                </div>
            </div>
        </div>
    );
}
