import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, ChevronLeft, Video, Download } from 'lucide-react';

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

export default function ListMateri({ matakuliah, materi }: Props) {
    return (
        <>
            <Head title={`Materi - ${matakuliah.namamatakuliah}`} />
            
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => window.history.back()}
                            className="mb-4"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Kembali ke Daftar Matakuliah
                        </Button>

                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold">{matakuliah.namamatakuliah}</h1>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Badge>{matakuliah.kodematakuliah}</Badge>
                                <span>•</span>
                                <span>SKS: {matakuliah.sks}</span>
                                <span>•</span>
                                <span>Semester {matakuliah.semester}</span>
                            </div>
                        </div>
                    </div>

                    {/* List Materi */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {materi.data.map((item) => (
                            <Card 
                                key={item.id} 
                                className="hover:shadow-lg transition-all duration-300"
                            >
                                <CardHeader>
                                    <h3 className="text-lg font-semibold">{item.namamateri}</h3>
                                    {item.keterangan && (
                                        <p className="text-sm text-muted-foreground">{item.keterangan}</p>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {item.linkmateri && (
                                        <Button 
                                            className="w-full"
                                            onClick={() => window.location.href = route('materi.preview', item.id)}
                                        >
                                            <Video className="h-4 w-4 mr-2" />
                                            Tonton Video
                                        </Button>
                                    )}
                                    {item.filemateri && (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() => window.open(route('view.materi', item.id), '_blank')}
                                            >
                                                <FileText className="h-4 w-4 mr-2" />
                                                Lihat PDF
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => window.open(route('download.materi', item.id), '_blank')}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
} 