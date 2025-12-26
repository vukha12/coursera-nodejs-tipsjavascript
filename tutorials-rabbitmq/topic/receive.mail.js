import amqplib from 'amqplib';

const amqp_url_docker = 'amqp://admin:admin123@localhost:5672';

const receiveMail = async () => {
    try {
        const conn = await amqplib.connect(amqp_url_docker);

        const channel = await conn.createChannel();

        const nameExchange = 'send_mail';

        await channel.assertExchange(nameExchange, 'topic', { durable: false });

        const { queue } = await channel.assertQueue('', { exclusive: true });

        const args = process.argv.slice(2);
        if (!args.length) {
            process.exit(0);
        }

        console.log(`waitting queue ${queue}::: topic :: ${args}`)

        args.forEach(async key => {
            await channel.bindQueue(queue, nameExchange, key);
        })

        await channel.consume(queue, msg => {
            console.log(`Routing key:${msg.fields.routingKey}::: msg:::${msg.content.toString()}`);
        });
    } catch (error) {
        console.error("Error in send mail:", error.message);
    }
}

receiveMail();