import { useEffect } from "react";
import { useState } from "react";
import NewSessionForm from "../components/NewSessionForm";
import { getStandardizedDateTimeString } from "../utils/firestore";

export default function NewSessionTool({ setData, project, setProject }) {


    const [sessionData, setSessionData] = useState({
        dateTime: '',
        recorder: '',
        handler: '',
        site: '',
        array: '',
        noCaptures: '',
        trapStatus: '',
        commentsAboutTheArray: '',
        year: '',
    });

    const setField = (field, value) => {
        if (field === 'dateTime') {
            setDateTime(value);
            return;
        }
        setSessionData(sessionData => {
            if (field === 'project') {
                return ({
                    ...sessionData,
                    [field]: value,
                    site: '',
                    array: '',
                })
            }
            return ({
                ...sessionData,
                [field]: value
            })
        });
    }

    const setDateTime = (dateTime) => {
        const formattedDateTime = getStandardizedDateTimeString(dateTime)
        setSessionData({
            ...sessionData,
            dateTime: formattedDateTime,
            year: new Date(dateTime).getFullYear(),
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