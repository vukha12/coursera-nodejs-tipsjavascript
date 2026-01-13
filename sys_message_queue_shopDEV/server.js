'use strict';

const { consumerQueue,
    consumerToQueueFailed,
    consumerToQueueNormal } = require('./src/services/consumerQueue.service.js')
const queueName = 'test-topic';
// consumerQueue(queueName).then(() => {
//     console.log(`Message consumer started ${queueName}`)
// }).catch(err => {
//     console.err(`Message Error:`, err.message)
// })

consumerToQueueNormal().then(() => {
    console.log(`Message consumerToQueueNormal started `)
}).catch(err => {
    console.error(`Message Error:`, err.message)
})

consumerToQueueFailed().then(() => {
    console.log(`Message consumerToQueueFailed started `)
}).catch(err => {
    console.error(`Message Error:`, err.message)
})