import Button from "../components/Button";
import PageWrapper from "./PageWrapper";
import { useAtom } from "jotai";
import { currentPageName } from '../utils/jotai';
import lizardImage from '../../public/lizard.jpg';

export default function HomePage() {
    const [currentPage, setCurrentPage] = useAtom(currentPageName);

    return (
        <PageWrapper>
            <div className='m-5 p-10 rounded-lg shadow-md bg-asu-maroon mt-8 text-white'>
                <HeaderSection />
            </div>
            <div className='m-5 p-10 rounded-lg shadow-md bg-white dark:bg-neutral-900 flex flex-col items-center'>
                <MainContent setCurrentPage={setCurrentPage} />
            </div>
        </PageWrapper>
    );
}

const HeaderSection = () => (
    <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Field Day</h1>
        <h2 className="text-2xl mb-2">Data Management Tool</h2>
        <p className="text-lg">
            Field Day builds rich, dynamic forms for mobile data collection and query.
        </p>
    </div>
);

const MainContent = ({ setCurrentPage }) => (
    <div className="w-full flex flex-col lg:flex-row items-center gap-10">
        <img src={lizardImage} alt="Lizard" className="w-full lg:w-1/3 rounded-full shadow-md" />
        <div className="flex flex-col items-center lg:items-start gap-5 text-center lg:text-left">
            <SectionTitle title="Enter the WebUI" />
            <p className="text-lg">
                The Field Day Web UI is a powerful desktop application designed to manage wildlife data collected through the Field Day mobile app. It serves as an essential tool for researchers, allowing them to efficiently view, manage, and export data collected in the field.
            </p>
            <Button text='Enter WebUI' onClick={() => setCurrentPage('Table')} />
            <SectionTitle title="Resources" />
            <ResourceLinks />
        </div>
    </div>
);

const SectionTitle = ({ title }) => (
    <h1 className="text-3xl font-semibold mb-3">{title}</h1>
);

const ResourceLinks = () => (
    <ul className="list-disc pl-5 space-y-2">
        <li><a href="https://github.com/Field-Day-2022/field-day-2022-webUI" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
        <li><a href="https://tailwindcss.com/docs/guides/vite" target="_blank" rel="noopener noreferrer">Tailwind with Vite</a></li>
        <li><a href="https://reactjs.org/docs/getting-started.html" target="_blank" rel="noopener noreferrer">React Documentation</a></li>
        <li><a href="https://firebase.google.com/docs" target="_blank" rel="noopener noreferrer">Firebase Documentation</a></li>
        <li><a href="https://cloud.google.com/firestore/docs" target="_blank" rel="noopener noreferrer">Firestore Documentation</a></li>
    </ul>
);
