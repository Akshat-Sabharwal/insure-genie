import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, InfoIcon, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-green-600" />,
  error: <AlertCircle className="w-5 h-5 text-red-600" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
  info: <InfoIcon className="w-5 h-5 text-blue-600" />,
};

const bgColorMap = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  warning: "bg-yellow-50 border-yellow-200",
  info: "bg-blue-50 border-blue-200",
};

const textColorMap = {
  success: "text-green-800",
  error: "text-red-800",
  warning: "text-yellow-800",
  info: "text-blue-800",
};

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timeout);
  }, [toast, onRemove]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 border rounded-lg ${bgColorMap[toast.type]} animate-in fade-in slide-in-from-top-4 duration-300`}
    >
      {iconMap[toast.type]}
      <span
        className={`flex-1 text-sm font-medium ${textColorMap[toast.type]}`}
      >
        {toast.message}
      </span>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleAddToast = (event: CustomEvent<ToastMessage>) => {
      const newToast = event.detail;
      setToasts((prev) => [...prev, newToast]);
    };

    window.addEventListener("addToast", handleAddToast as EventListener);
    return () => {
      window.removeEventListener("addToast", handleAddToast as EventListener);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

export function showToast(
  message: string,
  type: ToastType = "info",
  duration = 3000,
) {
  const event = new CustomEvent("addToast", {
    detail: {
      id: `${Date.now()}-${Math.random()}`,
      message,
      type,
      duration,
    } as ToastMessage,
  });
  window.dispatchEvent(event);
}
