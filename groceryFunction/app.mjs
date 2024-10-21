import AWS from 'aws-sdk';
import API from 'lambda-api';

const api = API();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

api.get('/groceries/:id', async (req, res) => {
    const params = {
        TableName: tableName,
        Key: {
            id: req.params.id
        }
    };

    const result = await dynamodb.get(params).promise();
    return res.status(200).json({data: {item: result.Item}});
});

api.post('/groceries', async (req, res) => {
    const requestBody = req.body;
    const params = {
        TableName: tableName,
        Item: {
            id: requestBody.id,
            name: requestBody.name,
            quantity: requestBody.quantity,
            status: requestBody.status
        }
    };

    await dynamodb.put(params).promise();
    return res.status(201).json({data: {item: params.Item}});
});

api.put('/groceries/:id', async (req, res) => {
    const requestBody = req.body;
    const params = {
        TableName: tableName,
        Key: {
            id: req.params.id
        },
        UpdateExpression: 'SET #name = :name, quantity = :quantity, #status = :status',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#status': 'status'
        },
        ExpressionAttributeValues: {
            ':name': requestBody.name,
            ':quantity': requestBody.quantity,
            ':status': requestBody.status
        },
        ReturnValues: 'ALL_NEW'
    };

    const result = await dynamodb.update(params).promise();
    return res.status(200).json({data: {attributes: result.Attributes}});
});

api.delete('/groceries/:id', async (req, res) => {
    const params = {
        TableName: tableName,
        Key: {
            id: req.params.id
        },
        ReturnValues: 'ALL_OLD'
    };

    const result = await dynamodb.delete(params).promise();
    return res.status(200).json({data: {attributes: result.Attributes}});
});

export const handler = async (event, context) => {
    return await api.run(event, context);
};
