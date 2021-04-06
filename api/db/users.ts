import { Client, PoolClient } from 'pg'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

export default function (conn: PoolClient) {
  return {
    async createAccount(username: string, password: string, firstName: string, lastName: string) {
      const userId = uuid()
      const rootPersonId = uuid()
      const hashedPass = await bcrypt.hashSync(password, 10)
      const checkUserResponse = await conn.query({
        text: `SELECT * FROM users WHERE username=$1`,
        values: [
          username
        ]
      })
        .then((res) => {
          if (res && res.rows.length > 0 && res.rows[0].username === username) {
            return {
              success: false
            }
          }
          return {
            success: true
          }
        })
        .catch((err) => {
          return {
            success: false
          }
        })
      if (!checkUserResponse.success) {
        return {
          code: 400,
          success: false,
          id: '',
          personId: '',
          authtoken: ''
        }
      }
      const personDbResponse = await conn.query({
        text: `INSERT INTO "persons" ("id", "rootperson", "firstname", "lastname") VALUES ($1, $2, $3, $4) RETURNING *;`,
        values: [
          rootPersonId,
          true,
          firstName,
          lastName,
        ],
      })
        .then((res) => {
          if (res && res.rows.length > 0) {
            return {
              success: true,
            }
          }
          return {
            success: false,
          }
        })
        .catch((err) => {
          return {
            success: false
          }
        })
      if (!personDbResponse.success) {
        return {
          code: 400,
          success: false,
          id: '',
          personId: '',
          authtoken: ''
        }
      }
      const dbResponse = conn.query({
        text: `INSERT INTO "users" ("id", "username", "password", "rootperson") VALUES ($1, $2, $3, $4) RETURNING *;`,
        values: [
          userId,
          username,
          hashedPass,
          rootPersonId,
        ]
      })
        .then(async (res) => {
          const auth = await this.login(username, password)
          console.log(res.rows[0])
          return {
            code: 200,
            success: true,
            id: res.rows[0].id,
            personId: res.rows[0].rootperson,
            authtoken: auth.authtoken
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 500,
            success: false,
            id: '',
            personId: '',
            authtoken: ''
          }
        })

      return dbResponse
    },
    async getAccount(id: string, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success || authenticatedUser.userId !== id) {
        return {
          code: 403,
          success: false,
          id: '',
          username: '',
          personId: ''
        }
      }
      const dbResponse = conn.query({
        text: 'SELECT * FROM users WHERE id=$1',
        values: [
          id,
        ]
      })
        .then((res) => {
          console.log(res.rows[0])
          return {
            code: 200,
            success: true,
            id: res.rows[0].id,
            personId: res.rows[0].rootperson,
            username: res.rows[0].username
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 404,
            success: false,
            id: '',
            personId: '',
            username: ''
          }
        })
      return dbResponse
    },
    async updateAccount(id: string, username: string, password: string, personId: string, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success || authenticatedUser.userId !== id) {
        return {
          code: 403,
          success: false,
          id: '',
          username: '',
          personId: ''
        }
      }
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
            code: 200,
            success: true,
            id: res.rows[0].id,
            username: res.rows[0].username,
            personId: res.rows[0].rootperson
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 400,
            success: false,
            id: '',
            username: '',
            personId: ''
          }
        })
      return dbResponse
    },
    async deleteAccount(id: string, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success || authenticatedUser.userId !== id) {
        return {
          code: 403,
          success: false
        }
      }
      const dbResponse = conn.query({
        text: `DELETE FROM users WHERE id=$1`,
        values: [
          id
        ]
      })
        .then((res) => {
          console.log('Successfully deleted user with id:', id)
          return {
            code: 204,
            success: true
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 400,
            success: false
          }
        })
      return dbResponse
    },
    async login(username: string, password: string) {
      const authenticateResponse = await conn.query({
        text: `SELECT * FROM users WHERE username=$1`,
        values: [
          username
        ]
      })
        .then((res) => {
          if (res.rows && res.rows.length === 1 && bcrypt.compareSync(password, res.rows[0].password)) {
            console.log(res.rows[0])
            return {
              code: 200,
              success: true,
              data: res
            }
          }
          throw Error('Username/password combination not found')
        })
        .catch((err) => {
          return {
            code: 403,
            success: false,
            data: undefined
          }
        })
      if (authenticateResponse.success && authenticateResponse.data) {
        const createTokenResponse = conn.query({
          text: `INSERT INTO auth (token, userid) VALUES ($1, $2) RETURNING *`,
          values: [
            uuid(),
            authenticateResponse.data.rows[0].id
          ]
        })
          .then((res) => {
            console.log(res.rows[0])
            return {
              code: 201,
              success: true,
              authtoken: res.rows[0].token,
              userid: authenticateResponse.data.rows[0].id,
              rootPersonId: authenticateResponse.data.rows[0].rootperson
            }
          })
          .catch((err) => {
            console.error(err)
            return {
              code: 403,
              success: false,
              authtoken: undefined,
              userid: undefined,
              rootPersonId: undefined
            }
          })
        return createTokenResponse
      }
      return {
        code: 403,
        success: false,
        authtoken: undefined,
        userid: undefined,
        rootPersonId: undefined,
      }
    },
    async logout(token: string) {
      const dbResponse = conn.query({
        text: `DELETE FROM auth WHERE token=$1`,
        values: [
          token
        ]
      })
        .then((res) => {
          console.log('Successfully deleted token:', token)
          return {
            code: 204,
            success: true
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 400,
            success: false
          }
        })
      return dbResponse
    },
    async getUserIdFromToken(token: string) {
      const dbResponse = conn.query({
        text: `SELECT * FROM auth WHERE token=$1`,
        values: [
          token
        ]
      })
        .then((res) => {
          if (res && res.rows.length > 0) {
            return {
              code: 200,
              success: true,
              userId: res.rows[0].userid
            }
          }
          throw Error('Invalid token')
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 403,
            success: false,
            userId: undefined
          }
        })
      return dbResponse
    }
  }
}