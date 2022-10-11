/*
Logic Layer for Sessions
*/
// const SessionRepository = require('../repository/session.repository')

const SESSION_TABLE = process.env.SESSION_TABLE;

exports.getSession = function (req, res) {
    const params = {
        TableName: SESSION_TABLE,
        Key: {
            session_id: Number(req.params.session_id),
        },
    }
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not get session' });
        }
        if (result.Item) {
            // const {session_id, session_json} = result.Item;
            res.json(result.Item);
        } else {
            res.status(404).json({ error: "Session not found" });
        }
    });
}

exports.getAllSession = function (req, res) {
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

    scanTable(SESSION_TABLE)
}

exports.createSession = function (req, res) {
    // Get input parameters from request body (all
    // values are currently required)
    const { session_id, date_created, session_json, project_id, date_modified, form_id } = req.body;

    // Check that values are correct type (can add more later)
    if (typeof session_id !== 'number') {
        res.status(400).json({ error: 'session_id must be a number' });
    } else if (typeof session_json !== 'object') {
        res.status(400).json({ error: 'session_json must be an object' });
    }
    const params = {
        TableName: SESSION_TABLE,
        Item: {
            session_id: session_id,
            date_created: date_created,
            session_json: session_json,
            project_id: project_id,
            date_modified: date_modified,
            form_id: form_id
        }
    };

    //Input into database
    dynamoDb.put(params, (error) => {

        if (error) {
            console.log(error);
            res.send(error)
            // res.status(400).json({ error: 'Could not create session' });
        } else {
            res.json({ session_id, date_created, session_json, project_id, date_modified, form_id });
        }
    });
}

exports.updateSession = function (req, res) {
    const { session_id, date_created, session_json, project_id, date_modified, form_id } = req.body;

    // Check that values are correct type (can add more later)
    if (typeof session_id !== 'number') {
        res.status(400).json({ error: 'session_id must be a number' });
    } else if (typeof session_json !== 'object') {
        res.status(400).json({ error: 'session_json must be an object' });
    }

    // Update the item, unconditionally,
    const params = {
        TableName: SESSION_TABLE,
        Key: {
            session_id: session_id
        },
        // TODO:
        // Need all values set for this to work. 
        // May need to fix this after we determine functionality
        UpdateExpression: "set date_created=:dc, session_json=:sj,"
            + " project_id=:pid, date_modified=:dm, form_id=:fid",
        ExpressionAttributeValues: {
            ":dc": date_created,
            ":sj": session_json,
            ":pid": project_id,
            ":dm": date_modified,
            ":fid": form_id
        },
        ReturnValues: "UPDATED_NEW"
    };

    dynamoDb.update(params, function (err, data) {
        if (err) {
            res.send(err)
        } else {
            res.send(`UpdateItem succeeded! \nUpdated Fields for session ${session_id}:\n${JSON.stringify(data.Attributes, null, 2)}`)
        }
    });
}

exports.deleteSession = function (req, res) {
    const session_id = Number(req.params.session_id)

    const params = {
        TableName: SESSION_TABLE,
        Key: {
            "session_id": Number(req.params.session_id)
        }
    };

    // Check session_id is valid type
    if (typeof session_id !== 'number') {
        res.status(400).json({ error: 'session_id must be a number' });
    }

    dynamoDb.delete(params, function (err, data) {
        if (err) {
            res.send(err)
        } else {
            res.send(`Session succesfully deleted! \nSession ID: ${session_id}`)
        }
    });
}