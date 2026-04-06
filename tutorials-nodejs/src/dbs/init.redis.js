import redis from "redis";
import { RedisErrorResponse } from "../core/error.response.js";

let client = {}, statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'connecting',
    ERROR: 'error'
}, connectionTimeout

const REDIS_CONNECT_TIMEOUT = 10000, REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: {
        vn: 'Redis loi roi anh em',
        en: 'Service connection error'
    }
}

const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {

        throw new RedisErrorResponse({
            message: REDIS_CONNECT_MESSAGE.message.vn,
            statusCode: REDIS_CONNECT_MESSAGE.code
        })
    }, REDIS_CONNECT_TIMEOUT)
}

export const handleEventConnection = ({ connectionRedis }) => {
    // check if connection is null
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log('connectionRedis - Connection status: connected');
        clearTimeout(connectionTimeout);
    })

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log('connectionRedis - Connection status: disconnected');
        // connect retry
        handleTimeoutError();
    })

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log('connectionRedis - Connection status: reconnecting');
        clearTimeout(connectionTimeout);

    })

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`connectionRedis - Connection status: error ${err}`);
        // connect retry
        handleTimeoutError();
    })
}

export const initRedis = () => {

    const instanceRedis = redis.createClient();
    client.instanceConnect = instanceRedis;
    handleEventConnection({ connectionRedis: instanceRedis });

}

export const getRedis = () => client;

export const closeRedis = () => client.close();

