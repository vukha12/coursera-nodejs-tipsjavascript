'use strict';

const { consumerQueue } = require('./src/services/consumerQueue.service.js')
const queueName = 'test-topic';
consumerQueue(queueName).then(() => {
    console.log(`Message consumer started ${queueName}`)
}).catch(err => {
    console.err(`Message Error:`, err.message)
})