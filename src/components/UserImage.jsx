export default function UserImage({ className, user }) {
    return (
        (user) ?
            <img className={className + "rounded-full"} src={user.photoURL} />
            :
            null
    )
}