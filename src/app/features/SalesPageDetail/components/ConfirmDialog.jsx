import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const ConfirmDialog = ({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel,
    confirmVariant = 'default',
    onConfirm,
    loading,
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm">
            <DialogHeader>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${
                    confirmVariant === 'destructive' ? 'bg-red-100' : 'bg-amber-100'
                }`}>
                    <AlertTriangle className={`w-6 h-6 ${
                        confirmVariant === 'destructive' ? 'text-red-600' : 'text-amber-600'
                    }`} />
                </div>
                <DialogTitle className="text-base font-bold text-slate-900">
                    {title}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 leading-relaxed">
                    {description}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 mt-2">
                <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                    className="flex-1"
                >
                    Batal
                </Button>
                <Button
                    variant={confirmVariant}
                    onClick={onConfirm}
                    disabled={loading}
                    className={`flex-1 gap-2 ${
                        confirmVariant === 'destructive'
                            ? ''
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {confirmLabel}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default ConfirmDialog;