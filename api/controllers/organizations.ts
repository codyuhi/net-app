import express, { request } from 'express'
import { PoolClient } from 'pg'
import dbFactory from '../db'

export default function (pool: PoolClient) {
  return {
    async createOrganization(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.organizations.createOrganization(req.header('authtoken')!, req.body.name, req.body.locations, req.body.positions, req.body.rating, req.body.description)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(201)
          res.send({
            success: true,
            organizationId: dbResponse.id,
            name: dbResponse.name,
            locations: dbResponse.locations,
            positions: dbResponse.positions,
            rating: dbResponse.rating,
            description: dbResponse.description
          })
        })
        .catch((err) => {
          console.error(err.message, ': Unable to create Organization')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'Invalid authtoken. Unable to create Organization' : 'Unable to create Organization'
          })
        })
    },
    async getOrganizations(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.organizations.getOrganizations(req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(200)
          res.send({
            success: true,
            organizations: dbResponse.organizations
          })
        })
        .catch((err) => {
          console.error(err.message, ': Unable to get Organizations')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'Invalid authtoken. Unable to create Organization' : 'Unable to get Organizations'
          })
        })
    },
    async getOrganization(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.organizations.getOrganization(req.path.split('/')[2], req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(200)
          res.send({
            success: true,
            data: {
              id: dbResponse.id,
              name: dbResponse.name,
              locations: dbResponse.locations,
              positions: dbResponse.positions,
              rating: dbResponse.rating,
              description: dbResponse.description
            }
          })
        })
        .catch((err) => {
          console.error(err.message, 'Unable to get Organization information')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'You are not allowed to access this resource' : 'Unable to find Organization with id ' + req.path.split('/')[2]
          })
        })
    },
    async updateOrganization(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.organizations.updateOrganization(req.path.split('/')[2], req.header('authtoken')!, req.body.name, req.body.locations, req.body.positions, req.body.rating, req.body.description)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(200)
          res.send({
            success: true,
            organizationId: dbResponse.id,
            name: dbResponse.name,
            locations: dbResponse.locations,
            positions: dbResponse.positions,
            rating: dbResponse.rating,
            description: dbResponse.description
          })
        })
        .catch((err) => {
          console.error(err.message, ': Unable to update Organization')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'You are not allowed to access this resource' : 'Unable to update Organization'
          })
        })
    },
    async deleteOrganization(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue'
        })
        return
      }
      const db = dbFactory(pool)
      db.organizations.deleteOrganization(req.path.split('/')[2], req.header('authtoken')!)
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
          console.error(err.message, ': Unable to delete Organization')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'You are not allowed to access this resource' : err.message === '404' ? 'Unable to find Organization by id' : 'Unable to delete Organization'
          })
        })
    },
    async addOrganizationLocation(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue'
        })
      }
      const db = dbFactory(pool)
      db.organizations.addOrganizationLocation(req.path.split('/')[2], req.body.location, req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(201)
          res.send({
            success: true,
            locations: dbResponse.locations
          })
        })
        .catch((err) => {
          console.error(err)
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '404' ? 'Unable to find Organization to add to locations' : 'Unable to add location to Organization'
          })
        })
    },
    async getOrganizationsByLocation(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue'
        })
      }
      const db = dbFactory(pool)
      db.organizations.getOrganizationsByLocation(req.path.split('/')[3], req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(200)
          res.send({
            success: true,
            organizations: dbResponse.organizations
          })
        })
        .catch((err) => {
          console.error(err.message, ': Unable to get organizations by location id')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: 'Unable to get organizations by location id'
          })
        })
    },
    async addOrganizationPosition(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue'
        })
      }
      const db = dbFactory(pool)
      db.organizations.addOrganizationPosition(req.path.split('/')[2], req.body.position, req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(201)
          res.send({
            success: true,
            positions: dbResponse.positions
          })
        })
        .catch((err) => {
          console.error(err)
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '404' ? 'Unable to find Organization to add to position' : 'Unable to add position to Organization'
          })
        })
    },
  }
}