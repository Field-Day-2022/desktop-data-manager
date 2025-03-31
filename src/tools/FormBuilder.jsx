import { useState, useEffect } from 'react';
import { collection, getDocs, doc, addDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { updateDoc } from 'firebase/firestore';
import { query, where } from 'firebase/firestore';
import Button from '../components/Button';
import React from 'react';

export default function FormBuilder({ triggerRerender, modalStep, setModalStep }) {
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [dataOptions, setDataOptions] = useState([]);
    const [selectedData, setSelectedData] = useState('');
    const [editData, setEditData] = useState({});
    const [editModalVisible, setEditModalVisible] = useState(false);

    // New Document Creation Modal state
    const [showNewDocumentModal, setShowNewDocumentModal] = useState(false);
    const [newAnswerSetName, setNewAnswerSetName] = useState('');
    const [arrayOptions, setArrayOptions] = useState([]);
    const [selectedArray, setSelectedArray] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [primaryFields, setPrimaryFields] = useState([]);
    const [showAddSiteModal, setShowAddSiteModal] = useState(false);
    const [newSiteName, setNewSiteName] = useState('');
    const setSites = [];
    const [refreshSites, setRefreshSites] = useState(false);
    const [showViewSites, setShowViewSites] = useState(false);
    const [showAddSiteForm, setShowAddSiteForm] = useState(false);
    const [selectedProject, setSelectedProject] = useState('');
    const [siteOptions, setSiteOptions] = useState([]);

    const [refreshSpecies, setRefreshSpecies] = useState(false);
    const [showAddSpeciesModal, setShowAddSpeciesModal] = useState(false);
    const [showAddSpeciesForm, setShowAddSpeciesForm] = useState(false);
    const [selectedCritter, setSelectedCritter] = useState('');
    const [existingArrays, setExistingArrays] = useState([]);
    const [message, setMessage] = useState('');
    const [showExistingArrays, setShowExistingArrays] = useState(false);

    const [newPrimary, setNewPrimary] = useState('');
    const [newGenus, setNewGenus] = useState('');
    const [newSpecies, setNewSpecies] = useState('');
    const [showAddArrayModal, setShowAddArrayModal] = useState(false);
    const [newArrayName, setNewArrayName] = useState('');
    const [primaryValues, setPrimaryValues] = useState([]);
    const [newPrimaryValue, setNewPrimaryValue] = useState('');
    const [messageBox, setMessageBox] = useState({ show: false, text: '' });
    const [selectedSite, setSelectedSite] = useState('');

    useEffect(() => {
        if (modalStep === 3) fetchDocuments();
    }, [modalStep]);

    useEffect(() => {
        if (refreshSites) {
            fetchSites();
            setRefreshSites(false);
        }
    }, [refreshSites]);

    useEffect(() => {
        if (refreshSpecies) {
            fetchSpecies();
            setRefreshSpecies(false);
        }
    }, [refreshSpecies]);

    const handleCritterSelection = (critterName) => {
        setSelectedCritter(critterName);
    };

    const fetchDocuments = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'AnswerSet'));
            const tempDocuments = [];
            const tempArrayOptions = [];

            querySnapshot.forEach((docSnapshot) => {
                const docData = docSnapshot.data();
                tempDocuments.push({ ...docData, docId: docSnapshot.id });
                if (docData.set_name && docData.set_name.endsWith('Array')) {
                    tempArrayOptions.push({
                        name: docData.set_name,
                        docId: docSnapshot.id,
                    });
                }
            });

            setDocuments(tempDocuments);
            setArrayOptions(tempArrayOptions);
            console.log('Fetched Documents:', tempDocuments);
            console.log('Array Options for Dropdown:', tempArrayOptions);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const handleDeleteArrayClick = async () => {
        if (arrayOptions.length === 0) {
            await fetchDocuments();
        }
        setShowDeleteConfirm(true);
    };
    const confirmDeleteArray = async () => {
        console.log('Selected values:', {
            selectedProject,
            selectedSite,
            selectedArray,
        });

        if (!selectedProject || !selectedSite || !selectedArray) {
            setMessageBox({ show: true, text: 'Please select a project, site, and array.' });
            return;
        }

        try {
            const arraySetName = `${selectedProject}${selectedSite}Array`;

            const q = query(collection(db, 'AnswerSet'), where('set_name', '==', arraySetName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docSnapshot = querySnapshot.docs[0];
                const docRef = doc(db, 'AnswerSet', docSnapshot.id);
                const data = docSnapshot.data();

                const updatedAnswers = data.answers.filter(
                    (entry) => entry.primary !== selectedArray,
                );

                await updateDoc(docRef, { answers: updatedAnswers });

                // Update UI
                setPrimaryFields(updatedAnswers.map((entry) => entry.primary));
                setSelectedArray(null);
                setMessageBox({
                    show: true,
                    text: `Array "${selectedArray}" deleted successfully.`,
                });
            } else {
                console.error(`No document found for set_name: ${arraySetName}`);
                setMessageBox({ show: true, text: `No document found for ${arraySetName}` });
            }
        } catch (error) {
            console.error('Error deleting array:', error);
            setMessageBox({ show: true, text: 'Failed to delete the array. Please try again.' });
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    const fetchArraysForSite = async (projectName, siteName) => {
        const arraySetName = `${projectName}${siteName}Array`;

        try {
            const q = query(collection(db, 'AnswerSet'), where('set_name', '==', arraySetName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docSnapshot = querySnapshot.docs[0];
                const data = docSnapshot.data();

                const primaryValues = (data.answers || []).map((answer) => answer.primary);
                setPrimaryFields(primaryValues); // Update primary fields
                console.log('Primary Values:', primaryValues);
            } else {
                console.error(`No document found for set_name: ${arraySetName}`);
                setPrimaryFields([]); // Clear options
            }
        } catch (error) {
            console.error(`Error fetching arrays for site ${siteName}:`, error);
            setPrimaryFields([]);
        }
    };

    const renderDeleteArrayModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-neutral-900 dark:text-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-bold mb-4">Delete Options</h2>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4 text-center">
                    Select a project and site to delete the associated array.
                </p>

                {/* Project Dropdown */}
                <label className="block mb-2 font-medium">Select Project:</label>
                <select
                    value={selectedProject}
                    onChange={(e) => {
                        handleProjectSelection(e.target.value);
                        setSelectedProject(e.target.value);
                        console.log('Project Selected:', e.target.value);
                    }}
                    className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                >
                    <option value="">Select a Project</option>
                    <option value="Gateway">Gateway</option>
                    <option value="San Pedro">San Pedro</option>
                    <option value="Virgin River">Virgin River</option>
                </select>

                {/* Conditional Site Dropdown */}
                {selectedProject && (
                    <>
                        <label className="block mb-2 font-medium">Select Site:</label>
                        <select
                            value={selectedSite}
                            onChange={(e) => handleSiteSelection(e.target.value)} // Use handleSiteSelection here
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                        >
                            <option value="">Select a Site</option>
                            {siteOptions.map((site, index) => (
                                <option key={index} value={site}>
                                    {site}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {/* Array Dropdown */}
                {selectedSite && (
                    <>
                        {primaryFields.length > 0 ? (
                            <>
                                <label className="block mb-2 font-medium">
                                    Select an Array to delete:
                                </label>
                                <select
                                    value={selectedArray || ''}
                                    onChange={(e) => setSelectedArray(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                                >
                                    <option value=""></option>
                                    {primaryFields.map((field, index) => (
                                        <option key={index} value={field}>
                                            {field}
                                        </option>
                                    ))}
                                </select>
                            </>
                        ) : (
                            <p>No Arrays Available</p>
                        )}
                    </>
                )}

                {/* Delete Button */}
                <div className="flex justify-end space-x-2">
                    <Button
                        onClick={() => {
                            setShowDeleteConfirm(false);
                            setSelectedProject('');
                            setSelectedSite('');
                            setSelectedArray('');
                        }}
                        text="Cancel"
                        className="bg-red text-white px-4 py-2 rounded"
                    />
                    <Button
                        onClick={confirmDeleteArray}
                        text="Delete Array"
                        className="bg-red text-white px-6 py-3 rounded w-full"
                        disabled={!selectedProject || !selectedSite || !selectedArray}
                    />
                </div>
            </div>
        </div>
    );

    const handleSiteSelection = (siteName) => {
        setSelectedSite(siteName);
        if (selectedProject && siteName) {
            fetchArraysForSite(selectedProject, siteName);
        }
    };

    const handleAddArrayClick = () => {
        setShowAddArrayModal(true);
    };

    const handleDocumentClick = (doc) => {
        setSelectedDocument(doc);
        const availableDataOptions = doc.answers ? doc.answers.map((answer) => answer.primary) : [];
        setDataOptions(availableDataOptions);

        if (availableDataOptions.length > 0) {
            setSelectedData(availableDataOptions[0]);
            handleDataSelection(availableDataOptions[0]);
        } else {
            setEditData({});
        }

        setEditModalVisible(true);
    };

    const handleDataSelection = (data) => {
        const selectedAnswer = selectedDocument.answers.find((answer) => answer.primary === data);

        // If the selected document's name ends with "Species", set genus and species separately
        if (selectedDocument.set_name.endsWith('Species') && selectedAnswer) {
            setEditData({
                primary: selectedAnswer.primary,
                genus: selectedAnswer.secondary?.Genus || '',
                species: selectedAnswer.secondary?.Species || '',
            });
        } else {
            setEditData(selectedAnswer || {});
        }
    };

    const handleEditChange = (key, value) => {
        setEditData((prevEditData) => ({
            ...prevEditData,
            [key]: value,
        }));
    };

    const renderEditDataFields = () => {
        if (!editData || Object.keys(editData).length === 0) {
            return <p>No data available to edit.</p>;
        }

        if (selectedDocument && selectedDocument.set_name.endsWith('Species')) {
            return (
                <div>
                    <div className="flex flex-col">
                        <label className="text-md">Primary</label>
                        <input
                            type="text"
                            className="border p-2 rounded"
                            value={editData.primary}
                            onChange={(e) => handleEditChange('primary', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-md">Genus</label>
                        <input
                            type="text"
                            className="border p-2 rounded"
                            value={editData.genus}
                            onChange={(e) => handleEditChange('genus', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-md">Species</label>
                        <input
                            type="text"
                            className="border p-2 rounded"
                            value={editData.species}
                            onChange={(e) => handleEditChange('species', e.target.value)}
                        />
                    </div>
                </div>
            );
        }
        return Object.entries(editData).map(([key, value]) => (
            <div key={key} className="flex flex-col">
                <label className="text-md">{key}</label>
                <input
                    type="text"
                    className="border p-2 rounded"
                    value={value}
                    onChange={(e) => handleEditChange(key, e.target.value)}
                />
            </div>
        ));
    };

    const submitChanges = async () => {
        if (selectedDocument && selectedData) {
            try {
                const docRef = doc(db, 'AnswerSet', selectedDocument.docId);

                const updatedAnswers =
                    selectedDocument.answers?.map((answer) => {
                        if (answer.primary === selectedData) {
                            const updatedAnswer = {
                                primary: editData.primary || answer.primary,
                            };

                            // Add secondary fields only if the document is a species document
                            if (selectedDocument.set_name.endsWith('Species')) {
                                updatedAnswer.secondary = {
                                    Genus: editData.genus || answer.secondary?.Genus || '',
                                    Species: editData.species || answer.secondary?.Species || '',
                                };
                            }

                            return updatedAnswer;
                        }
                        return answer;
                    }) || [];

                await updateDoc(docRef, {
                    answers: updatedAnswers,
                });

                console.log(
                    `Document ${selectedDocument.set_name} updated successfully in Firebase.`,
                );
                triggerRerender();

                // Close the edit modal after saving
                setEditModalVisible(false);
            } catch (error) {
                console.error('Error updating document in Firebase:', error);
                alert('Failed to update the document.');
            }
        } else {
            alert('Please select a document and data to update.');
        }
    };

    const handleSubmitNewArray = async () => {
        if (newAnswerSetName.trim() === '' || primaryValues.length === 0) {
            setMessageBox({
                show: true,
                text: 'Please provide a document name and at least one primary value.',
            });
            return;
        }

        try {
            // Check if the document name already exists
            const q = query(
                collection(db, 'AnswerSet'),
                where('set_name', '==', newAnswerSetName.trim()),
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setMessageBox({
                    show: true,
                    text: `Document "${newAnswerSetName.trim()}" already exists. Please use a different name.`,
                });
                return;
            }

            // Proceed with document creation if the name does not exist
            await addDoc(collection(db, 'AnswerSet'), {
                set_name: newAnswerSetName.trim(),
                answers: primaryValues.map((value) => ({ primary: value })), // Store as primary fields
                date_modified: Date.now(),
            });

            setMessageBox({ show: true, text: 'Document created successfully!' });

            // Reset form fields
            setNewAnswerSetName('');
            setPrimaryValues([]);
            setShowNewDocumentModal(false);
            triggerRerender();
        } catch (error) {
            console.error('Error adding new document:', error);
            setMessageBox({ show: true, text: 'Failed to create the document. Please try again.' });
        }
    };

    const handleAddSite = () => {
        setShowAddSiteModal(true); // Open the "Add Site" modal
        setShowAddSiteForm(false); // Reset to not show the form initially
        setShowViewSites(false); // Reset to not show the view list initially
        setSelectedProject(''); // Reset the project selection
    };

    const handleAddSpecies = () => {
        setShowAddSpeciesModal(true);
        setShowAddSpeciesForm(false);
        setSelectedProject('');
        setSelectedCritter('');
    };

    const fetchSites = async () => {
        try {
            const sitesSnapshot = await getDocs(collection(db, 'Sites')); // Ensure 'Sites' is the correct collection name
            const siteList = sitesSnapshot.docs.map((doc) => doc.data().name);
            setSites(siteList);
        } catch (error) {
            console.error('Error fetching sites:', error);
        }
    };

    const fetchSitesForProject = async (projectName) => {
        const projectSetName = `${projectName}Sites`; // Construct the value to match in the `set_name` field

        try {
            // Query the AnswerSet collection to find the document with set_name equal to projectSetName
            const q = query(collection(db, 'AnswerSet'), where('set_name', '==', projectSetName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docSnapshot = querySnapshot.docs[0]; // Assuming there's only one document per project

                const data = docSnapshot.data();
                const answers = data.answers || {}; // Retrieve answers map
                const siteNames = Object.values(answers).map((entry) => entry.primary); // Extract primary fields

                setSiteOptions(siteNames); // Populate site options with primary field values
                console.log(`Fetched sites for project ${projectName}:`, siteNames);
            } else {
                console.error(
                    `Document with set_name ${projectSetName} does not exist in the AnswerSet collection.`,
                );
                setSiteOptions([]); // Clear sites if no matching document is found
            }
        } catch (error) {
            console.error(`Error fetching sites for project ${projectName}:`, error);
        }
    };

    const handleProjectSelection = (projectName) => {
        setSelectedProject(projectName);
        fetchSitesForProject(projectName); // Populate site options for the selected project
    };

    const renderExistingSites = () => {
        return (
            <ul className="space-y-2">
                {siteOptions.map((site, index) => (
                    <li key={index} className="text-black-800">
                        {site}
                    </li>
                ))}
            </ul>
        );
    };

    const addNewSite = async () => {
        if (selectedProject && newSiteName.trim()) {
            if (siteOptions.includes(newSiteName.trim())) {
                setMessageBox({
                    show: true,
                    text: 'This site already exists. Please choose a different name.',
                });
                return;
            }

            try {
                const projectSetName = `${selectedProject}Sites`; // Construct the document identifier

                // Query to find the specific document in the AnswerSet collection
                const q = query(
                    collection(db, 'AnswerSet'),
                    where('set_name', '==', projectSetName),
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docSnapshot = querySnapshot.docs[0]; // Get the first matching document
                    const docRef = doc(db, 'AnswerSet', docSnapshot.id); // Reference to the correct document

                    // Update the `answers` field with the new site name
                    await updateDoc(docRef, {
                        answers: [...docSnapshot.data().answers, { primary: newSiteName.trim() }],
                    });

                    setMessageBox({ show: true, text: 'New site added successfully!' });
                    setNewSiteName(''); // Clear input field
                    fetchSitesForProject(selectedProject); // Refresh site list to include the new site
                } else {
                    setMessageBox({
                        show: true,
                        text: `Document with set_name ${projectSetName} does not exist.`,
                    });
                }
            } catch (error) {
                console.error(`Error adding new site to ${selectedProject}:`, error);
                setMessageBox({ show: true, text: 'Failed to add the site. Please try again.' });
            }
        } else {
            setMessageBox({ show: true, text: 'Please select a project and enter a site name.' });
        }
    };

    const addNewSpecies = async () => {
        if (
            selectedProject &&
            selectedCritter &&
            newPrimary.trim() &&
            newGenus.trim() &&
            newSpecies.trim()
        ) {
            try {
                const projectSetName = `${selectedProject}${selectedCritter}Species`;
                const q = query(
                    collection(db, 'AnswerSet'),
                    where('set_name', '==', projectSetName),
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docSnapshot = querySnapshot.docs[0];
                    const docRef = doc(db, 'AnswerSet', docSnapshot.id);
                    const existingSpecies = docSnapshot.data().answers || [];

                    // Convert inputs to lowercase for case-insensitive comparison
                    const enteredGenus = newGenus.trim().toLowerCase();
                    const enteredSpecies = newSpecies.trim().toLowerCase();
                    const enteredCode = newPrimary.trim().toUpperCase();

                    // Check if the genus-species combination already exists
                    const isDuplicateCombo = existingSpecies.some(
                        (entry) =>
                            entry.secondary?.Genus?.toLowerCase() === enteredGenus &&
                            entry.secondary?.Species?.toLowerCase() === enteredSpecies,
                    );

                    // Check if the 4-letter code already exists
                    const isDuplicateCode = existingSpecies.some(
                        (entry) => entry.primary.toUpperCase() === enteredCode,
                    );

                    // Prioritize the message for duplicate 4-letter code
                    if (isDuplicateCode) {
                        setMessageBox({
                            show: true,
                            text: 'The entered 4-letter code already exists. Please use a different code.',
                        });
                        return;
                    }

                    // Show genus-species combination message only if the code doesn't exist
                    if (isDuplicateCombo) {
                        setMessageBox({
                            show: true,
                            text: 'This Genus-Species combination already exists. Please enter a unique pair.',
                        });
                        return;
                    }

                    // Proceed to add new species if both checks pass
                    const newEntry = {
                        primary: enteredCode,
                        secondary: {
                            Genus: newGenus.trim(),
                            Species: newSpecies.trim(),
                        },
                    };

                    await updateDoc(docRef, {
                        answers: [...existingSpecies, newEntry],
                    });

                    console.log(`Species "${newPrimary}" added to ${projectSetName} successfully.`);
                    setMessageBox({ show: true, text: 'Species added successfully!' });

                    // Reset input fields
                    setNewPrimary('');
                    setNewGenus('');
                    setNewSpecies('');
                    setShowAddSpeciesForm(false);
                    setShowAddSpeciesModal(false);
                    triggerRerender();
                } else {
                    setMessageBox({
                        show: true,
                        text: `Document for ${projectSetName} does not exist.`,
                    });
                }
            } catch (error) {
                console.error(`Error adding new species to ${selectedProject}:`, error);
                setMessageBox({ show: true, text: 'Failed to add the species.' });
            }
        } else {
            setMessageBox({
                show: true,
                text: 'Please select a project, taxa, and enter all species details.',
            });
        }
    };

    const handleAddPrimaryValue = () => {
        if (newPrimaryValue.trim() !== '') {
            setPrimaryValues([...primaryValues, newPrimaryValue.trim()]);
            setNewPrimaryValue('');
        }
    };

    const fetchExistingArrays = async () => {
        if (!selectedProject || !selectedSite) {
            setMessage('Please select both project and site.');
            return;
        }

        const arraySetName = `${selectedProject}${selectedSite}Array`;

        try {
            const q = query(collection(db, 'AnswerSet'), where('set_name', '==', arraySetName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docSnapshot = querySnapshot.docs[0];
                const data = docSnapshot.data();
                const primaryValues = data.answers.map((entry) => entry.primary);
                setExistingArrays(primaryValues);
                setShowExistingArrays(true);
                setMessage('');
            } else {
                setExistingArrays([]);
                setMessage(`No existing arrays found for ${selectedProject} - ${selectedSite}`);
            }
        } catch (error) {
            console.error('Error fetching existing arrays:', error);
            setMessage('Error fetching existing arrays.');
        }
    };

    const handleAddNewArray = async () => {
        if (!newArrayName.trim()) {
            setMessageBox({ show: true, text: 'Please enter an array name.' });
            return;
        }

        if (existingArrays.includes(newArrayName.trim())) {
            setMessageBox({
                show: true,
                text: 'This array name already exists. Please choose a different name.',
            });
            return;
        }

        try {
            const arraySetName = `${selectedProject}${selectedSite}Array`;
            const q = query(collection(db, 'AnswerSet'), where('set_name', '==', arraySetName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docSnapshot = querySnapshot.docs[0];
                const docRef = doc(db, 'AnswerSet', docSnapshot.id);

                await updateDoc(docRef, {
                    answers: [...docSnapshot.data().answers, { primary: newArrayName.trim() }],
                });

                setExistingArrays([...existingArrays, newArrayName.trim()]);
                setNewArrayName('');
                setMessageBox({ show: true, text: 'Array added successfully!' });
                setShowExistingArrays(true);
            } else {
                setMessageBox({ show: true, text: `No document found for ${arraySetName}` });
            }
        } catch (error) {
            console.error('Error adding new array:', error);
            setMessageBox({ show: true, text: 'Error adding array. Please try again.' });
        }
    };

    const renderModalContent = () => {
        switch (modalStep) {
            case 1:
                return (
                    <div className="p-6 bg-white dark:bg-neutral-900 rounded-lg flex flex-col items-center">
                        <h2 className="text-xl font-bold mb-4">Collection</h2>
                        <Button
                            onClick={() => setModalStep(2)}
                            text="AnswerSet"
                            className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center mb-4 w-full"
                        />
                        <Button
                            onClick={handleAddArrayClick}
                            text="Add Array"
                            className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center mb-4 w-full"
                        />
                        <Button
                            onClick={handleDeleteArrayClick}
                            text="Delete Array"
                            className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center mb-4 w-full"
                        />
                        <Button
                            onClick={handleAddSite}
                            text="Add Site"
                            className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center mb-4 w-full"
                        />
                        <Button
                            onClick={handleAddSpecies}
                            text="Add Species"
                            className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center w-full"
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="p-6 bg-white dark:bg-neutral-900 rounded-lg flex flex-col items-center">
                        <h2 className="text-xl font-bold mb-4">Document Options</h2>
                        <p className="text-grey-600 dark:text-neutral-400 mb-4 text-center">
                            Please select one of the options below to modify or create a new
                            document. Use the "Modify Existing Document" option to edit, or the
                            "Create New Document" option to start a new document.
                        </p>
                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            <Button
                                onClick={() => setModalStep(3)}
                                text="Modify Existing Document"
                                className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center px-6 py-3 rounded w-full"
                            />
                            <Button
                                onClick={() => setShowNewDocumentModal(true)}
                                text="Create New Document"
                                className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center px-6 py-3 rounded w-full"
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div
                        className="p-6 bg-white dark:bg-neutral-900 rounded-lg overflow-y-auto"
                        style={{ maxHeight: '300px' }}
                    >
                        <h2 className="text-xl font-bold mb-4">Modify Document</h2>
                        <ul className="space-y-2">
                            {documents
                                .slice() // Make a copy to avoid mutating the original array
                                .sort((a, b) => (a.set_name || '').localeCompare(b.set_name || '')) // Sort alphabetically by set_name
                                .map((doc, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => handleDocumentClick(doc)}
                                        text={doc.set_name || `Document ${index + 1}`}
                                        className="bg-white text-black dark:bg-neutral-700 dark:text-white border border-black px-4 py-2 rounded hover:bg-neutral-400 dark:hover:bg-gray-800 w-full"
                                    />
                                ))}
                        </ul>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex justify-center items-center bg-white dark:bg-neutral-900 overflow-hidden">
            <div className="w-[600px] max-h-[400px] bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-4 overflow-hidden">
                {renderModalContent()}
            </div>

            {showDeleteConfirm && renderDeleteArrayModal()}
            {/* Add Site Options Modal */}
            {showAddSiteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4">Site Options</h2>
                        {/* Project Selection Dropdown */}
                        <label className="block mb-2 font-medium">Select Project:</label>
                        <select
                            value={selectedProject}
                            onChange={(e) => handleProjectSelection(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                        >
                            <option value="">Select a Project</option>
                            <option value="Gateway">Gateway</option>
                            <option value="San Pedro">San Pedro</option>
                            <option value="Virgin River">Virgin River</option>
                        </select>

                        {/* Conditional buttons displayed after project selection */}
                        {selectedProject && (
                            <>
                                <Button
                                    onClick={() => {
                                        setShowViewSites(true);
                                        setShowAddSiteForm(false);
                                        fetchSitesForProject(selectedProject);
                                    }}
                                    text="View Existing Sites"
                                    className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center w-full mb-2"
                                />
                                <Button
                                    onClick={() => {
                                        setShowAddSiteForm(true);
                                        setShowViewSites(false);
                                    }}
                                    text="Add New Site"
                                    className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center w-full mb-4"
                                />
                            </>
                        )}

                        <Button
                            onClick={() => setShowAddSiteModal(false)}
                            text="Close"
                            className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center "
                        />
                    </div>
                </div>
            )}

            {/* View Sites Modal */}
            {showViewSites && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4">
                            Existing Sites for {selectedProject}
                        </h2>
                        {renderExistingSites()}
                        <Button
                            onClick={() => setShowViewSites(false)}
                            text="Close"
                            className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center mt-4"
                        />
                    </div>
                </div>
            )}

            {/* New Document Modal */}
            {showNewDocumentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4">Create New Document</h2>

                        {/* Document Name Input */}
                        <label className="block mb-2 font-medium">Document Name:</label>
                        <input
                            type="text"
                            value={newAnswerSetName}
                            onChange={(e) => setNewAnswerSetName(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                            placeholder="e.g. GatewayGWA6Array"
                        />

                        {/* Primary Values Input */}
                        <label className="block mb-2 font-medium">Primary Values:</label>
                        {primaryValues.map((value, index) => (
                            <p key={index} className="ml-2 mb-2 text-gray-700">
                                - {value}
                            </p>
                        ))}
                        <input
                            type="text"
                            value={newPrimaryValue}
                            onChange={(e) => setNewPrimaryValue(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                            placeholder="Enter primary value"
                        />
                        <Button
                            onClick={handleAddPrimaryValue}
                            text="Add Primary Value"
                            className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center mb-2 w-full"
                        />

                        {/* Submit and Cancel Buttons */}
                        <Button
                            onClick={handleSubmitNewArray}
                            text="Submit"
                            className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center mb-2 w-full"
                        />
                        <Button
                            onClick={() => setShowNewDocumentModal(false)}
                            text="Cancel"
                            className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center w-full"
                        />
                    </div>
                </div>
            )}

            {editModalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4">Data</h2>
                        <select
                            className="mb-4 p-2 border rounded w-full"
                            value={selectedData}
                            onChange={(e) => {
                                setSelectedData(e.target.value);
                                handleDataSelection(e.target.value);
                            }}
                        >
                            {dataOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <h3 className="text-lg font-bold mb-2">Edit Data</h3>
                        {renderEditDataFields()}
                        <div className="flex justify-end mt-4 space-x-2">
                            <Button
                                onClick={() => setEditModalVisible(false)}
                                text="Cancel"
                                className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center"
                            />
                            <Button
                                onClick={submitChanges}
                                text="Save"
                                className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center"
                            />
                        </div>
                    </div>
                </div>
            )}

            {showAddSiteForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4">Enter New Site</h2>

                        <input
                            type="text"
                            value={newSiteName}
                            onChange={(e) => {
                                setNewSiteName(e.target.value);
                                setMessageBox({ show: false, text: '' }); // Clear message box on input change
                            }}
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                            placeholder="Enter site name"
                        />

                        <div className="flex justify-end space-x-2">
                            <Button
                                onClick={() => {
                                    setShowAddSiteForm(false);
                                    setNewSiteName(''); // Clear input field on cancel
                                    setMessageBox({ show: false, text: '' });
                                }}
                                text="Cancel"
                                className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center"
                            />
                            <Button
                                onClick={async () => {
                                    if (newSiteName.trim()) {
                                        if (siteOptions.includes(newSiteName.trim())) {
                                            setMessageBox({
                                                show: true,
                                                text: 'This site already exists. Please choose a different name.',
                                            });
                                            return;
                                        }
                                        await addNewSite();
                                        setNewSiteName('');
                                        setShowAddSiteForm(false);
                                        setShowAddSiteModal(false);
                                    } else {
                                        setMessageBox({
                                            show: true,
                                            text: 'Please enter a site name.',
                                        });
                                    }
                                }}
                                text="Add Site"
                                className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Add Species Modal */}
            {showAddSpeciesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4">Species Options</h2>
                        <label className="block mb-2 font-medium">Select Project:</label>
                        <select
                            value={selectedProject}
                            onChange={(e) => handleProjectSelection(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                        >
                            <option value="">Select a Project</option>
                            <option value="Gateway">Gateway</option>
                            <option value="San Pedro">San Pedro</option>
                            <option value="Virgin River">Virgin River</option>
                        </select>

                        <label className="block mb-2 font-medium">Select Taxa:</label>
                        <select
                            value={selectedCritter}
                            onChange={(e) => handleCritterSelection(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                        >
                            <option value="">Select a Taxa</option>
                            <option value="Lizard">Lizard</option>
                            <option value="Mammal">Mammal</option>
                            <option value="Snake">Snake</option>
                            <option value="Amphibian">Amphibian</option>
                            <option value="Turtle">Turtle</option>
                        </select>

                        {selectedProject && selectedCritter && (
                            <>
                                <Button
                                    onClick={() => setShowAddSpeciesForm(true)}
                                    text="Add New Species"
                                    className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center mb-2"
                                />
                            </>
                        )}

                        <Button
                            onClick={() => setShowAddSpeciesModal(false)}
                            text="Close"
                            className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center"
                        />
                    </div>
                </div>
            )}

            {showAddSpeciesForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4">Enter New Species</h2>
                        <input
                            type="text"
                            value={newPrimary}
                            onChange={(e) => setNewPrimary(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                            placeholder="4-letter code"
                        />
                        <input
                            type="text"
                            value={newGenus}
                            onChange={(e) => setNewGenus(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                            placeholder="Genus"
                        />
                        <input
                            type="text"
                            value={newSpecies}
                            onChange={(e) => setNewSpecies(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                            placeholder="Species"
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                onClick={() => setShowAddSpeciesForm(false)}
                                text="Cancel"
                                className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center"
                            />
                            <Button
                                onClick={addNewSpecies}
                                text="Add Species"
                                className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center"
                            />
                        </div>
                    </div>
                </div>
            )}
            {messageBox.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            {messageBox.text}
                        </p>
                        <button
                            onClick={() => setMessageBox({ show: false, text: '' })}
                            className="bg-asu-maroon text-white px-4 py-2 border border-white rounded hover:bg-maroon-700"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {showAddArrayModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4">Manage Arrays</h2>

                        {/* Project Dropdown */}
                        <label className="block mb-2 font-medium">Select Project:</label>
                        <select
                            value={selectedProject}
                            onChange={(e) => {
                                handleProjectSelection(e.target.value);
                                setSelectedProject(e.target.value);
                            }}
                            className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                        >
                            <option value="">Select a Project</option>
                            <option value="Gateway">Gateway</option>
                            <option value="San Pedro">San Pedro</option>
                            <option value="Virgin River">Virgin River</option>
                        </select>

                        {/* Site Dropdown */}
                        {selectedProject && (
                            <>
                                <label className="block mb-2 font-medium">Select Site:</label>
                                <select
                                    value={selectedSite}
                                    onChange={(e) => handleSiteSelection(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                                >
                                    <option value="">Select a Site</option>
                                    {siteOptions.map((site, index) => (
                                        <option key={index} value={site}>
                                            {site}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}

                        {/* Buttons for Viewing and Adding Arrays */}
                        {selectedProject && selectedSite && (
                            <>
                                <Button
                                    onClick={fetchExistingArrays}
                                    text="View existing arrays"
                                    className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center mb-2"
                                />
                                <Button
                                    onClick={() => setShowExistingArrays(false)}
                                    text="Add new array"
                                    className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center mb-4"
                                />
                            </>
                        )}

                        {/* Show existing arrays */}
                        {showExistingArrays && existingArrays.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-lg font-bold">Existing Arrays:</h3>
                                <ul className="list-disc pl-5">
                                    {existingArrays.map((array, index) => (
                                        <li
                                            key={index}
                                            className="text-gray-700 dark:text-gray-300"
                                        >
                                            {array}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Add new array input */}
                        {selectedProject && selectedSite && !showExistingArrays && (
                            <>
                                <input
                                    type="text"
                                    value={newArrayName}
                                    onChange={(e) => setNewArrayName(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                                    placeholder="Enter new array name"
                                />
                                <Button
                                    onClick={handleAddNewArray}
                                    text="Add Array"
                                    className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center mb-2"
                                />
                            </>
                        )}

                        {/* Display messages */}
                        {message && <p className="text-red-500 text-sm">{message}</p>}

                        <div className="flex justify-end space-x-2">
                            <Button
                                onClick={() => setShowAddArrayModal(false)}
                                text="Cancel"
                                className="flex rounded-md p-1.5 text-white whitespace-nowrap bg-asu-maroon border-2 border-transparent items-center"
                            />
                        </div>
                    </div>
                </div>
            )}
            {messageBox.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            {messageBox.text}
                        </p>
                        <button
                            onClick={() => setMessageBox({ show: false, text: '' })}
                            className="bg-asu-maroon text-white px-4 py-2 border border-white rounded hover:bg-maroon-700"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
