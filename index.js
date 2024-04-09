const express = require("express")
const mysql = require("mysql2/promise")
const app = express()
const cors = require("cors")

app.use(cors())
app.use(express.urlencoded())
app.use(express.json())

const dbConfig = {
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  user: process.env.DB_USER
}
console.log(dbConfig)

const dbPool = mysql.createPool({ ...dbConfig })
const reg = []

const apiRouter = express.Router()

apiRouter.get("/list", async (req, res) => {
  const connection = await dbPool.getConnection()
  const [result] = await connection.query("SELECT NOW();")

  res.send(result)
})

apiRouter.post("/p", async (req, res) => {
  const query = `INSERT INTO tb_message VALUES (?);`
  const connection = await dbPool.getConnection()
  await connection.query(query, [res.body.text])
  res.status(201).end()
})

apiRouter.get("/p", async (req, res) => {
  const query = `SELECT * FROM tb_message;`
  const connection = await dbPool.getConnection()
  const [result] = await connection.query(query)
  res.status(200).send(result).end()
})

app.use("/api", apiRouter)

app.listen(process.env.PORT || 8999, () => {
  console.log("server started at", process.env.PORT || 8999)
})
