import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

export type RenderModalOptions = {
  title: string;
  content?: React.ReactNode;
  component?: React.ReactNode;
  onOk?: () => void;
  onOkText?: string;
  onCancel?: () => void;
  onCancelText?: string;
  onClose: () => void;
};

export function renderModal({
  title,
  content,
  component,
  onOk,
  onOkText = 'Confirmar',
  onCancel,
  onCancelText = 'Cancelar',
  onClose,
}: RenderModalOptions) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger asChild>
        <Button className="h-12 text-sm w-full sm:w-auto" variant="default">
          Editar
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <div>{component ?? content}</div>
      </SheetContent>
    </Sheet>
  );
