import Button from "../components/Button";
import GoogleIcon from "../components/GoogleIcon";
import Logo from "../components/Logo";

export default function LoginPage({ loading, loginEvent }) {

    const LOADING_MESSAGE = 'Loading Google\'s authentication.'
    const LOGIN_MESSAGE = 'Click login to sign in with your ASURITE ID.'

    return (
        <div className="text-center">
            <div className="pt-10">
                <h1 className="text-7xl pt-5">Field Day</h1>
                <h2 className="text-xl pb-10">Data Management Tool</h2>
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
                        icon={<GoogleIcon className="w-6 mx-auto"/>}
                    />
                </div>
            </div>
            <Logo className="text-asu-maroon h-48 mx-auto rotate-45" />
        </div>
    );
}