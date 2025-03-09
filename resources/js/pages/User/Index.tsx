import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { PageProps } from '@/types';
import { useState, useEffect } from 'react';
import DialogForm from './UserDialogForm';
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

interface UserProps {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
}

export default function UserIndex() {
    const { users, flash } = usePage<PageProps>().props;
    const [showDialog, setShowDialog] = useState(false);
    const [editUser, setEditUser] = useState<UserProps | null>(null);
    const [pageIndex, setPageIndex] = useState(users?.current_page ? users.current_page - 1 : 0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
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

    const handleDeleteClick = (id: number) => {
        setUserToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (userToDelete) {
            router.delete(route('user.destroy', userToDelete), {
                onSuccess: () => {
                    toast({
                        title: "Berhasil!",
                        description: "User berhasil dihapus",
                        variant: "success",
                    });
                },
                onError: () => {
                    toast({
                        title: "Error!",
                        description: "Gagal menghapus user",
                        variant: "destructive",
                    });
                },
            });
        }
        setDeleteDialogOpen(false);
        setUserToDelete(null);
    };

    const handlePageChange = (page: number) => {
        setPageIndex(page);
        router.get(route('user.index'), { page: page + 1 }, { preserveState: true });
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'dosen':
                return { variant: "default", className: "bg-red-500 hover:bg-red-600" };
            case 'akademis':
                return { variant: "default", className: "bg-blue-500 hover:bg-blue-600" };
            case 'mahasiswa':
                return { variant: "secondary", className: "bg-green-500 hover:bg-green-600" };
            default:
                return { variant: "outline", className: "" };
        }
    };

    const columns: ColumnDef<UserProps>[] = [
        {
            accessorKey: 'name',
            header: 'Nama',
            cell: ({ row }) => (
                <div className="min-w-[150px]">{row.original.name}</div>
            ),
        },
        {
            accessorKey: 'username',
            header: 'Username',
            cell: ({ row }) => (
                <div className="min-w-[120px]">{row.original.username}</div>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => (
                <div className="min-w-[200px]">{row.original.email}</div>
            ),
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => {
                const role = row.original.role;
                const badgeProps = getRoleBadgeVariant(role);
                return (
                    <div className="min-w-[100px]">
                        <Badge 
                            variant={badgeProps.variant as "default" | "secondary" | "destructive" | "outline"}
                            className={badgeProps.className}
                        >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Badge>
                    </div>
                );
            }
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }) => {
                const user = row.original;
                
                return (
                    <div className="flex items-center gap-2 min-w-[150px]">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditUser(user)}
                            className="h-8 px-2 text-xs sm:text-sm sm:px-3"
                        >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden xs:inline">Edit</span>
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(user.id)}
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
            <Head title="Manajemen User" />
            <div className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
                    <div className="space-y-1">
                        <h1 className="text-xl sm:text-2xl font-bold">Manajemen User</h1>
                    </div>
                    <Button onClick={() => setShowDialog(true)} className="w-full sm:w-auto whitespace-nowrap">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah User
                    </Button>
                </div>

                <DialogForm 
                    open={showDialog}
                    onOpenChange={setShowDialog}
                    user={null}
                    onSuccess={() => {
                        toast({
                            title: "Berhasil!",
                            description: "User berhasil ditambahkan",
                            variant: "success",
                        });
                    }}
                />

                <DialogForm 
                    open={!!editUser}
                    onOpenChange={(open) => !open && setEditUser(null)}
                    user={editUser}
                    onSuccess={() => {
                        toast({
                            title: "Berhasil!",
                            description: "User berhasil diperbarui",
                            variant: "success",
                        });
                    }}
                />

                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus user ini? 
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

                <div style={{ width: '100%', overflowX: 'auto' }}>
                    {users && (
                        <DataTable
                            columns={columns}
                            data={users.data || []}
                            pagination={{
                                pageCount: users?.last_page || 0,
                                pageIndex,
                                pageSize: users?.per_page || 10,
                            }}
                            onPageChange={handlePageChange}
                            searchable={true}
                            searchColumn="name"
                        />
                    )}
                </div>
                
                <Toaster />
            </div>
        </AppLayout>
    );
} 