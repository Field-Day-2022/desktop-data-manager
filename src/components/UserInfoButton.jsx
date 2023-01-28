export default function UserInfoButton({ user }) {
    return (
        (user) ?
            <div className="flex">
                <div>{(user) ? user.email : ''}</div>
                <img src={user.photoURL} />
            </div>
            :
            null

    )

}