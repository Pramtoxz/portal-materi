import { Head, Link } from '@inertiajs/react';
import { useState, useMemo, useRef } from 'react';
import { Search, Sparkles, Moon, Sun, LogOut, Filter, SortAsc, UserRoundCog } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LogoJayanusa from '@/assets/jayanusa.png';
import LogoKampusMerdeka from '@/assets/kampusmerdeka.png';
import LogoTutwuri from '@/assets/tutwuri.png';
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

export default function Welcome({ matakuliah }: { matakuliah: MatakuliahProps[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [sortMode, setSortMode] = useState<'name' | 'code' | 'semester'>('name');
    const [, setIsDark] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
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

    return (
        <>
            <Head title="Portal Materi" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#0f1117] dark:to-black transition-all duration-500">
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
                                <UserRoundCog className="h-4 w-4 text-black" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-blue-900 dark:text-white">Pengaturan Akun</DialogTitle>
                                <DialogDescription className="dark:text-[#dd00ff]/80">
                                    Kelola akun dan keamanan Anda
                                </DialogDescription>
                            </DialogHeader>
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

                        {/* Theme Switcher dengan animasi */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <Tabs defaultValue="light" className="w-full" onValueChange={(value) => {
                                setIsDark(value === 'dark');
                                document.documentElement.classList.toggle('dark', value === 'dark');
                            }}>
                                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white/20 backdrop-blur-sm">
                                    <TabsTrigger 
                                        value="light"
                                        className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:text-[#dd00ff] transition-all duration-300"
                                    >
                                        <Sun className="h-4 w-4 mr-2" />
                                        Mode Terang
                                    </TabsTrigger>
                                    <TabsTrigger 
                                        value="dark"
                                        className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-600 dark:data-[state=active]:text-[#dd00ff] transition-all duration-300"
                                    >
                                        <Moon className="h-4 w-4 mr-2" />
                                        Mode Gelap
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
