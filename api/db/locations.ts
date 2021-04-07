import { PoolClient } from 'pg'
import { v4 as uuid } from 'uuid'

export default function (conn: PoolClient) {
  return {
    async createLocation(token: string, name: string, description: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          id: '',
          name: '',
          description: ''
        }
      }
      const id = uuid()
      const createLocationResponse = await conn.query({
        text: `INSERT INTO "locations" ("id", "name", "description") VALUES ($1, $2, $3) RETURNING *;`,
        values: [
          id,
          name,
          description
        ]
      })
        .then((res) => {
          console.log(res.rows[0])
          return {
            code: 201,
            success: true,
            id: res.rows[0].id,
            name: res.rows[0].name,
            description: res.rows[0].description
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 500,
            success: false,
            id: '',
            name: '',
            description: '',
          }
        })
      return createLocationResponse
    },
    async getLocations(token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          locations: []
        }
      }
      const dbResponse = await conn.query({
        text: 'SELECT * FROM locations',
        values: []
      })
        .then((res) => {
          console.log(res.rows)
          return {
            code: 200,
            success: true,
            locations: res.rows
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 500,
            success: false,
            locations: []
          }
        })
      return dbResponse
    },
    async getLocation(id: string, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          id: '',
          name: '',
          description: ''
        }
      }
      const dbResponse = await conn.query({
        text: 'SELECT * FROM locations WHERE id=$1',
        values: [
          id
        ]
      })
        .then((res) => {
          console.log(res.rows[0])
          return {
            code: 200,
            success: true,
            id: res.rows[0].id,
            name: res.rows[0].name,
            description: res.rows[0].description
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 500,
            success: false,
            id: '',
            name: '',
            description: ''
          }
        })
      return dbResponse
    },
    async updateLocation(id: string, token: string, name: string, description: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          id: '',
          name: '',
          description: ''
        }
      }
      const dbResponse = await conn.query({
        text: 'UPDATE locations SET name=$2, description=$3 WHERE "id"=$1 RETURNING *;',
        values: [
          id,
          name,
          description
        ]
      })
        .then((res) => {
          console.log(res.rows[0])
          return {
            code: 200,
            success: true,
            id: res.rows[0].id,
            name: res.rows[0].name,
            description: res.rows[0].description
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 500,
            success: false,
            id: '',
            name: '',
            description: ''
          }
        })
      return dbResponse
    },
    async deleteLocation(id: string, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          id: '',
          name: '',
          description: ''
        }
      }
      const dbResponse = await conn.query({
        text: 'DELETE FROM locations WHERE id=$1',
        values: [
          id
        ]
      })
        .then((res) => {
          return {
            code: 204,
            success: true
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 500,
            success: false,
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