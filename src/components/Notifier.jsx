import { toast, Toaster } from "react-hot-toast/dist";

const Type = {
    error: 0,
    success: 1,
    plain: 2
}

export function notify(type, text) {
    switch (type) {
        case Type.error:
            toast.error(text);
        case Type.success:
            toast.success(text);
        case Type.plain:
            toast(text);
        default:


    }
}

export default function Notifier() {
    return (
        <Toaster position="bottom-center" />
    );
}

function Notification() {

}