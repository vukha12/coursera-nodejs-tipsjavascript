import amqplib from 'amqplib';

const amqp_url_docker = 'amqp://admin:admin123@localhost:5672';

const sendMail = async () => {
    try {
        const conn = await amqplib.connect(amqp_url_docker);

        const channel = await conn.createChannel();

        const nameExchange = 'send_mail';

        await channel.assertExchange(nameExchange, 'topic', { durable: false });

        const args = process.argv.slice(2);
        const msg = args[1] || 'Fixed!';
        const topic = args[0];

        console.log(`msg::${msg}:::topic:::${topic}`)

        await channel.publish(nameExchange, topic, Buffer.from(msg));

        console.log(`[x] Send Ok:::${msg}`);

        setTimeout(() => {
            conn.close();
            process.exit(0);
        }, 2000);
    } catch (error) {
        console.error("Error in send mail:", error.message);
    }
}

sendMail();