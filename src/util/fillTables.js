/*
 * File: fillTables.js
 * Version: 1.01
 * Date: 2020-03-07
 * Description: Fills tables with information from forms and answer sets, contains error information.
 */

const axios = require('axios');
const projectData = require('./data/Projects');
const formData = require('./data/DataForms');
const answerSetData = require('./data/AnswerSets');
(async () => {
    let i = 0;

    // add projects
    try {
        for (i = 0; i < projectData.length; i++) {
            const project = projectData[i];
            const body = {
                project_id: project.projectId,
                project_name: project.projectName,
                comments: project.comments,
                date_modified: project.dateModified,
            };
            await axios.post('http://localhost:8000/api/v2/project', body);
        }
    } catch (err) {
        console.error(err);
        console.log(`Failed on project index: ${i}`);
    }
    // add forms
    try {
        for (i = 0; i < formData.length; i++) {
            const form = formData[i];
            const body = {
                form_id: form.formId,
                form_name: form.formName,
                template_json: JSON.stringify(form.templateJson),
                date_modified: form.dateModified,
                is_session_form: form.isSessionForm,
            };
            await axios.post('http://localhost:8000/api/v2/data_form', body);
        }
    } catch (err) {
        console.error(err);
        console.log(`Failed on form index: ${i}`);
    }
    // add answer sets
    try {
        for (i = 0; i < answerSetData.length; i++) {
            const answerSet = answerSetData[i];
            const body = {
                set_name: answerSet.setName,
                secondary_keys: JSON.stringify(answerSet.secondaryKeys),
                answers: JSON.stringify(answerSet.answer),
                date_modified: answerSet.dateModified,
            };
            await axios.post('http://localhost:8000/api/v2/answer_set', body);
        }
    } catch (err) {
        console.error(err);
        console.log(`Failed on answer set index: ${i}`);
    }
})();
