'use strict';

const { connectToRabbitMQForTest } = require('../dbs/init.rabbit.js');

describe('RabbitMQ Connection Test', () => {
    it('should connect to successful RabbitMQ', async () => {
        const result = await connectToRabbitMQForTest();
        expect(result).toBeUndefined();
    })
});