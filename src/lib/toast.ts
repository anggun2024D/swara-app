import toast from 'react-hot-toast';
import { getErrorMessage } from '@/services/api';

export const showSuccess = (message: string) =>
  toast.success(message, { duration: 3000 });

export const showError = (error: unknown) =>
  toast.error(getErrorMessage(error), { duration: 5000 });

export const showLoading = (message = 'Memproses...') =>
  toast.loading(message);

export const dismissToast = (id: string) => toast.dismiss(id);