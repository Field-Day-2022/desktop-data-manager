const DATA_FORM_TABLE  = process.env.DATA_FORM_TABLE;

exports.getDataForm = function (req, res) {
    const params = {
        TableName: DATA_FORM_TABLE,
        Key: {
            form_id: Number(req.params.form_id),
        },
    }
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not get Data Form' });
        }
        if (result.Item) {
            // const {session_id, session_json} = result.Item;
            res.json(result.Item);
        } else {
            res.status(404).json({ error: "Data Form not found" });
        }
    });
}

exports.getAllDataForm = function (req, res) {
    // This is needed because DocumentClient scan can only return 
    // a limited size of items
    const scanTable = async (tableName) => {
        const params = {
            TableName: tableName,
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

    scanTable(DATA_FORM_TABLE)
}

exports.createDataForm = function (req, res) {
    // Get input parameters from request body (all
    // values are currently required)
    const { form_id, date_modified, form_name, is_session_form, template_json } = req.body;

    // Check that values are correct type (can add more later)
    if (typeof form_id !== 'number') {
        res.status(400).json({ error: 'form_id must be a number' });
    } else if (typeof template_json !== 'object') {
        res.status(400).json({ error: 'template_json must be an object' });
    }
    const params = {
        TableName: DATA_FORM_TABLE,
        Item: {
            form_id: form_id,
            date_modified: date_modified,
            form_name: form_name,
            is_session_form: is_session_form,
            template_json: template_json
        }
    };

    //Input into database
    dynamoDb.put(params, (error) => {

        if (error) {
            // res.send(error)
            res.status(400).json({ error: 'Could not create data form' });
        } else {
            res.json({ form_id, date_modified, form_name, is_session_form, template_json });
        }
    });
}

exports.updateDataForm = function (req, res) {
    const { form_id, date_modified, form_name, is_session_form, template_json } = req.body;

    // Check that values are correct type (can add more later)
    if (typeof is_session_form !== 'number') {
        res.status(400).json({ error: 'is_session_form must be a number' });
    } else if (typeof template_json !== 'object') {
        res.status(400).json({ error: 'template_json must be an object' });
    }

    // Update the item, unconditionally,
    const params = {
        TableName: DATA_FORM_TABLE,
        Key: {
            form_id: form_id
        },
        // TODO:
        // Need all values set for this to work. 
        // May need to fix this after we determine functionality
        UpdateExpression: "set template_json=:tj, is_session_form=:isf,"
            + " form_name=:fn, date_modified=:dm",
        ExpressionAttributeValues: {
            ":tj": template_json,
            ":isf": is_session_form,
            ":fn": form_name,
            ":dm": date_modified
        },
        ReturnValues: "UPDATED_NEW"
    };

    dynamoDb.update(params, function (err, data) {
        if (err) {
            res.send(err)
        } else {
            res.send(`UpdateItem succeeded! \nUpdated Fields for Data_Form ${form_id}:\n${JSON.stringify(data.Attributes, null, 2)}`)
        }
    });
}

exports.deleteDataForm = function (req, res) {
    const form_id = Number(req.params.form_id)

    const params = {
        TableName: DATA_FORM_TABLE,
        Key: {
            "form_id": Number(req.params.form_id)
        }
    };

    // Check session_id is valid type
    if (typeof form_id !== 'number') {
        res.status(400).json({ error: 'form_id must be a number' });
    }

    dynamoDb.delete(params, function (err, data) {
        if (err) {
            res.send(err)
        } else {
            res.send(`Data Form succesfully deleted! \nForm ID: ${form_id}`)
        }
    });
}