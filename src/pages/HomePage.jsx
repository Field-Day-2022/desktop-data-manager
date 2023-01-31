import Card from "../components/Card";
import PageWrapper from "./PageWrapper";

export default function HomePage() {
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
        </PageWrapper>
    )
}