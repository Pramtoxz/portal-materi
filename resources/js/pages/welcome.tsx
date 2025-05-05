import { Head, Link } from '@inertiajs/react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Sparkles, Moon, Sun, LogOut, Filter, SortAsc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LogoJayanusa from '@/assets/jayanusa.webp';
import LogoKampusMerdeka from '@/assets/kampusmerdeka.webp';
import LogoTutwuri from '@/assets/tutwuri.webp';
import Hymne from '@/assets/hymne.wav';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';

interface MatakuliahProps {
    kodematakuliah: string;
    namamatakuliah: string;
    semester: string;
    sks: number;
    materi: {
        id: number;
        namamateri: string;
        filemateri?: string;
        linkmateri?: string;
    }[];
}

interface UserProps {
    id: number;
    name: string;
    email: string;
    avatar?: string; // URL avatar jika ada
    username?: string; // NIM mahasiswa jika ada
}

export default function Welcome({ matakuliah, auth }: { matakuliah: MatakuliahProps[], auth: { user: UserProps } }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [sortMode, setSortMode] = useState<'name' | 'code' | 'semester'>('name');
    const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e: React.FormEvent) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsDialogOpen(false);
            },
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

    const filteredMatakuliah = useMemo(() => {
        const filtered = matakuliah.filter((mk) => {
            const matchSearch = 
                mk.namamatakuliah.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mk.kodematakuliah.toLowerCase().includes(searchQuery.toLowerCase());
            const matchSemester = selectedSemester === 'all' || mk.semester === selectedSemester;
            return matchSearch && matchSemester;
        });

        return filtered.sort((a, b) => {
            switch (sortMode) {
                case 'name':
                    return a.namamatakuliah.localeCompare(b.namamatakuliah);
                case 'code':
                    return a.kodematakuliah.localeCompare(b.kodematakuliah);
                case 'semester':
                    return a.semester.localeCompare(b.semester);
                default:
                    return 0;
            }
        });
    }, [matakuliah, searchQuery, selectedSemester, sortMode]);

    const handleMatakuliahClick = (kode: string) => {
        window.location.href = route('mahasiswa.materi.list', kode);
    };

    // Fungsi untuk mendapatkan inisial dari nama user untuk avatar default
    const getUserInitials = () => {
        if (!auth.user?.name) return "U";
        return auth.user.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Fungsi untuk mendapatkan warna background acak untuk avatar default
    const getAvatarBgColor = () => {
        const colors = [
            "bg-blue-500", "bg-purple-500", "bg-pink-500", 
            "bg-indigo-500", "bg-green-500", "bg-yellow-500"
        ];
        // Gunakan ID user untuk mendapatkan warna yang konsisten
        const colorIndex = auth.user?.id % colors.length || 0;
        return colors[colorIndex];
    };

    // Fungsi untuk menerapkan tema berdasarkan preferensi
    const applyTheme = (mode: 'light' | 'dark' | 'system') => {
        let themeToApply: 'light' | 'dark';
        
        if (mode === 'system') {
            // Gunakan preferensi sistem
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            themeToApply = systemPrefersDark ? 'dark' : 'light';
        } else {
            themeToApply = mode;
        }
        
        // Terapkan tema
        document.documentElement.classList.toggle('dark', themeToApply === 'dark');
        
        // Simpan preferensi ke localStorage
        localStorage.setItem('themeMode', mode);
    };
    
    // Deteksi preferensi tema saat komponen dimuat
    useEffect(() => {
        // Cek apakah ada preferensi tema yang tersimpan
        const savedThemeMode = localStorage.getItem('themeMode') as 'light' | 'dark' | 'system' || 'system';
        
        // Atur state tema
        setThemeMode(savedThemeMode);
        
        // Terapkan tema
        applyTheme(savedThemeMode);
        
        // Tambahkan listener untuk perubahan preferensi sistem
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (savedThemeMode === 'system') {
                applyTheme('system');
            }
        };
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Efek untuk memutar musik hymne otomatis
    useEffect(() => {
        // Buat elemen audio
        audioRef.current = new Audio(Hymne);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
        
        // Putar musik
        const playAudio = () => {
            if (audioRef.current) {
                audioRef.current.play().catch(error => {
                    console.error('Gagal memutar audio:', error);
                });
            }
        };
        
        // Putar musik setelah interaksi user pertama kali
        const handleUserInteraction = () => {
            playAudio();
            // Hapus event listener setelah interaksi pertama
            document.removeEventListener('click', handleUserInteraction);
        };
        
        // Tambahkan event listener untuk mendeteksi interaksi user
        document.addEventListener('click', handleUserInteraction);
        
        // Cleanup function
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            document.removeEventListener('click', handleUserInteraction);
        };
    }, []);

    return (
        <>
            <Head title="Portal Materi" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#0f1117] dark:to-black transition-all duration-500">
                {/* Audio player (hidden) */}
                <audio ref={audioRef} src={Hymne} loop preload="auto" className="hidden" />
                
                {/* Navbar dengan Dialog Ganti Password - Tambah animasi hover */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-0 right-0 p-4 z-10"
                >
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button 
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-white/90 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 text-black transition-all duration-300"
                            >
                               
                                {auth.user?.avatar ? (
                                    <img 
                                        src={auth.user.avatar} 
                                        alt={auth.user.name} 
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${getAvatarBgColor()}`}>
                                        {getUserInitials()}
                                    </div>
                                )}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-blue-900 dark:text-white">Pengaturan Akun</DialogTitle>
                                <DialogDescription className="dark:text-[#dd00ff]/80">
                                    Kelola akun dan keamanan Anda
                                </DialogDescription>
                            </DialogHeader>
                            
                            {/* Informasi User */}
                            <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-[#1a1a1a] rounded-lg mb-4">
                                {auth.user?.avatar ? (
                                    <img 
                                        src={auth.user.avatar} 
                                        alt={auth.user.name} 
                                        className="h-16 w-16 rounded-full object-cover border-2 border-blue-300 dark:border-[#dd00ff]"
                                    />
                                ) : (
                                    <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-xl font-bold ${getAvatarBgColor()}`}>
                                        {getUserInitials()}
                                    </div>
                                )}
                                <div>
                                {auth.user?.username && (
                                        <p className="text-sm text-blue-600 dark:text-[#dd00ff]/80">Nomor BP : {auth.user.username}</p>
                                    )}
                                    <h3 className="text-lg font-medium text-blue-900 dark:text-white">{auth.user?.name}</h3>
                                    
                                    <p className="text-sm text-blue-600 dark:text-[#dd00ff]/80">{auth.user?.email}</p>
                                  
                                </div>
                            </div>
                            
                            <form onSubmit={updatePassword} className="space-y-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password" className="text-blue-900 dark:text-white">Kata Sandi Saat Ini</Label>
                                    <Input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        type="password"
                                        className="border-blue-200 dark:border-[#dd00ff]/30"
                                        autoComplete="current-password"
                                        placeholder="Kata sandi saat ini"
                                    />
                                    <InputError message={errors.current_password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-blue-900 dark:text-white">Kata Sandi Baru</Label>
                                    <Input
                                        id="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        type="password"
                                        className="border-blue-200 dark:border-[#dd00ff]/30"
                                        autoComplete="new-password"
                                        placeholder="Kata sandi baru"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation" className="text-blue-900 dark:text-white">Konfirmasi Kata Sandi</Label>
                                    <Input
                                        id="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        type="password"
                                        className="border-blue-200 dark:border-[#dd00ff]/30"
                                        autoComplete="new-password"
                                        placeholder="Konfirmasi kata sandi"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <DialogFooter className="mt-6 flex justify-between items-center">
                                    <div>
                                        {recentlySuccessful && (
                                            <p className="text-sm text-green-600 dark:text-green-400">Tersimpan</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => setIsDialogOpen(false)}
                                            className="border-blue-200 dark:border-[#dd00ff]/30"
                                        >
                                            Batal
                                        </Button>
                                        <Button 
                                            type="submit" 
                                            disabled={processing}
                                            className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-[#b800e6] dark:via-[#dd00ff] dark:to-[#ff00ff]"
                                        >
                                            Simpan
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </form>
                            
                            <div className="border-t border-blue-200 dark:border-[#dd00ff]/30 pt-4 mt-2">
                                <Link 
                                    href={route('logout')} 
                                    method="post" 
                                    as="button"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-300"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </Link>
                            </div>
                        </DialogContent>
                    </Dialog>
                </motion.div>

                {/* Hero Section dengan animasi yang lebih smooth */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 dark:bg-gradient-to-r dark:from-[#b800e6] dark:via-[#dd00ff] dark:to-[#ff00ff] py-16 relative overflow-hidden transition-all duration-500">
                    <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:20px_20px] animate-[pulse_4s_ease-in-out_infinite]" />
                    
                    {/* Logo Tutwuri dan Kampus Merdeka di pojok kiri atas */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-4 left-4 flex items-center z-10"
                    >
                        <motion.div 
                            className="bg-white p-2 rounded-lg shadow-md flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                        >
                            <img 
                                src={LogoTutwuri} 
                                alt="Logo Tutwuri" 
                                className="h-6 w-auto sm:h-8"
                            />
                            <img 
                                src={LogoKampusMerdeka} 
                                alt="Logo Kampus Merdeka" 
                                className="h-6 w-auto sm:h-8"
                            />
                        </motion.div>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
                    >
                        <div className="flex justify-center items-center mb-8">
                            <motion.div
                                className="relative flex flex-col items-center justify-center"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="absolute w-32 h-32 bg-white rounded-full shadow-md"></div>
                                <motion.img 
                                    src={LogoJayanusa}
                                    alt="Logo Jayanusa" 
                                    className="h-24 mx-auto relative z-10"
                                />
                            </motion.div>
                        </div>
                        
                        <div className="text-center mb-8">
                            <motion.h1 
                                className="text-4xl font-bold text-white mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                Portal Materi Digital
                            </motion.h1>
                            <motion.p 
                                className="text-blue-100 dark:text-purple-100 text-xl max-w-2xl mx-auto mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                STMIK-AMIK JAYANUSA
                            </motion.p>
                        </div>

                        {/* Theme Switcher dengan tab System */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <Tabs defaultValue={themeMode} className="w-full" onValueChange={(value) => {
                                const newMode = value as 'light' | 'dark' | 'system';
                                setThemeMode(newMode);
                                applyTheme(newMode);
                            }}>
                                <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white/20 backdrop-blur-sm">
                                    <TabsTrigger 
                                        value="light"
                                        className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:text-[#dd00ff] transition-all duration-300"
                                    >
                                        <Sun className="h-4 w-4 mr-2" />
                                        Terang
                                    </TabsTrigger>
                                    <TabsTrigger 
                                        value="system"
                                        className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:text-[#dd00ff] transition-all duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                            <line x1="8" y1="21" x2="16" y2="21"></line>
                                            <line x1="12" y1="17" x2="12" y2="21"></line>
                                        </svg>
                                        Sistem
                                    </TabsTrigger>
                                    <TabsTrigger 
                                        value="dark"
                                        className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:text-[#dd00ff] transition-all duration-300"
                                    >
                                        <Moon className="h-4 w-4 mr-2" />
                                        Gelap
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </motion.div>
                    </motion.div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Search Box dengan animasi dan filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-white dark:bg-[#1a1a1a]/80 dark:backdrop-blur-sm p-6 rounded-2xl shadow-xl mb-12 border border-blue-100 dark:border-[#dd00ff]/20 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
                    >
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 dark:text-[#dd00ff]" />
                                <Input
                                    type="search"
                                    placeholder="Cari matakuliah..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 h-12 text-lg border-blue-200 dark:border-[#dd00ff]/30 focus:border-blue-500 dark:focus:border-[#dd00ff] transition-all duration-300"
                                />
                            </div>
                            
                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="border-blue-200 dark:border-[#dd00ff]/30 hover:bg-blue-50 dark:hover:bg-[#dd00ff]/10">
                                            <Filter className="h-4 w-4 text-blue-500 dark:text-[#dd00ff]" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Filter Semester</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setSelectedSemester('all')}>
                                            Semua
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedSemester('Ganjil')}>
                                            Ganjil
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSelectedSemester('Genap')}>
                                            Genap
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="border-blue-200 dark:border-[#dd00ff]/30 hover:bg-blue-50 dark:hover:bg-[#dd00ff]/10">
                                            <SortAsc className="h-4 w-4 text-blue-500 dark:text-[#dd00ff]" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>Urutkan</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setSortMode('name')}>
                                            Nama Matakuliah
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSortMode('code')}>
                                            Kode Matakuliah
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSortMode('semester')}>
                                            Semester
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </motion.div>

                    {/* Grid Matakuliah dengan AnimatePresence */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence>
                            {filteredMatakuliah.map((mk, index) => (
                                <motion.div
                                    key={mk.kodematakuliah}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <Card className="group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50 dark:from-[#1a1a1a]/80 dark:via-[#2a1a2a] dark:to-[#1a1a1a] dark:backdrop-blur-sm" onClick={() => handleMatakuliahClick(mk.kodematakuliah)}>
                                        <CardHeader className="space-y-2">
                                            <div className="flex justify-between items-start">
                                                <Badge variant="secondary" className="bg-blue-100 dark:bg-[#dd00ff]/20 text-blue-700 dark:text-[#dd00ff]">
                                                    {mk.kodematakuliah}
                                                </Badge>
                                                <Badge className="bg-blue-500 dark:bg-gradient-to-r dark:from-[#b800e6] dark:to-[#dd00ff]">
                                                    {mk.sks} SKS
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-2xl font-bold text-blue-900 dark:text-white">
                                                {mk.namamatakuliah}
                                            </CardTitle>
                                            <CardDescription className="dark:text-[#dd00ff]/80">
                                                Semester {mk.semester}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Link 
                                                href={route('mahasiswa.materi.list', mk.kodematakuliah)} 
                                                className="block w-full"
                                            >
                                                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-[#b800e6] dark:via-[#dd00ff] dark:to-[#ff00ff] hover:from-blue-700 hover:to-blue-600 dark:hover:from-[#a500cc] dark:hover:via-[#c700e6] dark:hover:to-[#e600e6] text-white shadow-lg shadow-blue-200 dark:shadow-[#dd00ff]/20">
                                                    <Sparkles className="h-5 w-5 mr-2" />
                                                    Lihat Materi
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty State dengan animasi */}
                    {filteredMatakuliah.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-16 bg-white dark:bg-[#1a1a1a]/80 rounded-2xl shadow-xl border border-blue-100 dark:border-[#dd00ff]/20"
                        >
                            <Search className="h-20 w-20 text-blue-400 dark:text-[#dd00ff] mx-auto mb-6" />
                            <p className="text-2xl font-semibold text-blue-900 dark:text-white mb-2">
                                {searchQuery 
                                    ? "Tidak ada matakuliah yang sesuai dengan pencarian Anda"
                                    : "Belum ada matakuliah yang tersedia"
                                }
                            </p>
                            <p className="text-blue-600 dark:text-[#dd00ff]/80">
                                Silakan coba dengan kata kunci lain
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}