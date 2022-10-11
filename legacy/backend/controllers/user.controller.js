/*
 * File: user.controller.js
 * Version: 1.00
 * Date: 2020-10-17
 * Description: Controller class for the user endpoint
 */


const USER_TABLE = process.env.USER_TABLE;


/**
 *  Retrieves user row from DynamoDB User table.
 * @param req incoming request object
 * @param res out going response
 */
exports.getUser = function (req, res) {
    const params = {
        TableName: USER_TABLE,
        Key: {
            user_id: req.params.user_id,
        },
    }
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not get user' });
        }
        if (result.Item) {

            res.json(result.Item);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    });
}

/**
 *  Retrieves all Users from DynamoDB User table.
 * @param req incoming request object
 * @param res out going response
 */

exports.getAllUser = function (req, res) {

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

    scanTable(USER_TABLE)

}

/**
 *  Creates a new User in  DynamoDB User table.
 * @param req incoming request object
 * @param res out going response
 */

exports.createUser = function (req, res) {

    const {user_id, access_level, password} = req.body;
    const date_modified = (Date.now() / 1000).toFixed();


    if (typeof user_id !== 'string') {
        res.status(400).json({error: 'username is not valid'});
    } else if (typeof access_level !== 'number') {
        res.status(400).json({error: 'access level must be a number'});

    }
    const params = {
        TableName: USER_TABLE,
        Item: {
            user_id: user_id,
            access_level: access_level,
            date_modified: Number(date_modified),
            password: password
        }
    };

    dynamoDb.put(params, (error) => {

        if (error) {
            console.log(error);
            res.send(error)

        } else {
            res.json({user_id, date_modified, access_level, password});
        }
    });


}

/**
 *  Updates existing DynamoDB User table object. Currently requires all fields be updated in the request.
 * @param req incoming request object
 * @param res out going response
 */

exports.updateUser = function (req, res) {
    const {user_id, access_level, password} = req.body;
    const date_modified = (Date.now() / 1000).toFixed();


    if (typeof user_id !== 'string') {
        res.status(400).json({error: 'username is not valid'});
    } else if (typeof access_level !== 'number') {
        res.status(400).json({error: 'access level must be a number'});

    }
    const params = {
        TableName: USER_TABLE,
        Key: {
            user_id: user_id

    },
        // TODO:
        // Need all values set for this to work.
        // May need to fix this after we determine functionality
        UpdateExpression: "set date_modified=:dm, access_level=:al,"
            + " password=:pw",
        ExpressionAttributeValues: {
            ":dm": date_modified,
            ":al": access_level,
            ":pw": password,

        },
        ReturnValues: "UPDATED_NEW"
    };

    dynamoDb.update(params, function (err, data) {
        if (err) {
            res.send(err)
        } else {
            res.send(`UpdateItem succeeded! \nUpdated Fields for User ${user_id}:\n${JSON.stringify(data.Attributes, null, 2)}`)
        }
    });
}

/**
 *  Deletes User object from DynamoDB User table by user_id
 * @param req incoming request object
 * @param res out going response
 */

exports.deleteUser = function (req, res) {
    const user_id = req.params.user_id;

    const params = {
        TableName: USER_TABLE,
        Key: {
            "user_id": user_id
        }
    };

    //checks to see if user ID is a string
    if (typeof user_id !== 'string') {
        res.status(400).json({ error: 'user_id is not valid' });
    }

    dynamoDb.delete(params, function (err, data) {
        if (err) {
            res.send(err)
        } else {
            res.send(`User successfully deleted! \Session ID: ${user_id}`)
        }
    });
}
