import Logo from "../components/Logo";

export default function LoadingPage() {
    return (
        <div className="flex items-center space-x-5">
            <Logo className="text-asu-maroon h-28" />
            <h1 className="text-7xl py-10">Loading...</h1>
        </div>
    );
}