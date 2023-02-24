import Logo from './Logo';
import LogoutButton from './LogoutButton';
import UserImage from './UserImage';

import { useAtom } from 'jotai';
import { currentPageName } from '../utils/jotai';

/**
 *
 * @param {*} subcomponents Array of components to be displayed on the right side of the nav bar.
 * @param {string} title Title to be displayed on the left of the nav bar.
 * @returns
 */
export default function TopNav({ title, auth }) {
    const [currentPage, setCurrentPage] = useAtom(currentPageName)

    return (
        <div className="px-5 bg-neutral-800 text-neutral-100 w-full shadow-md max-h-16">
            <nav className="py-2 flex justify-between">
                <ul className="flex items-center space-x-5">
                    <li onClick={() => setCurrentPage('Home')}>
                        <Logo className="text-asu-maroon fill-current h-12 cursor-pointer" />
                    </li>
                    <li>
                        <p className="text-lg font-bold">{title}</p>
                    </li>
                </ul>
                <UserController key="userController" user={auth.user} auth={auth} />
            </nav>
        </div>
    );
}

function UserController({ user, auth }) {
    return (
        user
        &&
        <div className='flex items-center space-x-5'>
            <div key="email">{user.email}</div>
            <UserImage key="profilePicture" className="h-12" user={user} />
            <LogoutButton key="logoutBtn" auth={auth} />
        </div>
    );
}
