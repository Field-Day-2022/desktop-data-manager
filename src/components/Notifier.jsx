import toast, {Toaster} from "react-hot-toast";

const Type = {
    error: 0,
    success: 1,
    plain: 2
}

function notify(type, text) {
    switch (type) {
        case Type.error:
            toast.error(text, {duration: 2000});
        case Type.success:
            toast.success(text, {duration: 2000});
        case Type.plain:
            toast(text, {duration: 2000});
        default:


    }
}

function Notifier() {
    return (
        <Toaster position="bottom-center" />
    );
}

function Notification() {

}

export {notify, Notifier}