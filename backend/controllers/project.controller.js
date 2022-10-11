/*
Logic Layer for Sessions
*/

const PROJECT_TABLE = process.env.PROJECT_TABLE;

exports.getProject = function (req, res) {
    const params = {
        TableName: PROJECT_TABLE,
        Key: {
            project_id: Number(req.params.project_id),
        },
    }
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not get project' });
        }
        if (result.Item) {
            // const {session_id, session_json} = result.Item;
            res.json(result.Item);
        } else {
            res.status(404).json({ error: "Project not found" });
        }
    });
}

exports.getAllProject = function (req, res) {
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

    scanTable(PROJECT_TABLE)
}

exports.createProject = function (req, res) {
    // Get input parameters from request body (all
    // values are currently required)
    const { project_name, comments, date_modified, project_id } = req.body;

    // Check that values are correct type (can add more later)
    if (typeof project_id !== 'number') {
        res.status(400).json({ error: 'project_id must be a number' });
    } else if (typeof project_name !== 'string') {
        res.status(400).json({ error: 'project_name must be an string' });
    }
    const params = {
        TableName: PROJECT_TABLE,
        Item: {
            project_name: project_name,
            comments: comments,
            date_modified: date_modified,
            project_id: project_id
        }
    };

    //Input into database
    dynamoDb.put(params, (error) => {

        if (error) {
            console.log(error);
            res.send(error)
            // res.status(400).json({ error: 'Could not create project' });
        } else {
            res.json({ project_name, comments, date_modified, project_id });
        }
    });
}

exports.updateProject = function (req, res) {
    // Get input parameters from request body
    const { project_name, comments, date_modified, project_id } = req.body;

    // Check that values are correct type (can add more later)
    if (typeof project_id !== 'number') {
        res.status(400).json({ error: 'project_id must be a number' });
    } else if (typeof project_name !== 'string') {
        res.status(400).json({ error: 'project_name must be an string' });
    }

    // Update the item, unconditionally,
    const params = {
        TableName: PROJECT_TABLE,
        Key: {
            project_id: project_id
        },
        // TODO:
        // Need all values set for this to work. 
        // May need to fix this after we determine functionality
        UpdateExpression: "set comments=:c,"
            + " date_modified=:dm, project_name=:pn",
        ExpressionAttributeValues: {
            ":c": comments,
            ":pn": project_name,
            ":dm": date_modified
        },
        ReturnValues: "UPDATED_NEW"
    };

    dynamoDb.update(params, function (err, data) {
        if (err) {
            res.send(err)
        } else {
            res.send(`UpdateItem succeeded! \nUpdated Fields for project: ${project_id}:\n${JSON.stringify(data.Attributes, null, 2)}`)
        }
    });
}

exports.deleteProject = function (req, res) {
    const project_id = Number(req.params.project_id)

    const params = {
        TableName: PROJECT_TABLE,
        Key: {
            "project_id": Number(req.params.project_id)
        }
    };

    // Check project_id is valid type
    if (typeof project_id !== 'number') {
        res.status(400).json({ error: 'project_id must be a number' });
    }

    dynamoDb.delete(params, function (err, data) {
        if (err) {
            res.send(err)
        } else {
            res.send(`project succesfully deleted! \n Project ID: ${project_id}`)
        }
    });
}
