import amqplib from 'amqplib';

const amqp_url_docker = 'amqp://admin:admin123@localhost:5672';

const sendQueue = async ({ msg }) => {
    try {
        const conn = await amqplib.connect(amqp_url_docker);

        const channel = await conn.createChannel();

        const nameQueue = 'q3';

        await channel.assertQueue(nameQueue, { durable: true });

        await channel.sendToQueue(nameQueue, Buffer.from(msg));

    } catch (error) {
        console.error("Error:", error.message)
    }
}

const msg = process.argv.slice(2).join(' ') || 'Hello World!';
console.log(msg)
sendQueue({ msg });