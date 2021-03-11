import dbFactory from './db'
import Enforcer from 'openapi-enforcer'
import EnforcerMiddleware from 'openapi-enforcer-middleware'
import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import { Pool, Client } from 'pg'

dotenv.config()

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: +process.env.DB_PORT!,
})

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error(err)
    pool.end()
    process.exit(1)
  } else {
    console.log('Successfully Connected to database')
  }
})

// Create express instance
const app = express()

// Create a simple logging middleware
app.use(async (req, res, next) => {
  console.log(req.method.toUpperCase() + ' ' + req.path)
  // const conn = await pool.connect()
  next()
})

// Add Body Parser
app.use(express.json())

// Any paths defined in your openapi.yml will validate and parse the request
// before it calls your route code.
const openApiPath = path.resolve(__dirname, 'openapi.yml')
const enforcerMiddleware = EnforcerMiddleware(Enforcer(openApiPath))
app.use(enforcerMiddleware.init())

// Catch errors
enforcerMiddleware.on('error', (err: Error) => {
  console.error(err)
  // process.exit(1)
})

// Define the paths for the controllers
const controllersPath = path.resolve(__dirname, 'controllers')
app.use(enforcerMiddleware.route(controllersPath, [ pool ]))

// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}