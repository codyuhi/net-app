import { Client, PoolClient } from 'pg'
import { v4 as uuid } from 'uuid'

export default function (conn: PoolClient) {
  return {
    async createPerson(token: string, rootPerson: boolean, firstName: string, lastName: string, organizationId: string, positionId: string, network: string[], dateRequested: Date, dateContacted: Date, replied: boolean, description: string) {
      if (!dateContacted) {
        dateContacted = new Date()
      }
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          id: '',
          rootPerson: false,
          firstName: '',
          lastName: '',
          organizationId: '',
          network: [],
          dateRequested: '',
          dateContacted: '',
          replied: false,
          description: ''
        }
      }
      const personId = uuid()
      const createPersonResponse = await conn.query({
        text: `INSERT INTO "persons" ("id", "rootperson", "firstname", "lastname", "organizationid", "positionid", "network", "daterequested", "datecontacted", "replied", "description") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;`,
        values: [
          personId,
          rootPerson,
          firstName,
          lastName,
          organizationId,
          positionId,
          network,
          dateRequested,
          dateContacted,
          replied,
          description
        ]
      })
        .then((res) => {
          console.log(res.rows[0])
          return {
            code: 201,
            success: true,
            id: res.rows[0].id,
            rootPerson: res.rows[0].rootperson,
            firstName: res.rows[0].firstname,
            lastName: res.rows[0].lastname,
            organizationId: res.rows[0].organizationid,
            positionId: res.rows[0].positionid,
            network: res.rows[0].network,
            dateRequested: res.rows[0].daterequested,
            dateContacted: res.rows[0].datecontacted,
            replied: res.rows[0].replied,
            description: res.rows[0].description
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 500,
            success: false,
            id: '',
            rootPerson: false,
            firstName: '',
            lastName: '',
            organizationId: '',
            network: [],
            dateRequested: '',
            dateContacted: '',
            replied: false,
            description: ''
          }
        })
      return createPersonResponse
    },
    async getPersons(token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          persons: [],
        }
      }
      const dbResponse = conn.query({
        text: `SELECT * FROM persons`,
        values: []
      })
        .then((res) => {
          return {
            code: 200,
            success: true,
            persons: res.rows
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 400,
            success: false,
            persons: []
          }
        })
      return dbResponse
    },
    async getPerson(id: string, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          id: '',
          rootPerson: false,
          firstName: '',
          lastName: '',
          organizationId: '',
          positionId: '',
          network: [],
          dateRequested: '',
          dateContacted: '',
          replied: false,
          description: ''
        }
      }
      const dbResponse = conn.query({
        text: 'SELECT * FROM persons WHERE id=$1',
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
            rootPerson: res.rows[0].rootperson,
            firstName: res.rows[0].firstname,
            lastName: res.rows[0].lastname,
            organizationId: res.rows[0].organizationid,
            positionId: res.rows[0].positionid,
            network: res.rows[0].network,
            dateRequested: res.rows[0].daterequested,
            dateContacted: res.rows[0].datecontacted,
            replied: res.rows[0].replied,
            description: res.rows[0].description
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 404,
            success: false,
            id: '',
            rootPerson: false,
            firstName: '',
            lastName: '',
            organizationId: '',
            positionId: '',
            network: [],
            dateRequested: '',
            dateContacted: '',
            replied: false,
            description: ''
          }
        })
      return dbResponse
    },
    async updatePerson(personId: string, token: string, rootPerson: boolean, firstName: string, lastName: string, organizationId: string, positionId: string, network: string[], dateRequested: Date, dateContacted: Date, replied: boolean, description: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          id: '',
          rootPerson: false,
          firstName: '',
          lastName: '',
          organizationId: '',
          positionId: '',
          network: [],
          dateRequested: '',
          dateContacted: '',
          replied: false,
          description: ''
        }
      }
      const dbResponse = conn.query({
        text: `UPDATE persons SET rootperson=$2, firstname=$3, lastname=$4, organizationid=$5, positionid=$6, network=$7, daterequested=$8, datecontacted=$9, replied=$10, description=$11 WHERE "id"=$1 RETURNING *;`,
        values: [
          personId,
          rootPerson,
          firstName,
          lastName,
          organizationId,
          positionId,
          network,
          dateRequested,
          dateContacted,
          replied,
          description
        ]
      })
        .then((res) => {
          console.log(res.rows[0])
          return {
            code: 200,
            success: true,
            id: res.rows[0].id,
            rootPerson: res.rows[0].rootperson,
            firstName: res.rows[0].firstname,
            lastName: res.rows[0].lastname,
            organizationId: res.rows[0].organizationid,
            positionId: res.rows[0].positionid,
            network: res.rows[0].network,
            dateRequested: res.rows[0].daterequested,
            dateContacted: res.rows[0].datecontacted,
            replied: res.rows[0].replied,
            description: res.rows[0].description
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 500,
            success: false,
            id: '',
            rootPerson: false,
            firstName: '',
            lastName: '',
            organizationId: '',
            network: [],
            dateRequested: '',
            dateContacted: '',
            replied: false,
            description: ''
          }
        })
      return dbResponse
    },
    async deletePerson(id: string, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false
        }
      }
      const getPersonResponse = await this.getPerson(id, token)
      // Don't allow rootPersons to be deleted
      if (getPersonResponse.success && getPersonResponse.rootPerson) {
        return {
          code: 400,
          success: false
        }
      }
      const dbResponse = conn.query({
        text: `DELETE FROM persons WHERE id=$1`,
        values: [
          id
        ]
      })
        .then((res) => {
          console.log('Successfully deleted person with id:', id)
          return {
            code: 204,
            success: true,
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
    async addPersonToNetwork(id: string, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          personId: '',
          network: []
        }
      }
      const rootPersonId = await conn.query({
        text: `SELECT * FROM users WHERE id=$1`,
        values: [
          authenticatedUser.userId
        ]
      })
        .then((res) => {
          return res.rows[0].rootperson
        })
        .catch((err) => {
          return null
        })
      if (!rootPersonId) {
        return {
          code: 404,
          success: false,
          personId: '',
          network: []
        }
      }
      let rootPerson = await this.getPerson(rootPersonId, token)
      if (!rootPerson.success) {
        return {
          code: 404,
          success: false,
          personId: '',
          network: []
        }
      } else if (!rootPerson.network) {
        rootPerson.network = []
      } else if (rootPerson.network.indexOf(id) > -1) {
        return {
          code: 400,
          success: false,
          personId: '',
          network: []
        }
      }
      rootPerson.network.push(id)
      const updatePersonResponse = await this.updatePerson(rootPerson.id, token, true, rootPerson.firstName, rootPerson.lastName, rootPerson.organizationId, rootPerson.positionId, rootPerson.network, rootPerson.dateRequested, rootPerson.dateContacted, rootPerson.replied, rootPerson.description)
      if (!updatePersonResponse.success) {
        return {
          code: 400,
          success: false,
          personId: '',
          network: []
        }
      }
      return {
        code: 201,
        success: true,
        personId: rootPersonId,
        network: rootPerson.network
      }
    },
    async getPersonsByNetwork(id: string, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          network: []
        }
      }
      const dbResponse = conn.query({
        text: 'SELECT * FROM persons WHERE id=$1',
        values: [
          id,
        ]
      })
        .then((res) => {
          console.log(res.rows[0])
          return {
            code: 200,
            success: true,
            network: res.rows[0].network
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 404,
            success: false,
            network: []
          }
        })
      return dbResponse
    },
    async deletePersonFromNetwork(id1: string, id2: string, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          personId: '',
          network: []
        }
      }
      const rootPersonId = await conn.query({
        text: `SELECT * FROM users WHERE id=$1`,
        values: [
          authenticatedUser.userId
        ]
      })
        .then((res) => {
          return res.rows[0].rootperson
        })
        .catch((err) => {
          return null
        })
      if (!rootPersonId) {
        return {
          code: 404,
          success: false,
          personId: '',
          network: []
        }
      }
      let rootPerson = await this.getPerson(rootPersonId, token)
      if (!rootPerson.success) {
        return {
          code: 404,
          success: false,
          personId: '',
          network: []
        }
      }
      if (!rootPerson.network) {
        return {
          code: 204,
          success: true,
          personId: rootPersonId,
          network: []
        }
      }
      const index = rootPerson.network.indexOf(id2)
      if (index > -1) {
        rootPerson.network.splice(index, 1)
      } else {
        return {
          code: 204,
          success: true,
          personId: rootPersonId,
          network: rootPerson.network
        }
      }
      const updatePersonResponse = await this.updatePerson(rootPerson.id, token, true, rootPerson.firstName, rootPerson.lastName, rootPerson.organizationId, rootPerson.positionId, rootPerson.network, rootPerson.dateRequested, rootPerson.dateContacted, rootPerson.replied, rootPerson.description)
      if (!updatePersonResponse.success) {
        return {
          code: 400,
          success: false,
          personId: '',
          network: []
        }
      }
      return {
        code: 204,
        success: true,
        personId: rootPersonId,
        network: rootPerson.network

      }
    },
    async updateDateRequested(id: string, datetime: Date, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
        }
      }
      let person = await this.getPerson(id, token)
      if (!person.success) {
        return {
          code: 404,
          success: false,
        }
      }
      person.dateRequested = datetime
      const updatePersonResponse = await this.updatePerson(person.id, token, person.rootPerson, person.firstName, person.lastName, person.organizationId, person.positionId, person.network, person.dateRequested, person.dateContacted, person.replied, person.description)
      if (!updatePersonResponse.success) {
        return {
          code: 400,
          success: false
        }
      }
      return {
        code: 200,
        success: true,
      }
    },
    async updateDateContacted(id: string, datetime: Date, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
        }
      }
      let person = await this.getPerson(id, token)
      if (!person.success) {
        return {
          code: 404,
          success: false,
        }
      }
      person.dateContacted = datetime
      const updatePersonResponse = await this.updatePerson(person.id, token, person.rootPerson, person.firstName, person.lastName, person.organizationId, person.positionId, person.network, person.dateRequested, person.dateContacted, person.replied, person.description)
      if (!updatePersonResponse.success) {
        return {
          code: 400,
          success: false
        }
      }
      return {
        code: 200,
        success: true,
      }
    },
    async updatePersonReplied(id: string, replied: boolean, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
        }
      }
      let person = await this.getPerson(id, token)
      if (!person.success) {
        return {
          code: 404,
          success: false,
        }
      }
      person.replied = replied
      const updatePersonResponse = await this.updatePerson(person.id, token, person.rootPerson, person.firstName, person.lastName, person.organizationId, person.positionId, person.network, person.dateRequested, person.dateContacted, person.replied, person.description)
      if (!updatePersonResponse.success) {
        return {
          code: 400,
          success: false
        }
      }
      return {
        code: 200,
        success: true,
      }
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