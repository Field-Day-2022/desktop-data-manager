import { useEffect } from "react";
import { useState } from "react";
import NewSessionForm from "../components/NewSessionForm";

export default function NewSessionTool({ setData }) {

    const [project, setProject] = useState('Gateway');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const [sessionData, setSessionData] = useState({
        dateTime: '',
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
        if (field === 'time') {
            setTime(value);
            setDateTime(date, value)
            return;
        } else if (field === 'date') {
            setDate(value);
            setDateTime(value, time);
            return;
        }
        setSessionData({
            ...sessionData,
            [field]: value
        });
    }

    const setDateTime = (date, time) => {
        setSessionData({
            ...sessionData,
            dateTime: `${date} ${time}`,
            year: date.split('-')[0]
        })
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