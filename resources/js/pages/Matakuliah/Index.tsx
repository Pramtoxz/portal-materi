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
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const mk = row.original;
                
                return (
                    <div className="space-x-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditMatakuliah(mk)}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(mk.kodematakuliah)}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout>
            <Head title="Daftar Matakuliah" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Daftar Matakuliah</h1>
                    <Button onClick={() => setShowDialog(true)}>
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
                
                <Toaster />
            </div>
        </AppLayout>
    );
} 