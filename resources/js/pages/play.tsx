import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, FileText, Play as PlayIcon, Music, VolumeX, AlertTriangle, Smartphone, Laptop, Pause } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import LogoJayanusa from '@/assets/jayanusa.webp';
import LogoKampusMerdeka from '@/assets/kampusmerdeka.webp';
import LogoTutwuri from '@/assets/tutwuri.webp';
import Lottie from 'lottie-react';
import NoVideo from '@/assets/novideo.json';
import Hymne from '@/assets/hymne.wav';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Props {
    materi: {
        id: number;
        namamateri: string;
        filemateri?: string;
        linkmateri?: string;
        keterangan?: string;
        matakuliah: {
            namamatakuliah: string;
            kodematakuliah: string;
        };
    };
}

// Fungsi untuk mengekstrak ID video YouTube dari URL
const getYoutubeVideoId = (url: string) => {
    if (!url) return null;
    
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^/?]+)/i,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^/?]+)/i,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/live\/([^/?]+)/i
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    
    return null;
};

export default function Play({ materi }: Props) {
    const [isVideoPaused, setIsVideoPaused] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);
    const [showPdf, setShowPdf] = useState(false);
    const [isMusicDialogOpen, setIsMusicDialogOpen] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const playerRef = useRef<YT.Player | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const videoId = getYoutubeVideoId(materi.linkmateri || '');

    // Deteksi perangkat mobile
    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor;
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        };
        
        setIsMobileDevice(checkMobile());
    }, []);

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

    useEffect(() => {
        if (materi?.linkmateri && videoId) {
            if (!window.YT) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            }

            const initPlayer = () => {
                playerRef.current = new window.YT.Player('youtube-player', {
                    videoId: videoId,
                    height: '100%',
                    width: '100%',
                    playerVars: {
                        rel: 0,
                        modestbranding: 1,
                        enablejsapi: 1,
                    },
                    events: {
                        onReady: () => setPlayerReady(true),
                        onStateChange: (event: { data: number }) => {
                            setIsVideoPaused(event.data === 2 || event.data === 0);
                        }
                    }
                });
            };

            if (window.YT && window.YT.Player) {
                initPlayer();
            } else {
                window.onYouTubeIframeAPIReady = initPlayer;
            }
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [materi?.linkmateri, videoId]);

    // Effect untuk memutar hymne saat tidak ada video
    useEffect(() => {
        // Jika video tidak tersedia, persiapkan musik hymne
        if (!videoId) {
            // Hanya inisialisasi audio jika belum ada
            if (!audioRef.current) {
                audioRef.current = new Audio(Hymne);
                audioRef.current.loop = true;
                audioRef.current.volume = 0.3;
                
                // Tambahkan penanganan error untuk audio
                audioRef.current.addEventListener('error', (e) => {
                    console.error('Error audio:', e);
                    setIsMusicPlaying(false);
                });
            }
            
            // Cek status musik dari localStorage
            const musicStatus = localStorage.getItem('portalMusic');
            if (musicStatus === 'playing') {
                // Buat promise untuk memastikan audio siap sebelum dimainkan
                const playPromise = audioRef.current.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsMusicPlaying(true);
                        })
                        .catch(error => {
                            console.error('Gagal memutar audio:', error);
                            localStorage.setItem('portalMusic', 'paused');
                            setIsMusicPlaying(false);
                        });
                }
            } else if (musicStatus === null) {
                // Hanya tampilkan dialog jika belum ada preferensi
                const timer = setTimeout(() => {
                    setIsMusicDialogOpen(true);
                }, 2000);
                return () => clearTimeout(timer);
            }
            
            // Cleanup function
            return () => {
                if (audioRef.current) {
                    const currentAudio = audioRef.current;
                    // Lepaskan event listener untuk mencegah memory leak
                    currentAudio.removeEventListener('error', () => {});
                    
                    // Jangan menghapus instance audio di cleanup, biarkan instance tetap ada
                    // Ini mencegah audio bentrok saat komponen dimount ulang
                    if (!isMusicPlaying) {
                        currentAudio.pause();
                    }
                }
            };
        }
    }, [videoId]);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isMusicPlaying) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0; // Reset posisi audio
                localStorage.setItem('portalMusic', 'paused');
            } else {
                const playPromise = audioRef.current.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            localStorage.setItem('portalMusic', 'playing');
                        })
                        .catch(error => {
                            console.error('Gagal memutar audio:', error);
                            localStorage.setItem('portalMusic', 'paused');
                        });
                }
            }
            setIsMusicPlaying(!isMusicPlaying);
        }
        setIsMusicDialogOpen(false);
    };
    
    // Event listener untuk sinkronisasi audio antar halaman
    useEffect(() => {
        if (!videoId) {
            const handleStorageChange = (e: StorageEvent) => {
                if (e.key === 'portalMusic') {
                    if (e.newValue === 'playing' && audioRef.current && !isMusicPlaying) {
                        audioRef.current.play().catch(console.error);
                        setIsMusicPlaying(true);
                    } else if (e.newValue === 'paused' && audioRef.current && isMusicPlaying) {
                        audioRef.current.pause();
                        setIsMusicPlaying(false);
                    }
                }
            };
            
            window.addEventListener('storage', handleStorageChange);
            return () => window.removeEventListener('storage', handleStorageChange);
        }
    }, [isMusicPlaying, videoId]);

    // Fungsi untuk menampilkan peringatan PDF di mobile
    const handlePdfButtonClick = () => {
        if (isMobileDevice) {
            setIsPdfDialogOpen(true);
        } else {
            setShowPdf(!showPdf);
        }
    };

    return (
        <>
            <Head title={`Tonton - ${materi.namamateri}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:bg-gradient-to-br dark:from-[#1a1a1a] dark:via-[#0f1117] dark:to-black transition-all duration-500">
                {/* Audio player (hidden) */}
                {!videoId && (
                    <audio ref={audioRef} src={Hymne} loop preload="auto" className="hidden" />
                )}
                
                {/* Dialog Pemutaran Musik */}
                {!videoId && (
                    <Dialog open={isMusicDialogOpen} onOpenChange={setIsMusicDialogOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-blue-900 dark:text-white">Semangat Belajar!</DialogTitle>
                                <DialogDescription className="dark:text-[#dd00ff]/80">
                                    Musik hymne menemani Anda mempelajari materi baru. Mari tingkatkan fokus dan konsentrasi
                                    dalam belajar hari ini. Sukses selalu!
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end space-x-4 mt-6">
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        setIsMusicDialogOpen(false);
                                        localStorage.setItem('portalMusic', 'paused');
                                    }}
                                    className="border-blue-200 dark:border-[#dd00ff]/30"
                                >
                                    <VolumeX className="mr-2 h-4 w-4" />
                                    Matikan Musik
                                </Button>
                                <Button 
                                    onClick={() => {
                                        toggleMusic();
                                        if (!isMusicPlaying) {
                                            localStorage.setItem('portalMusic', 'playing');
                                        }
                                    }}
                                    className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-[#b800e6] dark:via-[#dd00ff] dark:to-[#ff00ff]"
                                >
                                    <Music className="mr-2 h-4 w-4" />
                                    Lanjutkan
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
                
                {/* Dialog peringatan PDF di perangkat mobile */}
                <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-blue-900 dark:text-white flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                Perhatian: Pembukaan PDF di Perangkat Mobile
                            </DialogTitle>
                            <DialogDescription className="dark:text-[#dd00ff]/80 mt-4">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Smartphone className="h-5 w-5 mt-1 text-red-500 flex-shrink-0" />
                                        <p>
                                            <span className="font-semibold">Perangkat Mobile:</span> Pembukaan PDF langsung di aplikasi ini 
                                            tidak didukung karena keterbatasan browser mobile dan memori perangkat. 
                                            Silakan gunakan opsi download untuk membuka dengan aplikasi PDF reader di perangkat Anda.
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <Laptop className="h-5 w-5 mt-1 text-green-500 flex-shrink-0" />
                                        <p>
                                            <span className="font-semibold">Perangkat Desktop/Laptop:</span> Fitur buka PDF tersedia 
                                            dan berfungsi dengan baik karena dukungan penuh dari browser desktop dan 
                                            kemampuan memproses file yang lebih besar.
                                        </p>
                                    </div>
                                </div>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-4 mt-6">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsPdfDialogOpen(false)}
                                className="border-blue-200 dark:border-[#dd00ff]/30"
                            >
                                Tutup
                            </Button>
                            <Button
                                onClick={() => window.open(route('mahasiswa.materi.download', materi.id), '_blank')}
                                className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-[#b800e6] dark:via-[#dd00ff] dark:to-[#ff00ff]"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download PDF
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
                
                {/* Kontrol Musik */}
                {!videoId && isMusicPlaying && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="fixed bottom-4 right-4 z-50 flex gap-2"
                    >
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={toggleMusic} 
                            className="rounded-full p-3 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 dark:from-[#b800e6] dark:via-[#dd00ff] dark:to-[#ff00ff] shadow-lg"
                        >
                            <Pause className="h-5 w-5 text-white" />
                        </motion.button>
                    </motion.div>
                )}
                
                {!videoId && !isMusicPlaying && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="fixed bottom-4 right-4 z-50"
                    >
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={toggleMusic} 
                            className="rounded-full shadow-lg p-3 flex items-center justify-center bg-blue-100 dark:bg-[#1a1a1a] border border-blue-200 dark:border-[#dd00ff]/30"
                        >
                            <PlayIcon className="h-5 w-5 text-blue-600 dark:text-[#dd00ff]" />
                        </motion.button>
                    </motion.div>
                )}
                
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
                    
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Link href={route('mahasiswa.materi.list', materi.matakuliah.kodematakuliah)}>
                                <Button
                                    variant="ghost"
                                    className="mb-4 text-white hover:bg-white/20"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Kembali ke Daftar Materi
                                </Button>
                            </Link>

                            <motion.div 
                                className="space-y-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h1 className="text-3xl font-bold text-white">{materi.namamateri}</h1>
                                <p className="text-blue-100 dark:text-purple-100">
                                    {materi.matakuliah.namamatakuliah} ({materi.matakuliah.kodematakuliah})
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div 
                        className="space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {/* Video Player */}
                        {videoId ? (
                            <motion.div 
                                className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl shadow-purple-500/10"
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative aspect-video">
                                    <div id="youtube-player" className="w-full h-full" />
                                    {playerReady && isVideoPaused && (
                                        <div 
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                                            onClick={() => {
                                                if (playerRef.current) {
                                                    playerRef.current.playVideo();
                                                }
                                            }}
                                        >
                                            <PlayIcon className="h-16 w-16 text-white" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                className="aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-2xl shadow-purple-500/10 flex items-center justify-center"
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative aspect-video flex flex-col items-center justify-center p-4">
                                    <Lottie 
                                        animationData={NoVideo} 
                                        className="w-full h-full max-w-[500px]" 
                                        loop={true}
                                    />
                                    <p className="text-center text-slate-700 dark:text-slate-300 text-lg font-medium mt-4">
                                        Silahkan Buka / Download Materi di bawah ini
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* File Actions */}
                        {materi.filemateri && (
                            <>
                                <motion.div 
                                    className="flex gap-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Button
                                        className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-[#b800e6] dark:to-[#dd00ff] hover:from-blue-700 hover:to-blue-600"
                                        onClick={handlePdfButtonClick}
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        {showPdf ? 'Tutup PDF' : 'Buka PDF'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-blue-200 dark:border-[#dd00ff]/30 hover:border-blue-500 dark:hover:border-[#dd00ff]"
                                        onClick={() => window.open(route('mahasiswa.materi.download', materi.id), '_blank')}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Materi
                                    </Button>
                                </motion.div>

                                {/* PDF Viewer */}
                                {showPdf && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="w-full rounded-2xl overflow-hidden shadow-2xl border border-blue-100 dark:border-[#dd00ff]/20"
                                    >
                                        <div className="relative w-full" style={{ height: '800px' }}>
                                            <iframe
                                                src={route('mahasiswa.materi.view', materi.id)}
                                                className="w-full h-full"
                                                title="PDF Viewer"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </>
                        )}

                        {/* Keterangan */}
                        {materi.keterangan && (
                            <motion.div 
                                className="prose max-w-none bg-white dark:bg-[#1a1a1a]/80 p-8 rounded-2xl shadow-xl border border-blue-100 dark:border-[#dd00ff]/20"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-4">Keterangan</h2>
                                <p className="text-blue-600 dark:text-[#dd00ff]/80">{materi.keterangan}</p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </>
    );
}
