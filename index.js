const express = require("express")
const mysql = require("mysql2/promise")
const app = express()
const cors = require("cors")

app.use(cors())
app.use(express.urlencoded({ extended: false }))
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
  connection.release()

  res.send(result)
})

apiRouter.post('/clear', async (req, res) => {
  const query = `UPDATE tb_message SET deleted = false;`
  const connection = await dbPool.getConnection()

  await connection.beginTransaction()

  await connection.query('SET SQL_SAFE_UPDATES = 0;')
  await connection.query(query, [req.body.text])
  await connection.query('SET SQL_SAFE_UPDATES = 1;')

  await connection.commit()

  connection.release()
  res.status(200).end()
})

apiRouter.post("/p", async (req, res) => {
  const query = `INSERT INTO tb_message (text) VALUES (?);`
  const connection = await dbPool.getConnection()
  await connection.query(query, [req.body.text])
  connection.release()
  res.status(201).end()
})

apiRouter.get("/p", async (req, res) => {
  const query = `SELECT * FROM tb_message WHERE deleted = false;`
  const connection = await dbPool.getConnection()
  const [result] = await connection.query(query)
  connection.release()
  res.status(200).send(result).end()
})

app.use("/api", apiRouter)

app.listen(process.env.PORT || 8999, () => {
  console.log("server started at", process.env.PORT || 8999)
})
