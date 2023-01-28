export default function UserImage({user}) {
    return(
        (user) ?
            <img className="rounded-full" src={user.photoURL} />
            :
            null
    )
}