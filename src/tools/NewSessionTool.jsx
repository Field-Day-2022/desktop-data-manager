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
        const formattedDate = `${
            sessionDate.getFullYear()
        }/${
            sessionDate.getMonth() + 1
        }/${
            sessionDate.getDate()
        }`
        const formattedTime = new Intl.DateTimeFormat('en-US', {
            timeStyle: 'medium',
            hourCycle: 'h24',
        }).format(sessionDate)
        const formattedDateTime = `${formattedDate} ${formattedTime}`
        console.log(`old date time: ${dateTime}`)
        console.log(`going from formatted dateTime back to seconds: ${new Date(formattedDateTime).getTime()}`)
        console.log(`the numbers ${dateTime === new Date(formattedDateTime).getTime() ? 'are' : 'are not'} equal`)
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