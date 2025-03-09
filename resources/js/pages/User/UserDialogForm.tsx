import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { User, AtSign, Key, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProps {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
}

interface DialogFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: UserProps | null;
    onSuccess?: () => void;
}

export default function DialogForm({ open, onOpenChange, user = null, onSuccess }: DialogFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        role: '',
    });
    
    useEffect(() => {
        if (user) {
            setData({
                name: user.name || '',
                username: user.username || '',
                email: user.email || '',
                password: '',
                role: user.role || '',
            });
        } else {
            reset('name', 'username', 'email', 'password', 'role');
        }
    }, [user, setData, reset]);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (user) {
            put(route('user.update', user.id), {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    onSuccess?.();
                },
            });
        } else {
            post(route('user.store'), {
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
                <Head title={user ? 'Edit User' : 'Tambah User'} />
                
                <DialogHeader className="pb-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                        <User className="h-5 w-5 text-primary" />
                        {user ? 'Edit User' : 'Tambah User Baru'}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-1">
                        {user 
                            ? 'Perbarui informasi pengguna yang sudah ada' 
                            : 'Isi formulir untuk menambahkan pengguna baru ke sistem'}
                    </DialogDescription>
                </DialogHeader>
               
                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-1.5">
                            <User className="h-4 w-4" />
                            Nama Lengkap
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Masukkan nama lengkap"
                            className={cn(
                                "transition-all focus-visible:ring-primary",
                                errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''
                            )}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="username" className="flex items-center gap-1.5">
                            <AtSign className="h-4 w-4" />
                            Username
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            placeholder="Masukkan username"
                            className={cn(
                                "transition-all focus-visible:ring-primary",
                                errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''
                            )}
                        />
                        {errors.username && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                {errors.username}
                            </p>
                        )}
                        {!errors.username && (
                            <p className="text-muted-foreground text-xs">
                                Username unik untuk login ke sistem
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-1.5">
                            <AtSign className="h-4 w-4" />
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Masukkan alamat email"
                            className={cn(
                                "transition-all focus-visible:ring-primary",
                                errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''
                            )}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="flex items-center gap-1.5">
                            <Key className="h-4 w-4" />
                            {user ? 'Password (Kosongkan jika tidak ingin mengubah)' : 'Password'}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={user ? "Kosongkan jika tidak ingin mengubah" : "Masukkan password"}
                            className={cn(
                                "transition-all focus-visible:ring-primary",
                                errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''
                            )}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role" className="flex items-center gap-1.5">
                            <UserCog className="h-4 w-4" />
                            Role
                        </Label>
                        <Select
                            value={data.role}
                            onValueChange={(value) => setData('role', value)}
                        >
                            <SelectTrigger 
                                className={cn(
                                    "transition-all focus-visible:ring-primary",
                                    errors.role ? 'border-red-500 focus-visible:ring-red-500' : ''
                                )}
                            >
                                <SelectValue placeholder="Pilih Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dosen" className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                    dosen
                                </SelectItem>
                                <SelectItem value="akademis" className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                    Akademis
                                </SelectItem>
                                <SelectItem value="mahasiswa" className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    Mahasiswa
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                {errors.role}
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
                                <>{user ? 'Perbarui' : 'Simpan'}</>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 