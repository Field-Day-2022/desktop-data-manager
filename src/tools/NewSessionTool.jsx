import { useEffect } from "react";
import { useState } from "react";
import NewSessionForm from "../components/NewSessionForm";

export default function NewSessionTool({ setData }) {

    const [project, setProject] = useState('Gateway');

    const [sessionData, setSessionData] = useState({
        dateTime: '2021-01-01T00:00:00.000Z',
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
        setSessionData({
            ...sessionData,
            dateTime: dateTime,
            year: dateTime.split('-')[0]
        });
    }

    useEffect(() => {
        setData(sessionData);
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