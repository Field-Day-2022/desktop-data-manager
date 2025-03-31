import Button from './Button';
import React from 'react';

export default function LogoutButton({ auth }) {
    return <Button text="Logout" disabled={auth.loading} onClick={() => auth.logout()} />;
}
