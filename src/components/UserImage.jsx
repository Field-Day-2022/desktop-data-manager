import React from 'react';
export default function UserImage({ className, user }) {
    return user && <img className={'rounded-full ' + className} src={user.photoURL} />;
}
