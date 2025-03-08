import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MatakuliahForm from './Form';
import { MatakuliahProps } from '@/types';
import { Head } from '@inertiajs/react';

interface DialogFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    matakuliah?: MatakuliahProps | null;
    onSuccess?: () => void;
}

export default function DialogForm({ open, onOpenChange, matakuliah = null, onSuccess }: DialogFormProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <Head title={matakuliah ? 'Edit Matakuliah' : 'Tambah Matakuliah'} />
                <DialogHeader>
                    <DialogTitle>
                        {matakuliah ? 'Edit Matakuliah' : 'Tambah Matakuliah'}
                    </DialogTitle>
                </DialogHeader>
                <MatakuliahForm 
                    matakuliah={matakuliah} 
                    onSuccess={() => {
                        onOpenChange(false);
                        onSuccess?.();
                    }}
                />
            </DialogContent>
        </Dialog>
    );
} 