import amqplib from 'amqplib';

const amqp_url_docker = 'amqp://admin:admin123@localhost:5672';

const receiveNoti = async () => {
    try {

        //1. create Connect
        const conn = await amqplib.connect(amqp_url_docker);

        //2. create Channel
        const channel = await conn.createChannel();

        //3. create exchange
        const nameExchange = 'video';

        await channel.assertExchange(nameExchange, 'fanout', { durable: false });

        //4. create queue
        const { queue } = await channel.assertQueue('', { exclusive: true });

        console.log(`nameQueue:::`, queue);

        //5. bingding
        await channel.bindQueue(queue, nameExchange, '');

        //6. consume message
        await channel.consume(queue, msg => {
            console.log(`msg:::`, msg.content.toString())
        }, {
            noAck: true
        })

    } catch (error) {
        console.error('Error in receiveNoti:', error.message);
    }
}

receiveNoti()