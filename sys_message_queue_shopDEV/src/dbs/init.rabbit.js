'use strict';

const amqp = require('amqplib');
const URL_RABBITMQ = 'amqp://guest:12345@localhost';

const connectToRabbitMQ = async () => {
    try {
        const conn = await amqp.connect(URL_RABBITMQ);
        if (!conn) throw new Error('Connection to RabbitMQ failed');

        const channel = await conn.createChannel();

        return { channel, conn }
    } catch (error) {
        console.error(`Error connect to RabbitMQ:`, error.message)
    }
}

const connectToRabbitMQForTest = async () => {
    try {
        const { channel, conn } = await connectToRabbitMQ();

        // Publish message to a queue
        const nameQueue = 'test-queue';
        const message = 'Hello, shopDEV by anonystick'
        await channel.assertQueue(nameQueue);
        await channel.sendToQueue(nameQueue, Buffer.from(message));

        // Close the connection

        await conn.close();
    } catch (error) {
        console.error(`Error connecting to RabbitMQ:`, error.message)
    }
}

const consumerQueue = async (channel, queueName) => {
    try {
        await channel.assertQueue(queueName, { durable: true })
        console.log(`Waiting for messages...`);
        channel.consume(queueName, msg => {
            console.log(`Received message: ${queueName}::`, msg.content.toString());
            // 1. find User following that shop
            // 2. Send message to user
            // 3. yes, ok ==>> success
            // 4. error. setup DLX ...
        }, {
            noAck: true
        })
    } catch (error) {
        console.error(`error`, error)
        throw error;
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue
}