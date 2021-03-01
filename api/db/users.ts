import { Client, PoolClient } from 'pg'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

export default function (conn: PoolClient) {
  return {
    async createAccount(name: string, password: string) {
      const userId = uuid();
      const rootPersonId = uuid();
      const hashedPass = await bcrypt.hash(password, 10);
      const dbResponse = conn.query({
        text: `INSERT INTO "users" ("id", "username", "password", "rootperson") VALUES ($1, $2, $3, $4) RETURNING *;`,
        values: [
          userId,
          name,
          hashedPass,
          rootPersonId,
        ]
      })
        .then((res) => {
          console.log(res.rows[0])
          return {
            success: true,
            id: res.rows[0].id,
            personId: res.rows[0].rootperson
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            success: false,
            id: '',
            personId: ''
          }
        })
      return dbResponse
    },
    async getAccount(id: string) {
      const dbResponse = conn.query({
        text: 'SELECT * FROM users WHERE id=$1',
        values: [
          id,
        ]
      })
        .then((res) => {
          console.log(res.rows[0])
          return {
            success: true,
            id: res.rows[0].id,
            personId: res.rows[0].rootperson,
            username: res.rows[0].username
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            success: false,
            id: '',
            personId: '',
            username: ''
          }
        })
      return dbResponse
    },
    async updateAccount(id: string, username: string, password: string, personId: string) {
      let updateString = 'UPDATE users SET '
      let updateArray = [id]
      let counter = 2
      if (username) {
        updateString += '"username"=$' + counter
        updateArray.push(username)
        counter++
      }
      if (password) {
        if (counter !== 1) {
          updateString += ', '
        }
        updateString += '"password"=$' + counter
        updateArray.push(await bcrypt.hash(password, 10))
        counter++
      }
      if (personId) {
        if (counter !== 1) {
          updateString += ', '
        }
        updateString += '"rootperson"=$' + counter
        updateArray.push(personId)
        counter++
      }
      updateString += '\nWHERE "id"=$1 RETURNING *'
      const dbResponse = conn.query({
        text: updateString,
        values: updateArray
      })
        .then((res) => {
          console.log(res.rows[0])
          return {
            success: true,
            id: res.rows[0].id,
            username: res.rows[0].username,
            personId: res.rows[0].rootperson
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            success: false,
            id: '',
            username: '',
            personId: ''
          }
        })
      return dbResponse
    },
    async deleteAccount(id: string) {
      const dbResponse = conn.query({
        text: `DELETE FROM users WHERE id=$1`,
        values: [
          id
        ]
      })
        .then((res) => {
          console.log(res)
          return {
            success: true
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            success: false
          }
        })
      return dbResponse
    }
  }
}