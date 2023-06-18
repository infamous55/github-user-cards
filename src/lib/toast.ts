import { type ToastOptions, toast } from 'react-toastify';

const options: ToastOptions = {
  position: 'bottom-right',
  autoClose: 1500,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
  style: {
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    borderWidth: '1px',
    borderColor: 'rgb(229 231 235)',
  },
};

function error(message: string) {
  toast.error(message, options);
}

function success(message: string) {
  toast.success(message, options);
}

export default { error, success };
