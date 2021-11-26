const hapi = require("@hapi/hapi")
const { MongoClient, ObjectId } = require("mongodb")
const url = process.env.MONGO_CONNECTION_STRING || "mongodb://localhost:27017"
// const dbName = "gundam"

const PORT = process.env.PORT || 3000

async function start () {
  const client = await MongoClient.connect(url)
  const db = client.db("gundam")
  const collection = db.collection("models")

  const server = hapi.server({
    host: "0.0.0.0",
    port: PORT
  })

  server.route({
    method: "GET",
    path: "/",
    async handler () {
      const data = await collection.find({}).toArray();
      return { success: true, data }
    }
  })

  server.route({
    method: "GET",
    path: "/models",
    async handler () {
      const data = await collection.find({}, { _id: 1 }).map(x => x._id).toArray()
      return { success: true, data }
    }
  })

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
  server.route({
    method: "GET",
    path: "/count",
    async handler () {
      const data = await collection.count();
      return { success: true, data }
    }
  })

  await server.register({
    plugin: require("hapi-pino")
  })

  console.log(`starting server on ${PORT}`)
  await server.start()

  return server
}

start().catch(err => {
  console.error(err)
  process.exit(1)
})

