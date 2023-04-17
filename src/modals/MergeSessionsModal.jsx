import { useState, useEffect } from 'react';
import InputLabel from '../components/InputLabel';
import Modal from '../components/Modal';
import InnerModalWrapper from './InnerModalWrapper';
import { getDocs, collection, query, updateDoc, doc, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAtomValue } from 'jotai';
import { currentProjectName } from '../utils/jotai';
import { Type, notify } from '../components/Notifier';

export default function MergeSessionsModal({ showModal, closeModal }) {
    const [sessionOne, setSessionOne] = useState(null);
    const [sessionTwo, setSessionTwo] = useState(null);
    const [sessions, setSessions] = useState();
    const project = useAtomValue(currentProjectName);

    const getSessionsFromFirestore = async () => {
        const collectionSnapshot = await getDocs(collection(db, `Test${project}Session`));
        setSessions(collectionSnapshot.docs);
    };

    useEffect(() => {
        getSessionsFromFirestore();
    }, []);

    const copySessionCommentsFromLaterSessionToEarlierSession = async (
        firstSession,
        lastSession
    ) => {
        const firstSessionSnapshot = sessions.filter(
            (session) => new Date(session.data().dateTime).toLocaleString() === firstSession
        )[0];
        const lastSessionSnapshot = sessions.filter(
            (session) => new Date(session.data().dateTime).toLocaleString() === lastSession
        )[0];

        console.log(firstSessionSnapshot.data())
        console.log(lastSessionSnapshot.data())
                
        const newCommentsAboutTheArray = `${firstSessionSnapshot.data().commentsAboutTheArray}; ${
            lastSessionSnapshot.data().commentsAboutTheArray
        }`;
        // await updateDoc(doc(db, `Test${project}Session`, firstSessionSnapshot.id), {
        //     commentsAboutTheArray: newCommentsAboutTheArray
        // });
    };

    const updateSessionEntires =  async (firstSession, lastSession) => {
        const queryDate = new Date(lastSession).toISOString();
        const sessionDocuments = await getDocs(query(
            collection(db, `Test${project}Data`),
            where('sessionDateTime', '==', queryDate)
        ))
        sessionDocuments.forEach(document => console.log(document.data()))
    }

    const mergeSessions = async () => {
        if (sessionOne === sessionTwo) {
            notify(Type.error, 'Selected sessions are the same, merge failed');
            return;
        }
        const firstSession =
            new Date(sessionOne).getTime() < new Date(sessionTwo).getTime()
                ? sessionOne
                : sessionTwo;
        const lastSession =
            new Date(sessionOne).getTime() > new Date(sessionTwo).getTime()
                ? sessionOne
                : sessionTwo;
        copySessionCommentsFromLaterSessionToEarlierSession(
            firstSession,
            lastSession
        );
        updateSessionEntires(firstSession, lastSession);
    };

    return (
        <div>
            <Modal
                showModal={showModal}
                title="Merge Session Tool"
                text="Select sessions to merge (will move entries from later to earlier session and delete later session entry)"
                onCancel={() => closeModal()}
                onOkay={() => closeModal()}
                buttonOptions={{
                    cancel: 'Close',
                    okay: ''
                }}
            >
                <InnerModalWrapper>
                    {sessions && (
                        <div className="m-2">
                            <InputLabel
                                label="Session 1"
                                layout="vertical"
                                input={
                                    <select
                                        defaultValue="Select an option"
                                        onChange={(e) => setSessionOne(e.target.value)}
                                    >
                                        <option value="Select an option" disabled hidden>
                                            Select an option
                                        </option>
                                        {sessions.map((documentSnapshot) => (
                                            <option key={documentSnapshot.id}>
                                                {new Date(
                                                    documentSnapshot.data().dateTime
                                                ).toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                }
                            />
                            <InputLabel
                                label="Session 2"
                                layout="vertical"
                                input={
                                    <select
                                        defaultValue="Select an option"
                                        onChange={(e) => setSessionTwo(e.target.value)}
                                    >
                                        <option value="Select an option" disabled hidden>
                                            Select an option
                                        </option>
                                        {sessions.map((documentSnapshot) => (
                                            <option key={documentSnapshot.id}>
                                                {new Date(
                                                    documentSnapshot.data().dateTime
                                                ).toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                }
                            />
                            {sessionOne && sessionTwo && (
                                <button className="button mt-4" onClick={mergeSessions}>
                                    Merge
                                </button>
                            )}
                        </div>
                    )}
                </InnerModalWrapper>
            </Modal>
        </div>
    );
}
