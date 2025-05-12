
// This file exists to satisfy imports in toaster.tsx
// It's a compatibility layer for the previous toast system
// Since we're using Sonner now, this is just a minimal implementation

import * as React from "react";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} {...props} />
  )
);
Toast.displayName = "Toast";

export const ToastClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => (
    <button ref={ref} {...props} />
  )
);
ToastClose.displayName = "ToastClose";

export const ToastTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  (props, ref) => (
    <div ref={ref} {...props} />
  )
);
ToastTitle.displayName = "ToastTitle";

export const ToastDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  (props, ref) => (
    <div ref={ref} {...props} />
  )
);
ToastDescription.displayName = "ToastDescription";

export interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  return <>{children}</>;
};

export const ToastViewport = React.forwardRef<HTMLOListElement, React.HTMLAttributes<HTMLOListElement>>(
  (props, ref) => (
    <ol ref={ref} {...props} />
  )
);
ToastViewport.displayName = "ToastViewport";
