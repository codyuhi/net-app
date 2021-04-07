import express from 'express'
import { PoolClient } from 'pg'
import dbFactory from '../db'

export default function (pool: PoolClient) {
  return {
    async createPosition(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.positions.createPosition(req.header('authtoken')!, req.body.name, req.body.description)
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
          console.error(err.message, ': Unable to create position')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'Invalid authtoken. Unable to create position' : 'Unable to create position'
          })
        })
    },
    async getPositions(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.positions.getPositions(req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(200)
          res.send({
            success: true,
            positions: dbResponse.positions
          })
        })
        .catch((err) => {
          console.error(err.message, ': Unable to get positions')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'Invalid authtoken. Unable to get positions' : 'Unable to get positions'
          })
        })
    },
    async getPosition(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.positions.getPosition(req.path.split('/')[2], req.header('authtoken')!)
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
          console.error(err, ': Unable to get position')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'Invalid authtoken. Unable to get position' : 'Unable to get position'
          })
        })
    },
    async updatePosition(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.positions.updatePosition(req.path.split('/')[2], req.header('authtoken')!, req.body.name, req.body.description)
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
          console.error(err.message, ': Unable to update position')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'Invalid authtoken. Unable to update position' : 'Unable to update position'
          })
        })
    },
    async deletePosition(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.positions.deletePosition(req.path.split('/')[2], req.header('authtoken')!)
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
          console.error(err.message, ': Unable to delete position')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'Invalid authtoken. Unable to delete position' : 'Unable to delete position'
          })
        })
    }
  }
}