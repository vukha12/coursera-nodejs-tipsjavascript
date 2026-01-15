'use strict';

const {
    consumerQueue,
    connectToRabbitMQ
} = require("../dbs/init.rabbit")

// const log = console.log

// console.log = function () {
//     log.apply(console, [new Date()].concat(arguments))
// }

const messageService = {
    consumerQueue: async (queueName) => {
        try {
            const { channel } = await connectToRabbitMQ();
            await consumerQueue(channel, queueName);
        } catch (error) {
            console.error(`Error consumerQueue:::`, error);
        }
    },

    // case processing
    consumerToQueueNormal: async () => {
        try {
            const { channel } = await connectToRabbitMQ();

            const notiQueue = 'noti.queue';

            // 1. TTL
            // const timeExpried = 15000
            // setTimeout(() => {
            //     channel.consume(notiQueue, msg => {
            //         console.log(`Send notificationQueue successfully processed::`, msg.content.toString())
            //         channel.ack(msg);
            //     })
            // }, timeExpried)


            // 2. LOGIC
            channel.consume(notiQueue, msg => {
                try {
                    const numberTest = Math.random();
                    console.log(numberTest);
                    if (numberTest < 0.8) {
                        throw new Error('Send notification failed:: HOT FIX')
                    }

                    console.log(`SEND notificationQueue successfully processed: `, msg.content.toString())
                    channel.ack(msg);
                } catch (error) {
                    // console.error(`SEND notification error`, error);
                    channel.nack(msg, false, false);
                    /*
                        nack: negative acknowledgement
                    */
                }

            })
        } catch (error) {
            console.error(error)
        }
    },

    // case failed processing
    consumerToQueueFailed: async () => {
        try {
            const { channel } = await connectToRabbitMQ();

            const notiExchangeDLX = 'noti.dlx';
            const notiRoutingKeyDLX = 'noti.key.dlx';
            const notiQueueHandler = 'noti.queue.hotfix';

            await channel.assertExchange(notiExchangeDLX, 'direct', { durable: true })

            const queueResult = await channel.assertQueue(notiQueueHandler,
                {
                    exclusive: false
                })

            await channel.bindQueue(queueResult.queue, notiExchangeDLX, notiRoutingKeyDLX);
            await channel.consume(queueResult.queue, msgFailed => {
                console.log(`this notification error, pls hot fix:::`, msgFailed.content.toString());
            }, { noAck: true })
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = messageService