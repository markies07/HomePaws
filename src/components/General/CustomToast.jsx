import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../index.css'; // Your custom styles

// ORANGE BACKGROUND
export const notifySuccessOrange = (message) => {
  toast.success(message, {
    className: 'green-bg',
    bodyClassName: 'custom-toast-body',
  });
};

export const notifyErrorOrange = (message) => {
  toast.error(message, {
    className: 'orange-bg',
    bodyClassName: 'custom-toast-body',
  });
};

export const notifyInfoOrange = (message) => {
  toast.info(message, {
    className: 'orange-bg',
    bodyClassName: 'custom-toast-body',
  });
};

export const notifyWarningOrange = (message) => {
  toast.warn(message, {
    className: 'orange-bg',
    bodyClassName: 'custom-toast-body',
  });
};

// WHITE BACKGROUND
export const notifySuccessWhite = (message) => {
  toast.success(message, {
    className: 'white-bg',
    bodyClassName: 'custom-toast-body',
  });
};

export const notifyErrorWhite = (message) => {
  toast.error(message, {
    className: 'white-bg',
    bodyClassName: 'custom-toast-body',
  });
};

export const notifyInfoWhite = (message) => {
  toast.info(message, {
    className: 'white-bg',
    bodyClassName: 'custom-toast-body',
  });
};

export const notifyWarningWhite = (message) => {
  toast.warn(message, {
    className: 'white-bg',
    bodyClassName: 'custom-toast-body',
  })
};
