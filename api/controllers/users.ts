import express from 'express'
import { PoolClient } from 'pg'
import dbFactory from '../db'

export default function (pool: PoolClient) {
  return {
    async createAccount(req: express.Request, res: express.Response) {
      const db = dbFactory(pool)
      db.users.createAccount(req.body.username, req.body.password)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw 'Unable to create User'
          }
          res.status(201)
          res.send({
            success: true,
            id: dbResponse.id,
            rootPersonId: dbResponse.personId
          })
        })
        .catch((err) => {
          console.error(err)
          res.status(500)
          res.send({
            success: false,
            message: err
          })
        })
    },
    async getAccount(req: express.Request, res: express.Response) {
      const db = dbFactory(pool)
      db.users.getAccount(req.path.slice(10))
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw 'Unable to find User with id ' + req.path.slice(10)
          }
          res.status(200)
          res.send({
            success: true,
            data: {
              id: dbResponse.id,
              username: dbResponse.username,
              personId: dbResponse.personId
            }
          })
        })
        .catch((err) => {
          console.error(err)
          res.status(404)
          res.send({
            success: false,
            message: err
          })
        })
    },
    async updateAccount(req: express.Request, res: express.Response) {
      const db = dbFactory(pool)
      db.users.updateAccount(req.body.id, req.body.username, req.body.password, req.body.personId)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw 'Unable to update User'
          }
          res.status(200)
          res.enforcer.send({
            success: true,
            data: {
              id: dbResponse.id,
              username: dbResponse.username,
              personId: dbResponse.personId
            }
          })
        })
        .catch((err) => {
          console.error(err)
          res.status(500)
          res.send({
            success: false,
            message: err
          })
        })
    },
    async deleteAccount(req: express.Request, res: express.Response) {
      const db = dbFactory(pool)
      db.users.deleteAccount(req.path.slice(10))
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw 'Unable to delete User'
          }
          res.status(204)
          res.send({
            success: true
          })
        })
        .catch((err) => {
          console.error(err)
          res.status(500)
          res.send({
            success: false,
            message: err
          })
        })
    }
  }
}