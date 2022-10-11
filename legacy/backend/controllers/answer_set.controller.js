/*
 * File: answer_set.controller.js
 * Version: 1.00
 * Date: 2020-10-17
 * Description: Controller class for the Answer_Set endpoint
 */


const ANSWER_SET_TABLE = process.env.ANSWER_SET_TABLE;


/**
 *  Retrieves Answer Set row from DynamoDB Answer Set table.
 * @param req incoming request object
 * @param res out going response
 */
exports.getAnswerSet = function (req, res) {
    const params = {
        TableName: ANSWER_SET_TABLE,
        Key: {
            set_name: req.params.set_name,
        },
    }
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not get answer set' });
        }
        if (result.Item) {

            res.json(result.Item);
        } else {
            res.status(404).json({ error: "Answer set not found" });
        }
    });
}

/**
 *  Retrieves all Answer Sets from DynamoDB Answer_Set table.
 * @param req incoming request object
 * @param res out going response
 */

exports.getAllAnswerSet = function (req, res) {

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

    scanTable(ANSWER_SET_TABLE)

}

/**
 *  Creates a new Answer Set in  DynamoDB Answer_Set table.
 * @param req incoming request object
 * @param res out going response
 */

exports.createAnswerSet = function (req, res) {
    // Get input parameters from request body (all
    // values are currently required)
    const { set_name, answers, secondary_keys } = req.body;
    const date_modified = (Date.now() / 1000).toFixed();

    // Check that values are correct type (can add more later)
    /*if (typeof session_id !== 'number') {
        res.status(400).json({ error: 'session_id must be a number' });
    } else if (typeof session_json !== 'object') {
        res.status(400).json({ error: 'session_json must be an object' });
    }*/
    const params = {
        TableName: ANSWER_SET_TABLE,
        Item: {
            set_name: set_name,
            date_modified: date_modified,
            answers: answers,
            secondary_keys: secondary_keys,

        }
    };

    //Input into database
    dynamoDb.put(params, (error) => {

        if (error) {
            console.log(error);
            res.send(error)
            // res.status(400).json({ error: 'Could not create session' });
        } else {
            res.json({set_name, answers, secondary_keys, date_modified });
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
         *  Deletes Answer_Set object from DynamoDB Answer_Set table by set_name
         * @param req incoming request object
         * @param res out going response
         */

        exports.deleteAnswerSet = function (req, res) {
            let set_nameWithSpaces = req.params.set_name
            let set_name = set_nameWithSpaces.replace("_", " ");
            /*Because strings are used for the ID, it is possible for
            *them to have spaces. Therefore spaces in the URL
            *will need to be replaced with a '_'
            */

            console.log("SET_NAME" , set_name);

            const params = {
                TableName: ANSWER_SET_TABLE,
                Key: {
                    "set_name": set_name
                }
            };


            if (typeof set_name !== 'string') {
                res.status(400).json({error: 'set_name is not valid'});
            }

            dynamoDb.delete(params, function (err, data) {
                if (err) {
                    res.send(err)
                } else {
                    res.send(`Answer set successfully deleted! \Session ID: ${set_name}`)
                }
            });
        }

