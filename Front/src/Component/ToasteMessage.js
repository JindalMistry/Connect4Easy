import { toast } from "react-toastify";

export const toastAlert = (Message, type) => {
    let position = "bottom-center";
    if (type === "SUCCESS") {
        toast.success(Message, {
            className: "toast-message"
        });
    }
    else if (type === "WARN") {
        toast.warn(Message, {
            position: position,
            className: "toast-message"
        });
    }
    else if (type === "ERROR") {
        toast.error(Message, {
            position: position,
            className: "toast-message"
        });
    }
};