export default function LogoutButton({auth}) {
    return (
        <button
            text="Logout"
            disabled={!auth.loading}
            onClick={() => {
                auth.logout()
            }} />
    );
}