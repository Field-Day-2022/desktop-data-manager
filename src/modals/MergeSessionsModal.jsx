import { useState, useEffect } from 'react';
import InputLabel from '../components/InputLabel';
import Modal from '../components/Modal';
import InnerModalWrapper from './InnerModalWrapper';
import {
    getDocs,
    collection,
    query,
    updateDoc,
    doc,
    where,
    writeBatch,
    orderBy,
    deleteDoc,
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAtomValue } from 'jotai';
import { appMode, currentProjectName } from '../utils/jotai';
import { Type, notify } from '../components/Notifier';
import React from 'react';

export default function MergeSessionsModal({ showModal, closeModal }) {
    const [sessionOne, setSessionOne] = useState(null);
    const [sessionTwo, setSessionTwo] = useState(null);
    const [sessions, setSessions] = useState();
    const project = useAtomValue(currentProjectName);
    const environment = useAtomValue(appMode);

    const getSessionsFromFirestore = async () => {
        const collectionSnapshot = await getDocs(
            query(
                collection(db, `${environment === 'test' ? 'Test' : ''}${project}Session`),
                orderBy('dateTime', 'desc'),
            ),
        );
        setSessions(collectionSnapshot.docs);
    };

    useEffect(() => {
        if (showModal) getSessionsFromFirestore();
    }, [showModal]);

    const updateSessions = async (firstSession, lastSession) => {
        const firstSessionSnapshot = sessions.filter(
            (session) => session.data().dateTime === firstSession,
        )[0];
        const lastSessionSnapshot = sessions.filter(
            (session) => session.data().dateTime === lastSession,
        )[0];

        // Non-functional testing purposes only
        // console.log('firstSession to merge into:');
        // console.log(firstSessionSnapshot.data());
        // console.log('lastSession to merge out of and dispose:');
        // console.log(lastSessionSnapshot.data());

        const newCommentsAboutTheArray = `${firstSessionSnapshot.data().commentsAboutTheArray}; ${
            lastSessionSnapshot.data().commentsAboutTheArray
        }`;
        // Non-functional testing purposes only
        // console.log(
        //     `updating first session ${firstSessionSnapshot.id} to contain comments: ${newCommentsAboutTheArray}`,
        // );
        await updateDoc(
            doc(
                db,
                `${environment === 'test' ? 'Test' : ''}${project}Session`,
                firstSessionSnapshot.id,
            ),
            {
                commentsAboutTheArray: newCommentsAboutTheArray,
            },
        );
        // Non-functional testing purposes only
        // console.log(`deleting old session: ${lastSessionSnapshot.data().dateTime}`);
        await deleteDoc(
            doc(
                db,
                `${environment === 'test' ? 'Test' : ''}${project}Session`,
                lastSessionSnapshot.id,
            ),
        );
    };

    const updateSessionEntries = async (firstSessionDateTime, lastSessionDateTime) => {
        // Non-functional testing purposes only
        // console.log(lastSessionDateTime);
        // console.log(`${environment === 'test' ? 'Test' : ''}${project}Data`);
        const sessionDocuments = await getDocs(
            query(
                collection(db, `${environment === 'test' ? 'Test' : ''}${project}Data`),
                where('sessionDateTime', '==', lastSessionDateTime),
            ),
        );
        const batch = writeBatch(db);
        // Non-functional testing purposes only
        // console.log(
        //     `updating these documents from ${lastSessionDateTime} to ${firstSessionDateTime}`,
        // );
        // console.log(sessionDocuments);
        let firstSessionId = null;
        sessions.forEach((sessionDocument) => {
            // Non-functional testing purposes only
            // console.log(`comparing ${sessionDocument.data().dateTime} and ${firstSessionDateTime}`);
            if (sessionDocument.data().dateTime === firstSessionDateTime) {
                firstSessionId = sessionDocument.data().sessionId;
                // Non-functional testing purposes only
                // console.log('is equal, setting sessionId');
                return;
            }
        });
        sessionDocuments.forEach((document) => {
            batch.update(
                doc(db, `${environment === 'test' ? 'Test' : ''}${project}Data`, document.id),
                {
                    sessionDateTime: firstSessionDateTime,
                    dateTime: firstSessionDateTime,
                    sessionId: firstSessionId ?? new Date(firstSessionDateTime).getTime(),
                },
            );
        });
        await batch.commit();
        notify(Type.success, 'Selected sessions merged.');
        closeModal();
    };

    const mergeSessions = async () => {
        if (sessionOne === sessionTwo) {
            notify(Type.error, 'Selected sessions are the same, merge failed.');
            return;
        }

        const sessionOneSplit = sessionOne.split(' | ');
        const sessionTwoSplit = sessionTwo.split(' | ');

        if (
            sessionOneSplit[1] !== sessionTwoSplit[1] ||
            sessionOneSplit[2] !== sessionTwoSplit[2]
        ) {
            notify(
                Type.error,
                'Selected sessions must be of the same site and array, merge failed.',
            );
            return;
        }

        const firstSession =
            new Date(sessionOneSplit[0]).getTime() < new Date(sessionTwo).getTime()
                ? sessionOneSplit[0]
                : sessionTwoSplit[0];
        const lastSession =
            new Date(sessionOneSplit[0]).getTime() > new Date(sessionTwo).getTime()
                ? sessionOneSplit[0]
                : sessionTwoSplit[0];
        updateSessionEntries(firstSession, lastSession);
        updateSessions(firstSession, lastSession);
    };

    // Non-functional testing purposes only
    // useEffect(() => {
    //     sessions && sessions.forEach((entry) => console.log(entry.data()));
    // }, [sessions]);

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
                    okay: '',
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
                                                {documentSnapshot.data().dateTime +
                                                    ' | ' +
                                                    documentSnapshot.data().site +
                                                    ' | Array-' +
                                                    documentSnapshot.data().array}
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
                                                {documentSnapshot.data().dateTime +
                                                    ' | ' +
                                                    documentSnapshot.data().site +
                                                    ' | Array-' +
                                                    documentSnapshot.data().array}
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
