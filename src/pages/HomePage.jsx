import Button from "../components/Button";
import PageWrapper from "./PageWrapper";
import { useAtom } from "jotai";
import { currentPageName } from '../utils/jotai';
import lizardImage from '../../public/lizard.jpg';

export default function HomePage() {
    const [currentPage, setCurrentPage] = useAtom(currentPageName);

    return (
        <PageWrapper>
            <div className='m-5 p-10 rounded-lg shadow-md bg-asu-maroon mt-8'>
                <div className="text-white">
                    <h1 className="title">Field Day</h1>
                    <h2 className="subtitle">Data Management Tool</h2>
                    <p>
                        Field Day builds rich, dynamic forms for mobile data collection and query.
                    </p>
                </div>
            </div>
            <div className='m-5 p-10 rounded-lg shadow-md bg-white flex md:flex-row gap-5 flex-col items-center'>
                <img src={lizardImage} alt="Lizard" className="w-full md:w-1/3 rounded-full shadow-md" />
                <div className="flex flex-col items-center gap-5">
                    <h1 className="heading">Enter the WebUI</h1>
                    <p>
                        The Field Day Web UI is a powerful desktop application designed to manage wildlife data collected through the Field Day mobile app. It serves as an essential tool for researchers, allowing them to efficiently view, manage, and export data collected in the field.
                    </p>
                    <p>&nbsp;</p>
                    <Button text='Enter WebUI' onClick={() => setCurrentPage('Table')} />
                    <h1 className="heading">Resources</h1>
                    <ul className="list-disc pl-5 flex flex-wrap space-x-10 justify-around">
                        <li><a href="https://github.com/Field-Day-2022/field-day-2022-webUI" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
                        <li><a href="https://tailwindcss.com/docs/guides/vite" target="_blank" rel="noopener noreferrer">Tailwind with Vite</a></li>
                        <li><a href="https://reactjs.org/docs/getting-started.html" target="_blank" rel="noopener noreferrer">React Documentation</a></li>
                        <li><a href="https://firebase.google.com/docs" target="_blank" rel="noopener noreferrer">Firebase Documentation</a></li>
                        <li><a href="https://cloud.google.com/firestore/docs" target="_blank" rel="noopener noreferrer">Firestore Documentation</a></li>
                    </ul>
                </div>


            </div>

        </PageWrapper>
    )
}
