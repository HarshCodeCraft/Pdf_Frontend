import Swal from "sweetalert2";

export const showAlert = (type, message) => {
  Swal.fire({
    icon: type, // 'success', 'error', 'warning', 'info'
    title: message,
    toast: true,
    position: "top-end",
    timer: 3000,
    showConfirmButton: false,
  });
};

export const AreYouSure = (title, text) => {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });
};
