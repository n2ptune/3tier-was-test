const express = require("express")
const mysql = require("mysql2/promise")
const app = express()
const cors = require("cors")

app.use(cors())

const dbConfig = {
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
}
console.log(dbConfig)

const dbPool = mysql.createPool(dbConfig)
const reg = []

const apiRouter = express.Router()

apiRouter.get("/list", async (req, res) => {
  const connection = await dbPool.getConnection()
  const [result] = await connection.query("SELECT NOW();")

  res.send(result)
})

apiRouter.post("/p", (req, res) => {
  reg.push(res.body)
  res.status(201).end()
})

apiRouter.get("/p", (req, res) => {
  res.send(reg)
})

app.use("/api", apiRouter)

app.listen(process.env.PORT || 8999, () => {
  console.log("server started at", process.env.PORT || 8999)
})
