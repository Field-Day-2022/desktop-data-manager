import toast, { Toaster } from "react-hot-toast";

const Type = {
    error: 0,
    success: 1,
    plain: 2
}

const style = {
    padding: '8px'
}

const config = {
    duration: 2000, 
    style: style,

}

const notify = (type, text) => {
    switch (type) {
        case Type.error:
            toast.error(text, config);
            return;
        case Type.success:
            toast.success(text, config);
            return;
        default:
            toast(text, config);
            return;
    }
}

function Notifier() {
    return (
        <Toaster  position="bottom-center" />
    );
}

export { notify, Notifier, Type }