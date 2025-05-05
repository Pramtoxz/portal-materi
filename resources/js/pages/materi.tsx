import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Code, Search, Video, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import LogoKampusMerdeka from '@/assets/kampusmerdeka.webp';
import LogoTutwuri from '@/assets/tutwuri.webp';
import LogoJayanusa from '@/assets/jayanusa.webp';

interface MateriProps {
    id: number;
    namamateri: string;
    filemateri?: string;
    linkmateri?: string;
    keterangan?: string;
}

interface MatakuliahProps {
    kodematakuliah: string;
    namamatakuliah: string;
    sks: number;
    semester: string;
}

interface Props {
    matakuliah: MatakuliahProps;
    materi: {
        data: MateriProps[];
        current_page: number;
        last_page: number;
        per_page: number;
    };
}

export default function Materi({ matakuliah, materi }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    
    // Tambahkan useEffect untuk menerapkan tema dari localStorage
    useEffect(() => {
        const savedThemeMode = localStorage.getItem('themeMode') as 'light' | 'dark' | 'system' || 'system';
        
        if (savedThemeMode === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('dark', systemPrefersDark);
        } else {
            document.documentElement.classList.toggle('dark', savedThemeMode === 'dark');
        }
        
        // Tambahkan listener untuk perubahan preferensi sistem
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (savedThemeMode === 'system') {
                document.documentElement.classList.toggle('dark', mediaQuery.matches);
            }
        };
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const filteredMateri = materi.data.filter((item) =>
        item.namamateri.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Head title={`Materi - ${matakuliah.namamatakuliah}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#0f1117] dark:to-black transition-all duration-500">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 dark:bg-gradient-to-r dark:from-[#b800e6] dark:via-[#dd00ff] dark:to-[#ff00ff] py-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px] animate-[pulse_4s_ease-in-out_infinite]" />
                    
                    {/* Logo Box di kanan atas */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-4 right-4 z-10"
                    >
                        <motion.div 
                            className="bg-white p-2 rounded-lg shadow-md flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                        >
                            <img 
                                src={LogoJayanusa} 
                                alt="Logo Jayanusa" 
                                className="h-6 w-auto sm:h-8"
                            />
                            <img 
                                src={LogoKampusMerdeka} 
                                alt="Logo Kampus Merdeka" 
                                className="h-6 w-auto sm:h-8"
                            />
                            <img 
                                src={LogoTutwuri} 
                                alt="Logo Tutwuri" 
                                className="h-6 w-auto sm:h-8"
                            />
                        </motion.div>
                    </motion.div>
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Link href={route('home')}>
                                <Button
                                    variant="ghost"
                                    className="text-white hover:bg-white/20"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Kembali ke Daftar Matakuliah
                                </Button>
                            </Link>

                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-white">{matakuliah.namamatakuliah}</h1>
                                <div className="flex items-center gap-3 text-blue-100 dark:text-purple-100">
                                    <Code className="h-4 w-4" />
                                    <span>{matakuliah.kodematakuliah}</span>
                                    <span>•</span>
                                    <span>Semester {matakuliah.semester}</span>
                                </div>
                            </div>

                            {/* Search Box */}
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                                <Input
                                    type="search"
                                    placeholder="Cari materi..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <AnimatePresence>
                        {filteredMateri.length > 0 ? (
                            <div className="space-y-6">
                                {filteredMateri.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="group cursor-pointer"
                                    >
                                        <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-blue-100/20 dark:border-purple-500/20">
                                            <div className="flex flex-col md:flex-row items-stretch">
                                                {/* Left Section - Materi Number */}
                                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-[#b800e6] dark:to-[#dd00ff] text-white p-6 md:w-48 flex flex-col justify-center items-center md:items-start">
                                                    <div className="text-sm uppercase tracking-wider opacity-75">Materi</div>
                                                    <div className="text-4xl font-bold mt-1">{index + 1}</div>
                                                </div>

                                                {/* Middle Section - Main Content */}
                                                <div className="flex-grow p-6">
                                                    <div className="flex flex-col h-full justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h3 className="text-xl font-semibold text-blue-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#dd00ff] transition-colors">
                                                                    {item.namamateri}
                                                                </h3>
                                                                {item.linkmateri ? (
                                                                    <Badge className="bg-green-500 dark:bg-green-600 text-white">
                                                                        <Video className="h-3 w-3 mr-1" />
                                                                        <span>Video</span>
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400">
                                                                        <FileX className="h-3 w-3 mr-1" />
                                                                        <span>Tidak ada video</span>
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {item.keterangan && (
                                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                                    {item.keterangan}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Section - Actions */}
                                                <div className="p-6 flex items-center justify-end border-l border-gray-100 dark:border-gray-700">
                                                    <Link 
                                                        href={route('mahasiswa.materi.play', item.id)}
                                                        className="flex items-center text-blue-600 dark:text-[#dd00ff] hover:text-blue-800 dark:hover:text-[#ff00ff] transition-colors group-hover:translate-x-1 transform transition-transform"
                                                    >
                                                        <span className="mr-2">Lihat Detail</span>
                                                        <ChevronRight className="h-5 w-5" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="bg-white dark:bg-gray-800/50 rounded-xl p-8 max-w-md mx-auto border border-blue-100/20 dark:border-purple-500/20">
                                    <Search className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        Materi tidak ditemukan
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Coba cari dengan kata kunci yang berbeda
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}
