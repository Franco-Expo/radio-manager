
// This is a compatibility layer to make existing code work with Sonner
import { toast as sonnerToast, type ToastT } from "sonner";

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
};

export function useToast() {
  function toast({ title, description, variant, action }: Omit<ToastProps, "id">) {
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

  // To maintain compatibility, we'll return an empty array with the expected shape
  // The actual toasts are handled by Sonner directly
  return {
    toast,
    toasts: [] as (ToastProps & ToastT)[],
  };
}

// For direct usage
export { toast } from "sonner";
