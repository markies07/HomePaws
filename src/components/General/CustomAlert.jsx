import Swal from 'sweetalert2';

export const confirm = (title, message) => {
    return Swal.fire({
        title: title,
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#82ac35',
        cancelButtonColor: '#D25A5A',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
    });
};

export const successAlert = (message) => {
    Swal.fire({
        title: 'Success!',
        text: message,
        icon: 'success',
        confirmButtonColor: '#82ac35',
        timer: 5000,
    });
};

export const errorAlert = (message) => {
    Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonColor: '#D25A5A',
    });
};
