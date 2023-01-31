import Logo from "./Logo";

/**
 * 
 * @param {*} subcomponents Array of components to be displayed on the right side of the nav bar.
 * @param {string} title Title to be displayed on the left of the nav bar.
 * @returns 
 */
export default function TopNav({ title, subcomponents }) {
    return (
        <div className='px-5 bg-neutral-800 text-neutral-100 w-full shadow-md max-h-16'>
            <nav className='py-2 flex justify-between' >
                <ul className='flex items-center space-x-5'>
                    <li>
                        <a href='/'>
                            <Logo className="text-asu-maroon fill-current h-12" />
                        </a>
                    </li>
                    <li>
                        <p className='text-lg font-bold'>{title}</p>
                    </li>
                </ul>

                <ul className='flex items-center space-x-5'>
                    {subcomponents}
                </ul>
            </nav >
        </div>

    );
}