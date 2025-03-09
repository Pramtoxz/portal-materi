import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {  Download, ArrowLeft, Play, FileText } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Props {
    materi: {
        id: number;
        namamateri: string;
        filemateri?: string;
        linkmateri?: string;
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

const isYoutubeLink = (url?: string) => {
    return url ? getYoutubeVideoId(url) !== null : false;
};

export default function Preview({ materi }: Props) {
    // Tambahkan console.log untuk debug
    console.log('Materi:', materi);
    console.log('Link Materi:', materi.linkmateri);
    console.log('Is YouTube:', isYoutubeLink(materi.linkmateri));

    const [isVideoPaused, setIsVideoPaused] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);
    const playerRef = useRef<YT.Player | null>(null);

    useEffect(() => {
        if (materi?.linkmateri && isYoutubeLink(materi.linkmateri)) {
            if (!window.YT) {
                const tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            }

            const initPlayer = () => {
                const videoId = getYoutubeVideoId(materi.linkmateri!);
                if (!videoId) return;

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
    }, [materi?.linkmateri]);

    return (
        <>
            <Head title={`Preview - ${materi.namamateri}`} />
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => window.history.back()}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali
                    </Button>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">{materi.namamateri}</h1>
                        <p className="text-muted-foreground">
                            {materi.matakuliah.namamatakuliah} ({materi.matakuliah.kodematakuliah})
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {isYoutubeLink(materi.linkmateri) ? (
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
                                        <Play className="h-16 w-16 text-white" />
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>

                    {materi.filemateri && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">File Materi</h2>
                            <div className="flex gap-2">
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        const pdfUrl = route('view.materi', materi.id);
                                        window.open(pdfUrl, '_blank');
                                    }}
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Buka PDF
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.open(route('download.materi', materi.id), '_blank')}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Materi
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 