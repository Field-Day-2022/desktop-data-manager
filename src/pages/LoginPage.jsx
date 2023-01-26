import Button from "../components/Button";
import Logo from "../components/Logo";

export default function LoginPage({ loading, loginEvent }) {

    const LOADING_MESSAGE = 'Loading Google\'s authentication.'
    const LOGIN_MESSAGE = 'Click login to sign in with your asurite.'

    return (
        <div className="text-center">
            <div className="flex items-center space-x-5">
                <Logo className="text-asu-maroon h-28" />
                <h1 className="text-7xl py-10">Field Day</h1>
            </div>

            <div className="my-5 p-10 rounded-lg shadow-md bg-white">
                <div className="flex flex-col space-y-5">
                    <p>
                        {(loading ? LOADING_MESSAGE : LOGIN_MESSAGE)}
                    </p>
                        <Button
                            enabled={!loading}
                            text={(!loading ? 'Login' : 'Please wait.')}
                            onClick={loginEvent}
                        />
                </div>
            </div>
        </div>
    );
}