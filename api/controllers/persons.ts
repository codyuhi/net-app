import express from 'express'
import { PoolClient } from 'pg'
import dbFactory from '../db'

export default function (pool: PoolClient) {
  return {
    async createPerson(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.persons.createPerson(req.header('authtoken')!, req.body.rootPerson, req.body.firstName, req.body.lastName, req.body.organizationId, req.body.positionId, req.body.network, req.body.dateRequested, req.body.dateContacted, req.body.replied, req.body.description)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(201)
          res.send({
            success: true,
            personId: dbResponse.id,
            rootPerson: dbResponse.rootPerson,
            firstName: dbResponse.firstName,
            lastName: dbResponse.lastName,
            organizationId: dbResponse.organizationId,
            network: dbResponse.network,
            dateRequested: dbResponse.dateRequested,
            dateContacted: dbResponse.dateContacted,
            replied: dbResponse.replied,
            description: dbResponse.description,
          })
        })
        .catch((err) => {
          console.error(err.message, ': Unable to create Person')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'Invalid authtoken. Unable to create Person' : 'Unable to create Person'
          })
        })
    },
    async getPersons(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.persons.getPersons(req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(200)
          res.send({
            success: true,
            data: {
              persons: dbResponse.persons
            }
          })
        })
        .catch((err) => {
          console.error(err.message, 'Unable to get persons')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'You are not allowed to access this resource' : 'Unable to get Persons data'
          })
        })
    },
    async getPerson(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.persons.getPerson(req.path.slice(9), req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(200)
          res.send({
            success: true,
            data: {
              id: dbResponse.id,
              rootPerson: dbResponse.rootPerson,
              firstName: dbResponse.firstName,
              lastName: dbResponse.lastName,
              organizationId: dbResponse.organizationId,
              positionId: dbResponse.positionId,
              network: dbResponse.network,
              dateRequested: dbResponse.dateRequested,
              dateContacted: dbResponse.dateContacted,
              replied: dbResponse.replied,
              description: dbResponse.description,
            }
          })
        })
        .catch((err) => {
          console.error(err.message, 'Unable to get Person information')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'You are not allowed to access this resource' : 'Unable to find Person with id ' + req.path.slice(9)
          })
        })
    },
    async updatePerson(req: express.Request, res: express.Response) {
      console.log('ASDF')
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.persons.updatePerson(req.path.slice(9), req.header('authtoken')!, req.body.rootPerson, req.body.firstName, req.body.lastName, req.body.organizationId, req.body.positionId, req.body.network, req.body.dateRequested, req.body.dateContacted, req.body.replied, req.body.description)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(200)
          res!.send({
            success: true,
            personId: dbResponse.id,
            rootPerson: dbResponse.rootPerson,
            firstName: dbResponse.firstName,
            lastName: dbResponse.lastName,
            organizationId: dbResponse.organizationId,
            network: dbResponse.network,
            dateRequested: dbResponse.dateRequested,
            dateContacted: dbResponse.dateContacted,
            replied: dbResponse.replied,
            description: dbResponse.description,
          })
        })
        .catch((err) => {
          console.error(err.message, ': Unabled to update Person')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'You are not allowed to access this resource' : 'Unable to update Person with id ' + req.path.slice(9)
          })
        })
    },
    async deletePerson(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue'
        })
        return
      }
      const db = dbFactory(pool)
      db.persons.deletePerson(req.path.slice(9), req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(204)
          res.send({
            success: true,
          })
        })
        .catch((err) => {
          console.error(err.message, ': Unable to delete Person')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'You are not allowed to access this resource' : err.message === '400' ? 'Unable to delete root person' : 'Unable to delete Person'
          })
        })
    },
    async addPersonToNetwork(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue'
        })
      }
      const db = dbFactory(pool)
      db.persons.addPersonToNetwork(req.path.split('/')[2], req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(201)
          res.send({
            success: true,
            personId: dbResponse.personId,
            network: dbResponse.network
          })
        })
        .catch((err) => {
          console.error(err)
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '404' ? 'Unable to find Person to add to network' : 'Unable to add Person to network'
          })
        })
    },
    async getPersonsByNetwork(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.persons.getPersonsByNetwork(req.path.split('/')[2], req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(200)
          res.send({
            success: true,
            network: dbResponse.network
          })
        })
        .catch((err) => {
          console.error(err.message, 'Unable to get network of Persons')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '404' ? 'Unable to find a network for the provided Person id' : 'Unable to get network of Persons'
          })
        })
    },
    async deletePersonFromNetwork(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.persons.deletePersonFromNetwork(req.path.split('/')[2], req.path.split('/')[4], req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(204)
          res.send({
            success: true,
            personId: dbResponse.personId,
            network: dbResponse.network
          })
        })
        .catch((err) => {
          console.error(err.message, 'Unable to delete Person from network')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: 'Unable to delete Person from network'
          })
        })
    },
    async updateDateRequested(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.persons.updateDateRequested(req.path.split('/')[2], req.body.datetime, req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(200)
          res.send({
            success: true,
          })
        })
        .catch((err) => {
          console.error(err)
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'You are not allowed to access this resource' : 'Unable to update date requested'
          })
        })
    },
    async updateDateContacted(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.persons.updateDateContacted(req.path.split('/')[2], req.body.datetime, req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(200)
          res.send({
            success: true,
          })
        })
        .catch((err) => {
          console.error(err)
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'You are not allowed to access this resource' : 'Unable to update date contacted'
          })
        })
    },
    async updatePersonReplied(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.persons.updatePersonReplied(req.path.split('/')[2], req.body.replied, req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(200)
          res.send({
            success: true,
          })
        })
        .catch((err) => {
          console.error(err)
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'You are not allowed to access this resource' : 'Unable to update replied status'
          })
        })
    }
  }
}