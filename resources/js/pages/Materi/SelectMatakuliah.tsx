import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MatakuliahProps } from '@/types';
import { Input } from '@/components/ui/input';
import { Search, Book, BookOpen, GraduationCap, Calendar, Grid, List, SortAsc, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

interface Props {
    matakuliah: MatakuliahProps[];
}

type ViewMode = 'grid' | 'list';
type SortMode = 'name' | 'code' | 'semester';

export default function SelectMatakuliah({ matakuliah }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [sortMode, setSortMode] = useState<SortMode>('name');
    const [selectedSemester, setSelectedSemester] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);

    // Simulasi loading
    useState(() => {
        setTimeout(() => setIsLoading(false), 1000);
    });

    const filteredAndSortedMatakuliah = useMemo(() => {
        const filtered = matakuliah.filter((mk) => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = 
                mk.namamatakuliah.toLowerCase().includes(searchLower) ||
                mk.kodematakuliah.toLowerCase().includes(searchLower);
            const matchesSemester = selectedSemester === 'all' || mk.semester === selectedSemester;
            return matchesSearch && matchesSemester;
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
    }, [matakuliah, searchQuery, sortMode, selectedSemester]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    // Skeleton loader component
    const SkeletonCard = () => (
        <div className="rounded-lg border-2 border-muted-foreground/10 p-6 space-y-4">
            <div className="flex justify-between items-start">
                <div className="h-6 w-24 bg-muted-foreground/10 rounded animate-pulse" />
                <div className="h-5 w-5 bg-muted-foreground/10 rounded animate-pulse" />
            </div>
            <div className="h-6 w-3/4 bg-muted-foreground/10 rounded animate-pulse" />
            <div className="space-y-2">
                <div className="h-4 w-1/2 bg-muted-foreground/10 rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-muted-foreground/10 rounded animate-pulse" />
            </div>
        </div>
    );

    return (
        <AppLayout>
            <Head title="Pilih Matakuliah" />
            
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-3 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col space-y-4 text-center mb-8"
                    >
                        <GraduationCap className="h-12 w-12 mx-auto text-primary animate-bounce" />
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            Pilih Matakuliah
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Pilih matakuliah untuk mengelola materi pembelajaran. Anda dapat mencari berdasarkan nama, kode, atau semester.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-6">
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Cari matakuliah..."
                                    className="pl-11 h-12 rounded-full border-2 border-muted-foreground/20 focus-visible:ring-primary/20 focus-visible:ring-offset-2"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Filter className="h-4 w-4" />
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
                                        <Button variant="outline" size="icon">
                                            <SortAsc className="h-4 w-4" />
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

                                <Toggle
                                    pressed={viewMode === 'list'}
                                    onPressedChange={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                >
                                    {viewMode === 'grid' ? (
                                        <Grid className="h-4 w-4" />
                                    ) : (
                                        <List className="h-4 w-4" />
                                    )}
                                </Toggle>
                            </div>
                        </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="skeleton"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={`grid gap-4 ${
                                    viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                                }`}
                            >
                                {[...Array(6)].map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </motion.div>
                        ) : filteredAndSortedMatakuliah.length > 0 ? (
                            <motion.div 
                                key="content"
                                className={`grid gap-4 ${
                                    viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                                }`}
                                variants={container}
                                initial="hidden"
                                animate="show"
                            >
                                {filteredAndSortedMatakuliah.map((mk) => (
                                    <motion.div key={mk.kodematakuliah} variants={item}>
                                        <Card 
                                            className={`
                                                group cursor-pointer hover:shadow-xl hover:scale-[1.02] 
                                                transition-all duration-300 border-2 border-muted-foreground/10 
                                                bg-gradient-to-br from-card to-muted/50
                                                ${viewMode === 'list' ? 'flex flex-row items-center' : ''}
                                            `}
                                            onClick={() => router.get(route('materi.show', mk.kodematakuliah))}
                                        >
                                            <CardHeader className={`space-y-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                                <div className="flex items-start justify-between">
                                                    <Badge 
                                                        variant={mk.semester === "Ganjil" ? "default" : "secondary"}
                                                        className={`
                                                            ${mk.semester === "Ganjil" 
                                                                ? "bg-blue-500/80 hover:bg-blue-500" 
                                                                : "bg-green-500/80 hover:bg-green-500"
                                                            } transition-colors
                                                        `}
                                                    >
                                                        Semester {mk.semester}
                                                    </Badge>
                                                    <BookOpen className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                                                    {mk.namamatakuliah}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className={`space-y-2 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                                <div className="flex items-center text-muted-foreground">
                                                    <Book className="h-4 w-4 mr-2" />
                                                    <span className="text-sm">Kode: {mk.kodematakuliah}</span>
                                                </div>
                                                <div className="flex items-center text-muted-foreground">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    <span className="text-sm">SKS: {mk.sks}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center py-12"
                            >
                                <div className="flex flex-col items-center space-y-4">
                                    <Search className="h-12 w-12 text-muted-foreground" />
                                    <p className="text-lg text-muted-foreground">
                                        {searchQuery 
                                            ? "Tidak ada matakuliah yang sesuai dengan pencarian Anda" 
                                            : "Belum ada matakuliah yang tersedia"
                                        }
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AppLayout>
    );
} 