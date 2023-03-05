import Button from "./Button";

export default function LogoutButton({auth}) {
    return (
        <Button
            text="Logout"
            disabled={auth.loading}
            onClick={() => {
                auth.logout()
            }} />
    );
}