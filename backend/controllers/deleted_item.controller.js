/*
 * File: user.controller.js
 * Version: 1.00
 * Date: 2020-10-17
 * Description: Controller class for the Deleted_Item endpoint
 */


const DELETED_ITEM_TABLE= process.env.DELETED_ITEM_TABLE;


/**
 *  Retrieves Deleted item row from DynamoDB DELETED_ITEM table.
 * @param req incoming request object
 * @param res out going response
 */
exports.getDeletedItem= function (req, res) {
    const params = {
        TableName: DELETED_ITEM_TABLE,
        Key: {
            deleted_id: Number(req.params.deleted_id),
        },
    }
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not get deleted item data set' });
        }
        if (result.Item) {

            res.json(result.Item);
        } else {
            res.status(404).json({ error: "Deleted Item  Set set not found" });
        }
    });
}

/**
 *  Retrieves all Deleted items from DynamoDB Deleted_Items table.
 * @param req incoming request object
 * @param res out going response
 */

exports.getAllDeletedItem = function (req, res) {

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

    scanTable(DELETED_ITEM_TABLE)

}


/**
 *  Creates a new Deleted Item in  DynamoDB Deleted_Item table.
 * @param req incoming request object
 * @param res out going response
 */

exports.createDeletedItem = function (req, res) {
    const {deleted_id, item_json, table_name} = req.body;
    const date_deleted = (Date.now()/1000).toFixed()

    // Check that values are correct type (can add more later)
    if (typeof deleted_id !== 'number') {
        res.status(400).json({ error: 'deleted_id must be a number' });
    } else if (typeof item_json !== 'object') {
        res.status(400).json({ error: 'item_json must be an object' });
    }
    const params = {
        TableName: DELETED_ITEM_TABLE,
        Item: {
            deleted_id: deleted_id,
            date_deleted: date_deleted,
            item_json: item_json,
            table_name: table_name,

        }
    };

    //Input into database
    dynamoDb.put(params, (error) => {

        if (error) {
            console.log(error);
            res.send(error)
        } else {
            res.json({date_deleted, deleted_id, item_json, table_name});
        }
    });
}



/**
 *  Updates existing DynamoDB Deleted Item table object. Currently requires all fields be updated in the request.
 * @param req incoming request object
 * @param res out going response
 */

exports.updateDeletedItem = function (req, res) {
    const {deleted_id, date_deleted, item_json, table_name} = req.body;
    const date_modified = (Date.now() / 1000).toFixed();

    //TODO
    //  Add more of these checks if necessary
    if (typeof deleted_id !== 'number') {
        res.status(400).json({error: 'the deleted_id must be a number'});
    }if(typeof  date_deleted !== 'number'){
        res.status(400).json({error: 'the date_deleted must be a number'});
    }if(typeof  item_json !== 'object'){
        res.status(400).json({error: 'the item_json must be an object'});

    }if(typeof table_name !== 'string'){
        res.status(400).json({error: 'the table_name must be a string'});

    }


    const params = {
        TableName: DELETED_ITEM_TABLE,
        Key: {
            deleted_id: deleted_id

        },
        // TODO:
        // Need all values set for this to work.
        // May need to fix this after we determine functionality
        UpdateExpression: "set date_deleted=:dd,"
            + " item_json=:ij, table_name=:tn",
        ExpressionAttributeValues: {
            ":dd": date_deleted,
            ":ij": item_json,
            ":tn": table_name

        },
        ReturnValues: "UPDATED_NEW"
    };

    dynamoDb.update(params, function (err, data) {
        if (err) {
            res.send(err)
        } else {
            res.send(`UpdateItem succeeded! \nUpdated Fields Deleted ID:   ${deleted_id}:\n${JSON.stringify(data.Attributes, null, 2)}`)
        }
    });
}


/**
 *  Deletes Deleted Item object from DynamoDB Deleted Item_table by deleted_id
 * @param req incoming request object
 * @param res out going response
 */

exports.deleteDeletedItem = function (req, res) {
    const deleted_id = Number(req.params.deleted_id);



    const params = {
        TableName: DELETED_ITEM_TABLE,
        Key: {

            "deleted_id": deleted_id,
        },
    };


    if (typeof deleted_id !== 'number') {
        res.status(400).json({error: 'entry_id is not valid'});
    }

    dynamoDb.delete(params, function (err) {
        if (err) {
            res.send(err)
        } else {
            res.send(`deleted item successfully deleted! deleted_id : ${deleted_id}`);
        }
    });
}

