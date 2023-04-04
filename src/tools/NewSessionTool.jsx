import { useEffect } from "react";
import { useState } from "react";
import NewSessionForm from "../components/NewSessionForm";

export default function NewSessionTool({ setData }) {

    const [project, setProject] = useState('Gateway');

    const [sessionData, setSessionData] = useState({
        date: '',
        time: '',
        dateTime: '',
        recorder: '',
        handler: '',
        site: 'GWA1',
        array: '',
        noCaptures: '',
        trapStatus: 'OPEN',
        commentsAboutTheArray: '',
        year: '',
    });

    const setField = (field, value) => {
        if (field === 'time') {
            setTime(value);
            return;
        } else if (field === 'date') {
            setDate(value);
            return;
        }
        setSessionData({
            ...sessionData,
            [field]: value
        });
    }

    const setTime = (time) => {
        setSessionData({
            ...sessionData,
            time: time,
            dateTime: sessionData.date + ' ' + time
        })
    }

    const setDate = (date) => {
        setSessionData({
            ...sessionData,
            date: date,
            dateTime: date + ' ' + sessionData.time,
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