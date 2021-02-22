import Enforcer from 'openapi-enforcer'
import EnforcerMiddleware from 'openapi-enforcer-middleware'
import express from 'express'
import path from 'path'

// Create express instance
const app = express()

// Create a simple logging middleware
app.use((req, res, next) => {
  console.log(req.method.toUpperCase() + ' ' + req.path)
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
app.use(enforcerMiddleware.route(controllersPath))

// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}