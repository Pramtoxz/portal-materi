import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, FileText, Link as LinkIcon, ChevronLeft, Download } from 'lucide-react';
import { MatakuliahProps } from '@/types';
import { useState } from 'react';
import DialogMateri from './DialogMateri';
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

interface MateriProps {
    id: number;
    kodematakuliah: string;
    namamateri: string;
    filemateri?: string;
    linkmateri?: string;
    keterangan?: string;
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

export default function Index({ matakuliah, materi }: Props) {
    const [showDialog, setShowDialog] = useState(false);
    const [editMateri, setEditMateri] = useState<MateriProps | null>(null);
    const [pageIndex, setPageIndex] = useState(materi?.current_page ? materi.current_page - 1 : 0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [materiToDelete, setMateriToDelete] = useState<number | null>(null);
    const { toast } = useToast();

    const handlePageChange = (page: number) => {
        setPageIndex(page);
        router.get(route('materi.matakuliah', matakuliah.kodematakuliah), {
            page: page + 1,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDeleteClick = (id: number) => {
        setMateriToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (materiToDelete) {
            router.delete(route('materi.destroy', materiToDelete), {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    toast({
                        title: "Berhasil!",
                        description: "Materi berhasil dihapus",
                        variant: "success",
                    });
                },
            });
        }
    };

    const columns: ColumnDef<MateriProps>[] = [
        {
            accessorKey: "namamateri",
            header: "Nama Materi",
            cell: ({ row }) => (
                <div className="font-medium">{row.original.namamateri}</div>
            ),
        },
        {
            accessorKey: "filemateri",
            header: "Modul",
            cell: ({ row }) => {
                const materi = row.original;
                return materi.filemateri ? (
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(route('download.materi', materi.id), '_blank')}
                        className="h-8 px-2 text-xs sm:text-sm sm:px-3"
                    >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">Download</span>
                    </Button>
                ) : null;
            },
        },
        {
            accessorKey: "linkmateri",
            header: "Link",
            cell: ({ row }) => {
                const linkmateri = row.original.linkmateri;
                return linkmateri ? (
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(linkmateri, '_blank')}
                        className="h-8 px-2 text-xs sm:text-sm sm:px-3"
                    >
                        <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">Buka Link</span>
                    </Button>
                ) : null;
            },
        },
        {
            accessorKey: "keterangan",
            header: "Keterangan",
            cell: ({ row }) => (
                <div className="max-w-[150px] sm:max-w-[200px] lg:max-w-[300px] truncate">
                    {row.original.keterangan || "-"}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => {
                const materi = row.original;
                return (
                    <div className="flex flex-wrap gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.get(route('materi.preview', materi.id))}
                            className="h-8 px-2 text-xs sm:text-sm sm:px-3"
                        >
                            <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden xs:inline">Baca</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditMateri(materi)}
                            className="h-8 px-2 text-xs sm:text-sm sm:px-3"
                        >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden xs:inline">Edit</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(materi.id)}
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
            <Head title={`Materi - ${matakuliah.namamatakuliah}`} />
            <div className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
                    <div className="space-y-1">
                        <Button
                            variant="outline"
                            onClick={() => router.get(route('materi.index'))}
                            className="mb-2"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            <span className="hidden xs:inline">Kembali ke Daftar Matakuliah</span>
                            <span className="xs:hidden">Kembali</span>
                        </Button>
                        <h1 className="text-xl sm:text-2xl font-bold">
                            Materi {matakuliah.namamatakuliah}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kode: {matakuliah.kodematakuliah} | SKS: {matakuliah.sks} | Semester: {matakuliah.semester}
                        </p>
                    </div>

                    <Button 
                        onClick={() => setShowDialog(true)} 
                        className="w-full sm:w-auto whitespace-nowrap"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Materi
                    </Button>
                </div>

                <DialogMateri 
                    open={showDialog}
                    onOpenChange={setShowDialog}
                    materi={null}
                    matakuliah={matakuliah}
                    onSuccess={() => {
                        toast({
                            title: "Berhasil!",
                            description: "Materi berhasil ditambahkan",
                            variant: "success",
                        });
                    }}
                />

                <DialogMateri 
                    open={!!editMateri}
                    onOpenChange={(open) => !open && setEditMateri(null)}
                    materi={editMateri}
                    matakuliah={matakuliah}
                    onSuccess={() => {
                        toast({
                            title: "Berhasil!",
                            description: "Materi berhasil diperbarui",
                            variant: "success",
                        });
                    }}
                />

                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus materi ini? 
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

                <div className="overflow-x-auto -mx-3 sm:mx-0 rounded-lg border">
                    <div className="w-full">
                        {materi && (
                            <DataTable
                                columns={columns}
                                data={materi.data}
                                pagination={{
                                    pageCount: materi.last_page,
                                    pageIndex,
                                    pageSize: materi.per_page,
                                }}
                                onPageChange={handlePageChange}
                                searchable={true}
                                searchColumn="namamateri"
                            />
                        )}
                    </div>
                </div>
                
                <Toaster />
            </div>
        </AppLayout>
    );
} 