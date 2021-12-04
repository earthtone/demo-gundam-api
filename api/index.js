const hapi = require("@hapi/hapi")
const { MongoClient, ObjectId } = require("mongodb")

const URL = process.env.MONGO_CONNECTION_STRING || "mongodb://localhost:27017"
const PORT = process.env.PORT || 3000

async function start () {
  const client = await MongoClient.connect(URL)
  const db = client.db("gundam")
  const collection = db.collection("models")

  const server = hapi.server({
    host: "0.0.0.0",
    port: PORT
  })

  await server.register({
    plugin: require("hapi-pino"),
  })

  await server.register(require('hapi-plugin-websocket'))

  // GET every possible record
  server.route({
    method: "GET",
    path: "/",
    async handler () {
      const data = await collection.find({}).toArray();
      return { success: true, data }
    }
  })

  // GET list of records
  server.route({
    method: "GET",
    path: "/models",
    async handler () {
      const data = await collection.find({}, { _id: 1 }).map(x => ({ id: x._id, name: x.name })).toArray()
      return { success: true, data }
    }
  })

  // GET specific record by name
  server.route({
    method: "GET",
    path: "/model/{id}",
    async handler (request) {
      const { id } = request.params
      const data = await collection.findOne({ "_id": ObjectId(id) });
      if (data) return { success: true, data }
      else return { success: false, error: 'model not matched' }
    }
  })

  // GET total count of records
  server.route({
    method: "GET",
    path: "/count",
    async handler () {
      const data = await collection.count();
      return { success: true, data }
    }
  })

  // WS echo server
  server.route({
    method: "POST",
    path: "/ws",
    config: {
      plugins: { websocket: { only: true, autoping: 30 * 1000 } }
    },
    handler (request) {
      return { success: true, data: request.payload }
    }
  })

  console.log(`starting server on ${PORT}`)
  await server.start()

  return server
}

start().catch(err => {
  console.error(err)
  process.exit(1)
})

