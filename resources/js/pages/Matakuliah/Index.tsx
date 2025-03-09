import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { PageProps, MatakuliahProps } from '@/types';
import { useState, useEffect } from 'react';
import DialogForm from './DialogForm';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Badge } from "@/components/ui/badge";

export default function MatakuliahIndex() {
    const { matakuliah, flash } = usePage<PageProps>().props;
    const [showDialog, setShowDialog] = useState(false);
    const [editMatakuliah, setEditMatakuliah] = useState<MatakuliahProps | null>(null);
    const [pageIndex, setPageIndex] = useState(matakuliah.current_page - 1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [matakuliahToDelete, setMatakuliahToDelete] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        // Menangani flash message dari server
        if (flash?.success) {
            toast({
                title: "Berhasil!",
                description: flash.success,
                variant: "success",
            });
        } else if (flash?.error) {
            toast({
                title: "Error!",
                description: flash.error,
                variant: "destructive",
            });
        }
    }, [flash, toast]);

    const handleDeleteClick = (kode: string) => {
        setMatakuliahToDelete(kode);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (matakuliahToDelete) {
            router.delete(route('matakuliah.destroy', matakuliahToDelete), {
                onSuccess: () => {
                    toast({
                        title: "Berhasil!",
                        description: "Matakuliah berhasil dihapus",
                        variant: "success",
                    });
                },
                onError: () => {
                    toast({
                        title: "Error!",
                        description: "Gagal menghapus matakuliah",
                        variant: "destructive",
                    });
                },
            });
        }
        setDeleteDialogOpen(false);
        setMatakuliahToDelete(null);
    };

    const handlePageChange = (page: number) => {
        setPageIndex(page);
        router.get(route('matakuliah.index'), { page: page + 1 }, { preserveState: true });
    };

    const columns: ColumnDef<MatakuliahProps>[] = [
        {
            accessorKey: 'kodematakuliah',
            header: 'Kode',
        },
        {
            accessorKey: 'namamatakuliah',
            header: 'Nama Matakuliah',
        },
        {
            accessorKey: 'sks',
            header: 'SKS',
        },
        {
            accessorKey: 'semester',
            header: 'Semester',
            cell: ({ row }) => {
                const semester = row.original.semester;
                return (
                    <Badge 
                        variant={semester === "Ganjil" ? "default" : "secondary"}
                        className={semester === "Ganjil" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"}
                    >
                        {semester}
                    </Badge>
                );
            }
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const mk = row.original;
                
                return (
                    <div className="flex flex-wrap gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditMatakuliah(mk)}
                            className="h-8 px-2 text-xs sm:text-sm sm:px-3"
                        >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden xs:inline">Edit</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(mk.kodematakuliah)}
                            className="h-8 px-2 text-xs sm:text-sm sm:px-3"
                        >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden xs:inline">Hapus</span>
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout>
            <Head title="Daftar Matakuliah" />
            <div className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold">Daftar Matakuliah</h1>
                    <Button onClick={() => setShowDialog(true)} className="w-full sm:w-auto">
                        Tambah Matakuliah
                    </Button>
                </div>

                <DialogForm 
                    open={showDialog}
                    onOpenChange={setShowDialog}
                    matakuliah={null}
                    onSuccess={() => {
                        toast({
                            title: "Berhasil!",
                            description: "Matakuliah berhasil ditambahkan",
                            variant: "success",
                        });
                    }}
                />

                <DialogForm 
                    open={!!editMatakuliah}
                    onOpenChange={(open) => !open && setEditMatakuliah(null)}
                    matakuliah={editMatakuliah}
                    onSuccess={() => {
                        toast({
                            title: "Berhasil!",
                            description: "Matakuliah berhasil diperbarui",
                            variant: "success",
                        });
                    }}
                />

                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus matakuliah ini? 
                                Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                                Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <div className="overflow-x-auto -mx-3 sm:mx-0">
                    <div className="w-full">
                        <DataTable
                            columns={columns}
                            data={matakuliah.data}
                            pagination={{
                                pageCount: matakuliah.last_page,
                                pageIndex,
                                pageSize: matakuliah.per_page,
                            }}
                            onPageChange={handlePageChange}
                            searchable={true}
                            searchColumn="namamatakuliah"
                        />
                    </div>
                </div>
                
                <Toaster />
            </div>
        </AppLayout>
    );
} 