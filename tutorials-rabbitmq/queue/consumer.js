import amqplib from 'amqplib';

const amqp_url_docker = 'amqp://admin:admin123@localhost:5672';

const receiveQueue = async () => {
    try {
        const conn = await amqplib.connect(amqp_url_docker);

        const channel = await conn.createChannel();

        const nameQueue = 'q3';

        await channel.assertQueue(nameQueue, { durable: true });

        await channel.consume(nameQueue, msg => {
            console.log("Received:", msg.content.toString());
        }, {
            noAck: true
        })

    } catch (error) {
        console.error("Error:", error.message)
    }
}

receiveQueue();