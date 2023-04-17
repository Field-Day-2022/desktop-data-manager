import { useEffect } from "react";
import { useState } from "react";
import NewSessionForm from "../components/NewSessionForm";

export default function NewSessionTool({ setData }) {

    const [project, setProject] = useState('Gateway');

    const [sessionData, setSessionData] = useState({
        dateTime: '0',
        recorder: '',
        handler: '',
        site: 'GWA1',
        array: '',
        noCaptures: 'true',
        trapStatus: 'OPEN',
        commentsAboutTheArray: '',
        year: '',
    });

    const setField = (field, value) => {
        if (field === 'dateTime') {
            setDateTime(value);
            return;
        }
        setSessionData({
            ...sessionData,
            [field]: value
        });
    }

    const setDateTime = (dateTime) => {
        const sessionDate = new Date(dateTime);
        const formattedDateTime = `${
            sessionDate.getFullYear()
        }/${
            sessionDate.getMonth() + 1
        }/${
            sessionDate.getDate()
        } ${sessionDate.toLocaleTimeString('en-US', {
            hourCycle: 'h24'
        })}`
        setSessionData({
            ...sessionData,
            dateTime: formattedDateTime,
            year: sessionDate.getFullYear(),
        });
    }

    useEffect(() => {
        setData(sessionData);
        console.log(sessionData);
    }, [sessionData]);

    return (
        <NewSessionForm
            session={sessionData}
            setField={setField}
            project={project}
            setProject={setProject}
        />
    );
}