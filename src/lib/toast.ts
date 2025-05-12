
import { toast } from "sonner";

export const showSuccess = (title: string, description?: string) => {
  toast.success(title, {
    description,
  });
};

export const showError = (title: string, description?: string) => {
  toast.error(title, {
    description,
  });
};

export const showWarning = (title: string, description?: string) => {
  toast.warning(title, {
    description,
  });
};

export const showInfo = (title: string, description?: string) => {
  toast.info(title, {
    description,
  });
};

export { toast };
