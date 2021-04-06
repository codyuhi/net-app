import express from 'express'
import { PoolClient } from 'pg'
import dbFactory from '../db'

export default function (pool: PoolClient) {
  return {
    async createAccount(req: express.Request, res: express.Response) {
      const db = dbFactory(pool)
      db.users.createAccount(req.body.username, req.body.password, req.body.firstName, req.body.lastName)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(201)
          res.send({
            success: true,
            id: dbResponse.id,
            rootPersonId: dbResponse.personId,
            token: dbResponse.authtoken
          })
        })
        .catch((err) => {
          console.error(err.message, ': Unable to create user')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '400' ? 'This username is already taken' : 'Unable to create user'
          })
        })
    },
    async getAccount(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.users.getAccount(req.path.slice(10), req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
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
          console.error(err.message, 'Unable to get user information')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'You are not allowed to access this resource' : 'Unable to find User with id ' + req.path.slice(10)
          })
        })
    },
    async updateAccount(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        console.log('got here')
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.users.updateAccount(req.body.id, req.body.username, req.body.password, req.body.personId, req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(200)
          res!.send({
            success: true,
            data: {
              id: dbResponse.id,
              username: dbResponse.username,
              personId: dbResponse.personId
            }
          })
        })
        .catch((err) => {
          console.error(err.message, ': Unable to update user')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'You are not allowed to access this resource' : 'Unable to update User'
          })
        })
    },
    async deleteAccount(req: express.Request, res: express.Response) {
      if (!req.header('authtoken')) {
        res.status(403)
        res.send({
          success: false,
          message: 'Invalid session. Please login again to continue.'
        })
        return
      }
      const db = dbFactory(pool)
      db.users.deleteAccount(req.path.slice(10), req.header('authtoken')!)
        .then((dbResponse) => {
          if (!dbResponse.success) {
            throw Error(dbResponse.code.toString())
          }
          res.status(204)
          res.send({
            success: true
          })
        })
        .catch((err) => {
          console.error(err.message, ': Unable to delete User')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'You are not allowed to access this resource' : 'Unable to delete User'
          })
        })
    },
    async login(req: express.Request, res: express.Response) {
      const db = dbFactory(pool)
      if (!req.body.username || !req.body.password) {
        res.status(400)
        res.send({
          success: false,
          message: 'Invalid data format provided. Please provide a Username and Password'
        })
        return
      }
      db.users.login(req.body.username, req.body.password)
        .then((dbResponse) => {
          if (!dbResponse.success || !dbResponse.authtoken) {
            throw Error(dbResponse.code.toString())
          }
          res.status(201)
          res.send({
            success: true,
            token: dbResponse.authtoken,
            id: dbResponse.userid
          })
        })
        .catch((err) => {
          console.error(err.message, ': Unable to login')
          res.status(parseInt(err.message))
          res.send({
            success: false,
            message: err.message === '403' ? 'Invalid Username/Password combination' : 'Unable to login'
          })
        })
    },
    async logout(req: express.Request, res: express.Response) {
      const db = dbFactory(pool)
      if (req && req.header('authtoken')) {
        db.users.logout(req.header('authtoken')!)
          .then((dbResponse) => {
            if (!dbResponse.success) {
              throw Error('Unable to logout')
            }
            res.status(204)
            res.send({
              success: true
            })
          })
          .catch((err) => {
            console.error(err.message, ': Unable to logout')
            res.status(400)
            res.send({
              success: false,
              message: 'Unable to logout'
            })
          })
      } else {
        res.status(400)
        res.send({
          success: false,
          message: 'No authtoken provided'
        })
      }
    }
  }
}