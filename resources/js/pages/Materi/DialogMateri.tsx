import { useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import { 
    Dialog, 
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FileText, Link as LinkIcon, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MateriProps {
    id: number;
    kodematakuliah: string;
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

interface DialogMateriProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    materi?: MateriProps | null;
    matakuliah: MatakuliahProps;
    onSuccess?: () => void;
}

export default function DialogMateri({ open, onOpenChange, materi = null, matakuliah, onSuccess }: DialogMateriProps) {
    const { data, setData, processing, errors, reset, progress } = useForm({
        kodematakuliah: matakuliah.kodematakuliah,
        namamateri: '',
        filemateri: null as File | null,
        linkmateri: '',
        keterangan: '',
    });
    
    useEffect(() => {
        if (materi) {
            setData({
                kodematakuliah: materi.kodematakuliah,
                namamateri: materi.namamateri || '',
                filemateri: null,
                linkmateri: materi.linkmateri || '',
                keterangan: materi.keterangan || '',
            });
        } else {
            reset('namamateri', 'filemateri', 'linkmateri', 'keterangan');
            setData('kodematakuliah', matakuliah.kodematakuliah);
        }
    }, [materi, setData, reset, matakuliah.kodematakuliah]);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('kodematakuliah', data.kodematakuliah);
        formData.append('namamateri', data.namamateri);
        formData.append('linkmateri', data.linkmateri || '');
        formData.append('keterangan', data.keterangan || '');
        if (data.filemateri) {
            formData.append('filemateri', data.filemateri);
        }

        if (materi) {
            formData.append('_method', 'PUT');
            router.post(route('materi.update', materi.id), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    onSuccess?.();
                },
            });
        } else {
            router.post(route('materi.store'), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    onSuccess?.();
                },
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validasi tipe file (hanya PDF)
            if (file.type !== 'application/pdf') {
                alert('Hanya file PDF yang diperbolehkan');
                e.target.value = '';
                return;
            }
            
            // Rename file dengan format: [kodematakuliah]_[namamateri]_[timestamp].pdf
            const timestamp = new Date().getTime();
            const safeNamaMatakuliah = matakuliah.kodematakuliah.replace(/[^a-zA-Z0-9]/g, '');
            const safeNamaMateri = data.namamateri.replace(/[^a-zA-Z0-9]/g, '');
            
            // Buat objek File baru dengan nama yang dimodifikasi
            const renamedFile = new File(
                [file], 
                `${safeNamaMatakuliah}_${safeNamaMateri}_${timestamp}.pdf`,
                { type: file.type }
            );
            
            setData('filemateri', renamedFile);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            onOpenChange(isOpen);
            if (!isOpen) reset();
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{materi ? 'Edit Materi' : 'Tambah Materi Baru'}</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="namamateri" className="flex items-center gap-1.5">
                            <FileText className="h-4 w-4" />
                            Nama Materi
                        </Label>
                        <Input
                            id="namamateri"
                            value={data.namamateri}
                            onChange={(e) => setData('namamateri', e.target.value)}
                            className={cn(
                                "transition-all focus-visible:ring-primary",
                                errors.namamateri ? 'border-red-500 focus-visible:ring-red-500' : ''
                            )}
                        />
                        {errors.namamateri && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                {errors.namamateri}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="filemateri" className="flex items-center gap-1.5">
                            <FileUp className="h-4 w-4" />
                            File Materi {materi?.filemateri && '(Kosongkan jika tidak ingin mengubah)'}
                        </Label>
                        <Input
                            id="filemateri"
                            type="file"
                            onChange={handleFileChange}
                            className={cn(
                                "transition-all focus-visible:ring-primary",
                                errors.filemateri ? 'border-red-500 focus-visible:ring-red-500' : ''
                            )}
                        />
                        {progress && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className="bg-primary h-2.5 rounded-full transition-all" 
                                    style={{ width: `${progress.percentage}%` }}
                                ></div>
                            </div>
                        )}
                        {errors.filemateri && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                {errors.filemateri}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="linkmateri" className="flex items-center gap-1.5">
                            <LinkIcon className="h-4 w-4" />
                            Link Materi
                        </Label>
                        <Input
                            id="linkmateri"
                            type="url"
                            value={data.linkmateri}
                            onChange={(e) => setData('linkmateri', e.target.value)}
                            placeholder="https://"
                            className={cn(
                                "transition-all focus-visible:ring-primary",
                                errors.linkmateri ? 'border-red-500 focus-visible:ring-red-500' : ''
                            )}
                        />
                        {errors.linkmateri && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                {errors.linkmateri}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="keterangan" className="flex items-center gap-1.5">
                            <FileText className="h-4 w-4" />
                            Keterangan
                        </Label>
                        <Textarea
                            id="keterangan"
                            value={data.keterangan}
                            onChange={(e) => setData('keterangan', e.target.value)}
                            className={cn(
                                "transition-all focus-visible:ring-primary",
                                errors.keterangan ? 'border-red-500 focus-visible:ring-red-500' : ''
                            )}
                            rows={3}
                        />
                        {errors.keterangan && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                {errors.keterangan}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="gap-1"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="gap-1 min-w-24"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </>
                            ) : (
                                <>{materi ? 'Perbarui' : 'Simpan'}</>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 