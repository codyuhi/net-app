import express from 'express'

export default function () {
  return {
    async createAccount(req: express.Request, res: express.Response) {
      res.status(201)
      res.send({
        success: true
      })
    },
    async getAccount(req: express.Request, res: express.Response) {
      res.status(200)
      res.send({
        success: true,
        data: {
          id: req.path.slice(10),
          username: 'test',
          personId: 'test'
        }
      })
    },
    async updateAccount(req: express.Request, res: express.Response) {
      res.status(200)
      res.send({
        success: true,
        data: {
          id: req.body.id,
          username: req.body.username,
          personId: req.body.personId
        }
      })
    },
    async deleteAccount(req: express.Request, res: express.Response) {
      res.status(204)
      res.send({
        success: true
      })
    }
  }
}