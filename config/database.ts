import { connectStrings } from './url'
import { Mongoose, ConnectionOptions } from 'mongoose'

export const configureDB = (mongoose: Mongoose) => {

  'use strict'

  const dotenv = require('dotenv').config() //require env constiables to make file independent
  const ENV = process.env.NODE_ENV || 'development'
  const DB_URI = connectStrings[ENV].url
  const RETRY_DELAY = 5000
  const options: ConnectionOptions = { useNewUrlParser: true }

  function connectMongoose() {
    mongoose.connect(DB_URI, options).catch(function (err: any) {
      console.log('error', err.message)
      process.exit(1)
    })
  }

  connectMongoose()

  // connection events
  mongoose.connection.on('connected', function () {
    console.log('info', `Mongoose connected.`)
  })

  mongoose.connection.on('error', async function (err: any) {
    console.log('error', `Mongoose connection error: ${err}`)

    setTimeout(connectMongoose, RETRY_DELAY)
  })

  mongoose.connection.on('disconnected', function () {
    console.log('info', 'Mongoose disconnected.')
  })

  mongoose.connection.once('open', function (err: any, data: any) {
    console.log('info', 'Mongo running!')
  })

  // for nodemon restarts
  process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
      process.kill(process.pid, 'SIGUSR2')
    })
  })

  // for app termination
  process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
      process.exit(0)
    })
  })

  // capture app termination / restart events
  // To be called when process is restarted or terminated
  function gracefulShutdown(msg: string, cb: any) {
    mongoose.connection.close(function () {
      console.log('info', `Mongoose disconnected through ${msg}`)
      cb()
    })
  }
}