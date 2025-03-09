import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MatakuliahProps } from '@/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BookText, Clock, Calendar } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function MatakuliahForm({ 
    matakuliah = null, 
    onSuccess = () => {} 
}: {
    matakuliah?: MatakuliahProps | null;
    onSuccess?: () => void;
}) {
    const { data, setData, post, put, processing, errors } = useForm({
        kodematakuliah: matakuliah ? matakuliah.kodematakuliah : '',
        namamatakuliah: matakuliah ? matakuliah.namamatakuliah : '',
        sks: matakuliah ? matakuliah.sks : '',
        semester: matakuliah ? matakuliah.semester : '',
    });
    
    const [sksValue, setSksValue] = useState<number>(matakuliah?.sks || 2);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (matakuliah) {
            put(route('matakuliah.update', matakuliah.kodematakuliah), {
                onSuccess: () => onSuccess(),
            });
        } else {
            post(route('matakuliah.store'), {
                onSuccess: () => onSuccess(),
            });
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg border-0">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <BookOpen className="h-5 w-5" />
                    {matakuliah ? 'Edit Matakuliah' : 'Tambah Matakuliah Baru'}
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">
                    {matakuliah ? 'Perbarui informasi matakuliah yang sudah ada' : 'Isi formulir untuk menambahkan matakuliah baru'}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="pt-6 space-y-5">
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
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.visit(route('matakuliah.index'))}
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
                </CardFooter>
            </form>
        </Card>
    );
} 