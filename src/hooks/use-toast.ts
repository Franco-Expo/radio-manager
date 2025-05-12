
// This is a compatibility layer to make existing code work with Sonner
import { toast as sonnerToast, type ToastT } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

export function useToast() {
  function toast({ title, description, variant, action }: ToastProps) {
    switch (variant) {
      case "destructive":
        return sonnerToast.error(title, {
          description,
          action,
        });
      default:
        return sonnerToast(title, {
          description,
          action,
        });
    }
  }

  // We're not actually using these, but we need to return them to match the expected interface
  return {
    toast,
    toasts: [] as ToastT[],
  };
}

// For direct usage
export { toast } from "sonner";
