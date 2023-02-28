import Card from "../components/Card";
import Button from "../components/Button";
import PageWrapper from "./PageWrapper";
import { useAtom } from "jotai";
import { currentPageName } from '../utils/jotai';

export default function WhatsNew() {
    const [currentPage, setCurrentPage] = useAtom(currentPageName);
    return (
        <PageWrapper>
            <Card className='bg-asu-maroon'>
                <div className="text-white">
                    <h1 className="title">Field Day</h1>
                    <h2 className="subtitle">Data Management Tool</h2>
                    <p>
                        Field Day builds rich, dynamic forms for mobile data collection and query.
                    </p>
                </div>
            </Card>
            <div className="flex">
                <Card className='bg-white'>
                    <h1 className="heading">Content Card</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet hendrerit neque, nec sodales lectus. Phasellus aliquet vel orci sed facilisis. Vivamus accumsan ligula ac lorem maximus varius. Aliquam erat volutpat. Suspendisse nisi eros, mollis ac arcu in, feugiat condimentum mauris. Fusce at tempor purus, a tempus arcu. Fusce aliquet nisi at elit ullamcorper porttitor a vitae augue. Integer euismod purus non ante elementum, congue luctus nisi iaculis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
                </Card>
                <Card className='bg-white'>
                    <h1 className="heading">Content Card</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet hendrerit neque, nec sodales lectus. Phasellus aliquet vel orci sed facilisis. Vivamus accumsan ligula ac lorem maximus varius. Aliquam erat volutpat. Suspendisse nisi eros, mollis ac arcu in, feugiat condimentum mauris. Fusce at tempor purus, a tempus arcu. Fusce aliquet nisi at elit ullamcorper porttitor a vitae augue. Integer euismod purus non ante elementum, congue luctus nisi iaculis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
                    <Button text='Enter App' onClick={() => setCurrentPage('Table')} />
                </Card>
            </div>

        </PageWrapper>
    )
}
