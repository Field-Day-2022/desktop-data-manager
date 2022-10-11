const express = require('express')
const router = express.Router();
const SessionController = require('../controllers/session.controller')
const UserController = require('../controllers/user.controller')
const AnswerSetController = require('../controllers/answer_set.controller')
const DataEntryController = require('../controllers/data_entry.controller')
const ProjectController = require('../controllers/project.controller')
const DataFormController = require('../controllers/data_form.controller')
const DeletedItemController = require('../controllers/deleted_item.controller')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
// // Swagger Ui Instantiation
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

// Session Routes
router.get('/session/:session_id', SessionController.getSession)
router.get('/session', SessionController.getAllSession)
router.post('/session', SessionController.createSession)
router.put('/session', SessionController.updateSession)
router.delete('/session/:session_id', SessionController.deleteSession)

// User Routes

router.get('/user/:user_id', UserController.getUser)
router.get('/user', UserController.getAllUser)
router.post('/user', UserController.createUser)
router.delete('/user/:user_id', UserController.deleteUser)
router.put('/user', UserController.updateUser)

// Answer_Set Routes
router.get('/answer_set/:set_name', AnswerSetController.getAnswerSet)
router.get('/answer_set', AnswerSetController.getAllAnswerSet)
router.post('/answer_set', AnswerSetController.createAnswerSet)
router.delete('/answer_set/:set_name', AnswerSetController.deleteAnswerSet)
router.put('/answer_set', AnswerSetController.updateAnswerSet)

// Data_Entry Routes
router.get('/data_entry/:session_id/:entry_id', DataEntryController.getDataEntry)
router.get('/data_entry', DataEntryController.getAllDataEntry)
router.post('/data_entry', DataEntryController.createDataEntry)
router.delete('/data_entry/:session_id/:entry_id', DataEntryController.deleteDataEntry)
//router.put('/data_entry', DataEntryController.updateDataEntry)

// Project Routes
router.get('/project/:project_id', ProjectController.getProject)
router.get('/project', ProjectController.getAllProject)
router.post('/project', ProjectController.createProject)
router.put('/project', ProjectController.updateProject)
router.delete('/project/:project_id', ProjectController.deleteProject)

// Data Form Routes
router.get('/data_form/:form_id', DataFormController.getDataForm)
router.get('/data_form', DataFormController.getAllDataForm)
router.post('/data_form', DataFormController.createDataForm)
router.put('/data_form', DataFormController.updateDataForm)
router.delete('/data_form/:form_id', DataFormController.deleteDataForm)


//Deleted Item Routes
router.get('/deleted_item/:deleted_id', DeletedItemController.getDeletedItem)
router.get('/deleted_item', DeletedItemController.getAllDeletedItem)
router.post('/deleted_item', DeletedItemController.createDeletedItem)
router.put('/deleted_item', DeletedItemController.updateDeletedItem)
router.delete('/deleted_item/:deleted_id', DeletedItemController.deleteDeletedItem)

//Example Routes

//....


module.exports = router;
