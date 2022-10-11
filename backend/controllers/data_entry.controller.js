/*
 * File: user.controller.js
 * Version: 1.00
 * Date: 2020-10-17
 * Description: Controller class for the Data_Entry table endpoint
 */


const DATA_ENTRY_TABLE= process.env.DATA_ENTRY_TABLE;


/**
 *  Retrieves Data Entry row from DynamoDB Data Entry table.
 * @param req incoming request object
 * @param res out going response
 */
exports.getDataEntry = function (req, res) {
    const params = {
        TableName: DATA_ENTRY_TABLE,
        Key: {
            entry_id: Number(req.params.entry_id),
        },
    }
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not get Data Entry set' });
        }
        if (result.Item) {

            res.json(result.Item);
        } else {
            res.status(404).json({ error: "Data Entry Set set not found" });
        }
    });
}

/**
 *  Retrieves all Data Entry items from DynamoDB Data_Entry table.
 * @param req incoming request object
 * @param res out going response
 */

exports.getAllDataEntry= function (req, res) {

    const scanTable = async (tablename) => {
        const params = {
            TableName: tablename,
        };

        let scanResults = [];
        let items;
        do {
            items = await dynamoDb.scan(params).promise();
            items.Items.forEach((item) => scanResults.push(item));
            params.ExclusiveStartKey = items.LastEvaluatedKey;
        } while (typeof items.LastEvaluatedKey != "undefined");
        res.send(scanResults)
    };

    scanTable(DATA_ENTRY_TABLE)

}

/**
 *  Creates a new Answer Set in  DynamoDB Answer_Set table.
 * @param req incoming request object
 * @param res out going response
 */

exports.createDataEntry = function (req, res) {
    const {entry_id, date_modified, project_id, form_id, entry_json, session_id} = req.body;

    // Check that values are correct type (can add more later)
    if (typeof session_id !== 'number') {
        res.status(400).json({ error: 'session_id must be a number' });
    } else if (typeof entry_json !== 'object') {
        res.status(400).json({ error: 'session_json must be an object' });
    }
    const params = {
        TableName: DATA_ENTRY_TABLE,
        Item: {
            session_id: session_id,
            date_modified: date_modified,
            entry_id: entry_id,
            entry_json: entry_json,
            form_id: form_id,
            project_id: project_id,
        }
    };

    //Input into database
    dynamoDb.put(params, (error) => {

        if (error) {
            console.log(error);
            res.send(error)
            // res.status(400).json({ error: 'Could not create session' });
        } else {
            res.json({ entry_id, date_modified, project_id, form_id, entry_json, session_id, });
        }
    });
}



/**
 *  Updates existing DynamoDB Answer_Set table object. Currently requires all fields be updated in the request.
 * @param req incoming request object
 * @param res out going response
 */

exports.updateAnswerSet = function (req, res) {
    const {set_name, answers, secondary_keys} = req.body;
    const date_modified = (Date.now() / 1000).toFixed();

    //TODO
    //  Add more of these checks if necessary
    if (typeof set_name !== 'string') {
        res.status(400).json({error: 'set name is not valid'});
    }


    const params = {
        TableName: ANSWER_SET_TABLE,
        Key: {
            set_name: set_name

        },
        // TODO:
        // Need all values set for this to work.
        // May need to fix this after we determine functionality
        UpdateExpression: "set date_modified=:dm, answers=:an,"
            + " secondary_keys=:sk",
        ExpressionAttributeValues: {
            ":dm": date_modified,
            ":an": answers,
            ":sk": secondary_keys,

        },
        ReturnValues: "UPDATED_NEW"
    };

    dynamoDb.update(params, function (err, data) {
        if (err) {
            res.send(err)
        } else {
            res.send(`UpdateItem succeeded! \nUpdated Fields for Answer Set  ${set_name}:\n${JSON.stringify(data.Attributes, null, 2)}`)
        }
    });
}


/**
 *  Deletes Answer_Set object from DynamoDB Data_entry table by entry_id and session_id
 * @param req incoming request object
 * @param res out going response
 */

exports.deleteDataEntry = function (req, res) {
    const session_id = Number(req.params.session_id);
    const entry_id = Number(req.params.entry_id);


    const params = {
        TableName: DATA_ENTRY_TABLE,
        Key: {

            "entry_id": entry_id,
        },
    };


    if (typeof entry_id !== 'number') {
        res.status(400).json({error: 'entry_id is not valid'});
    }else if (typeof session_id !== 'number'){
        res.status(400).json({error: 'session_id is not valid'});

    }

    dynamoDb.delete(params, function (err) {
        if (err) {
            res.send(err)
        } else {
            res.send(`data entry successfully deleted! entry_id: ${entry_id}`);
        }
    });
}

