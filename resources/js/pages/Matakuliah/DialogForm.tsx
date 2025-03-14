import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MatakuliahProps } from '@/types';
import { useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    Dialog, 
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { BookOpen, BookText, Clock, Calendar } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DialogFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    matakuliah?: MatakuliahProps | null;
    onSuccess?: () => void;
}

export default function DialogForm({ open, onOpenChange, matakuliah = null, onSuccess }: DialogFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        kodematakuliah: '',
        namamatakuliah: '',
        sks: '',
        semester: '',
    });
    
    const [sksValue, setSksValue] = useState<number>(2);

    useEffect(() => {
        if (matakuliah) {
            setData({
                kodematakuliah: matakuliah.kodematakuliah || '',
                namamatakuliah: matakuliah.namamatakuliah || '',
                sks: matakuliah.sks?.toString() || '',
                semester: matakuliah.semester || '',
            });
            setSksValue(matakuliah.sks || 2);
        } else {
            reset('kodematakuliah', 'namamatakuliah', 'sks', 'semester');
            setSksValue(2);
        }
    }, [matakuliah, setData, reset]);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (matakuliah) {
            put(route('matakuliah.update', matakuliah.kodematakuliah), {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    onSuccess?.();
                },
            });
        } else {
            post(route('matakuliah.store'), {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    onSuccess?.();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            onOpenChange(isOpen);
            if (!isOpen) reset();
        }}>
            <DialogContent className="sm:max-w-[500px]">
                <Head title={matakuliah ? 'Edit Matakuliah' : 'Tambah Matakuliah'} />
                
                <DialogHeader className="pb-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                        <BookOpen className="h-5 w-5 text-primary" />
                        {matakuliah ? 'Edit Matakuliah' : 'Tambah Matakuliah Baru'}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-1">
                        {matakuliah 
                            ? 'Perbarui informasi matakuliah yang sudah ada' 
                            : 'Isi formulir untuk menambahkan matakuliah baru ke sistem'}
                    </DialogDescription>
                </DialogHeader>
               
                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="kodematakuliah" className="flex items-center gap-1.5">
                            <BookText className="h-4 w-4" />
                            Kode Matakuliah
                        </Label>
                        <Input
                            id="kodematakuliah"
                            type="text"
                            value={data.kodematakuliah}
                            onChange={(e) => setData('kodematakuliah', e.target.value)}
                            disabled={!!matakuliah}
                            placeholder="Contoh: MK001"
                            className={cn(
                                "transition-all focus-visible:ring-primary",
                                errors.kodematakuliah ? 'border-red-500 focus-visible:ring-red-500' : ''
                            )}
                        />
                        {errors.kodematakuliah && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                {errors.kodematakuliah}
                            </p>
                        )}
                        {!errors.kodematakuliah && (
                            <p className="text-muted-foreground text-xs">
                                Kode unik untuk identifikasi matakuliah
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="namamatakuliah" className="flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4" />
                            Nama Matakuliah
                        </Label>
                        <Input
                            id="namamatakuliah"
                            type="text"
                            value={data.namamatakuliah}
                            onChange={(e) => setData('namamatakuliah', e.target.value)}
                            placeholder="Masukkan nama matakuliah"
                            className={cn(
                                "transition-all focus-visible:ring-primary",
                                errors.namamatakuliah ? 'border-red-500 focus-visible:ring-red-500' : ''
                            )}
                        />
                        {errors.namamatakuliah && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                {errors.namamatakuliah}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sks" className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            SKS
                        </Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="sks"
                                type="number"
                                min="1"
                                max="6"
                                value={data.sks}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    setData('sks', e.target.value);
                                    if (!isNaN(value)) setSksValue(value);
                                }}
                                className={cn(
                                    "transition-all focus-visible:ring-primary w-24",
                                    errors.sks ? 'border-red-500 focus-visible:ring-red-500' : ''
                                )}
                            />
                            <div className="flex-1">
                                <div className="h-2 bg-gray-200 rounded-full">
                                    <div 
                                        className="h-2 bg-primary rounded-full transition-all" 
                                        style={{ width: `${Math.min(100, (sksValue / 6) * 100)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>1</span>
                                    <span>2</span>
                                    <span>3</span>
                                    <span>4</span>
                                    <span>5</span>
                                    <span>6</span>
                                </div>
                            </div>
                        </div>
                        {errors.sks && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                {errors.sks}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="semester" className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            Semester
                        </Label>
                        <Select
                            value={data.semester.toString()}
                            onValueChange={(value) => setData('semester', value)}
                        >
                            <SelectTrigger 
                                className={cn(
                                    "transition-all focus-visible:ring-primary",
                                    errors.semester ? 'border-red-500 focus-visible:ring-red-500' : ''
                                )}
                            >
                                <SelectValue placeholder="Pilih Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Ganjil" className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                    Ganjil
                                </SelectItem>
                                <SelectItem value="Genap" className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    Genap
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.semester && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                {errors.semester}
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
                                <>{matakuliah ? 'Perbarui' : 'Simpan'}</>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 