import express from 'express'
import { PoolClient } from 'pg'
import dbFactory from '../db'

export default function (pool: PoolClient) {
  return {
    async createLocation(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.locations.createLocation(req.header('authtoken')!, req.body.name, req.body.description)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(201)
          res.send({
            success: true,
            id: dbResponse.id,
            name: dbResponse.name,
            description: dbResponse.description
          })
        })
        .catch((err) => {
          console.error(err.message, ': Unable to create location')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'Invalid authtoken. Unable to create location' : 'Unable to create location'
          })
        })
    },
    async getLocations(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.locations.getLocations(req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(200)
          res.send({
            success: true,
            locations: dbResponse.locations
          })
        })
        .catch((err) => {
          console.error(err.message, ': Unable to get locations')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'Invalid authtoken. Unable to get Locations' : 'Unable to get Locations'
          })
        })
    },
    async getLocation(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.locations.getLocation(req.path.split('/')[2], req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(200)
          res.send({
            success: true,
            id: dbResponse.id,
            name: dbResponse.name,
            description: dbResponse.description
          })
        })
        .catch((err) => {
          console.error(err, ': Unable to get Location')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'Invalid authtoken. Unable to get Location' : 'Unable to get Location'
          })
        })
    },
    async updateLocation(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.locations.updateLocation(req.path.split('/')[2], req.header('authtoken')!, req.body.name, req.body.description)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(200)
          res.send({
            success: true,
            id: dbResponse.id,
            name: dbResponse.name,
            description: dbResponse.description
          })
        })
        .catch((err) => {
          console.error(err.message, ': Unable to update Location')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'Invalid authtoken. Unable to update Location' : 'Unable to update Location'
          })
        })
    },
    async deleteLocation(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.locations.deleteLocation(req.path.split('/')[2], req.header('authtoken')!)
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
          console.error(err.message, ': Unable to delete Location')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'Invalid authtoken. Unable to delete Location' : 'Unable to delete Location'
          })
        })
    }
  }
}