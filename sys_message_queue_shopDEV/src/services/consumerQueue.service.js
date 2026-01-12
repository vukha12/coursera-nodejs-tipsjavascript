'use strict';

const {
    consumerQueue,
    connectToRabbitMQ
} = require("../dbs/init.rabbit")

const messageService = {
    consumerQueue: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ();
            await consumerQueue(channel, queueName);
        } catch (error) {
            console.error(`Error consumerQueue:::`, error);
        }
    }
}

module.exports = messageService