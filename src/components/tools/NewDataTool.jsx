import { useState, useEffect } from "react";
import Dropdown from "../Dropdown";
import { useFirestore } from "../../utils/firestore";

export default function NewDataTool() {
    const [sessions, setSessions] = useState([]);
    const [selectedYear, setSelectedYear] = useState();
    const [selectedSession, setSelectedSession] = useState();
    const { getSessions } = useFirestore();

    useEffect(() => {
        console.log("NewDataTool mounted");
        async function fetchSessions() {
            const sessions = await getSessions();
            setSessions(sessions);
            console.log(sessions);
        }
        fetchSessions();
    }, []);

    const filterSessionsByYear = (year) => {
        const filteredSessions = sessions.filter((session) => session.year === year);
        return filteredSessions;
    };

    const getYears = () => {
        const years = sessions.map((session) => session.data().year);
        const uniqueYears = [...new Set(years)];
        console.log(uniqueYears);
        return uniqueYears;
    };

    const sessionToString = (session) => {
        const dateTime = session.data().dateTime;
        const site = session.data().site;
        return `${dateTime} - ${site}`;
    };

    return (
        <div className="flex-col p-4">
            <div className="heading">Select a Session for New Entry</div>
            <div className="flex">
                <div className="flex-1 p-2">
                    <div>Year:</div>
                    <Dropdown options={getYears()} onClickHandler={(year) => setSelectedYear(year)} value={selectedYear} />
                </div>
                <div className="flex-1 p-2">
                    <div>Session:</div>
                    <Dropdown options={filterSessionsByYear(selectedYear).map(
                        (session) => sessionToString(session)
                    )} onClickHandler={(session) => setSelectedSession(session)} value={selectedSession} />
                </div>
            </div>
        </div>
    );
}