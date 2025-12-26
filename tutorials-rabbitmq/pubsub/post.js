import amqplib from 'amqplib';

const amqp_url_docker = 'amqp://admin:admin123@localhost:5672';

const postVideo = async ({ msg }) => {
    try {

        //1. create Connect
        const conn = await amqplib.connect(amqp_url_docker);

        //2. create Channel
        const channel = await conn.createChannel();

        //3. create exchange
        const nameExchange = 'video';

        await channel.assertExchange(nameExchange, 'fanout', { durable: false });

        //4. publish video

        await channel.publish(nameExchange, '', Buffer.from(msg));
        console.log(" [x] Sent %s", msg);

        setTimeout(() => {
            conn.close();
            process.exit(0);
        }, 2000)
    } catch (error) {
        console.error('Error in postVideo:', error.message);
    }
}
const msg = process.argv.slice(2).join(' ') || 'Video default';

postVideo({ msg })