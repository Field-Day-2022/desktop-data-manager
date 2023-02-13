import Dropdown from './Dropdown';
import Logo from './Logo';
import LogoutButton from './LogoutButton';
import UserImage from './UserImage';

import { useAtom } from 'jotai';
import { currentProjectName } from '../utils/jotai';

/**
 *
 * @param {*} subcomponents Array of components to be displayed on the right side of the nav bar.
 * @param {string} title Title to be displayed on the left of the nav bar.
 * @returns
 */
export default function TopNav({ title, auth }) {
    const [currentProject, setCurrentProject] = useAtom(currentProjectName);

    return (
        <div className="px-5 bg-neutral-800 text-neutral-100 w-full shadow-md max-h-16">
            <nav className="py-2 flex justify-between">
                <ul className="flex items-center space-x-5">
                    <li>
                        <Logo className="text-asu-maroon fill-current h-12" />
                    </li>
                    <li>
                        <p className="text-lg font-bold">{title}</p>
                    </li>
                </ul>

                <ul className="flex items-center space-x-5">
                    <div>Project: </div>
                    <Dropdown
                        onClickHandler={(selectedOption) => {
                            if (selectedOption !== currentProject)
                                setCurrentProject(selectedOption.replace(/\s/g, ''));
                        }}
                        options={['Gateway', 'Virgin River', 'San Pedro']}
                    />
                    <UserController key="userController" user={auth.user} auth={auth} />
                </ul>
            </nav>
        </div>
    );
}

function UserController({ user, auth }) {
    return user
        ? [
            <div key="email">{user.email}</div>,
            <UserImage key="profilePicture" className="h-12" user={user} />,
            <LogoutButton key="logoutBtn" auth={auth} />,
        ]
        : null;
}
