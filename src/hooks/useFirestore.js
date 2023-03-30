import {
    arrayUnion,
    deleteDoc,
    doc,
    updateDoc,
    setDoc,
} from 'firebase/firestore'
import { db } from '../utils/firebase'
import { notify, Type } from '../components/Notifier'

export const useFirestore = () => {
    const deleteDocumentFromFirestore = async (
        entrySnapshot
    ) => {
        await deleteDoc(
            doc(db, entrySnapshot.ref.parent.id, entrySnapshot.id)
        ).then(() => {
            notify(Type.success, 'Document successfully deleted!');
        }).catch((e) => {
            notify(Type.error, `Error deleting document: ${e}`);
        });
        if (entrySnapshot.data().taxa === 'Lizard')
            updateLizardMetadata( 'delete', { entrySnapshot } );
    }

    const updateLizardMetadata = async (
        operation,
        operationDataObject
    ) => {
        if (operation === 'change') {

        } else if (operation === 'add') {

        } else if (operation === 'delete') {
            const { entrySnapshot } = operationDataObject;
            await updateDoc(
                doc(db, 'Metadata', 'LizardData'), 
                {
                    deletedEntries: arrayUnion({
                        entryId: entrySnapshot.id,
                        collectionId: entrySnapshot.ref.parent.id
                    })
                }
            ).then(() => {
                notify(Type.success, 'Sent deletion to the PWA');
            }).catch((e) => {
                notify(Type.error, `Error sending deletion to PWA: ${e}`);
            });
        }
    }

    const pushEntryChangesToFirestore = async (
        entrySnapshot,
        entryData,
    ) => {
        await setDoc(
            doc(db, entrySnapshot.ref.parent.id, entrySnapshot.id),
            entryData
        ).then(() => {
            notify(Type.success, 'Changes successfully written to database!');
        }).catch((e) => {
            notify(Type.error, `Error writing changes to database: ${e}`);
        });
    };

    const startEntryOperation = (
        operationName,
        operationData,
    ) => {
        operationData.setEntryUIState('viewing');
        if (operationName === 'uploadEntryEdits') {
            pushEntryChangesToFirestore(
                operationData.entrySnapshot, 
                operationData.entryData
            )
        } else if (operationName === 'deleteEntry') {
            operationData.removeEntryFromUI();
            deleteDocumentFromFirestore(operationData.entrySnapshot)
        }
    }


    return {
        startEntryOperation
    }
}