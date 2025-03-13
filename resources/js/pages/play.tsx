import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, FileText, Play as PlayIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import LogoJayanusa from '@/assets/jayanusa.webp';
import LogoKampusMerdeka from '@/assets/kampusmerdeka.webp';
import LogoTutwuri from '@/assets/tutwuri.webp';


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
    const playerRef = useRef<YT.Player | null>(null);
    const videoId = getYoutubeVideoId(materi.linkmateri || '');

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

    return (
        <>
            <Head title={`Tonton - ${materi.namamateri}`} />
            
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
                        {videoId && (
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
                                        onClick={() => setShowPdf(!showPdf)}
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
