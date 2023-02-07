import Button from "./Button";

export default function LogoutButton({auth}) {
    return (
        <Button
            text="Logout"
            enabled={!auth.loading}
            onClick={() => {
                auth.logout()
            }} />
    );
}