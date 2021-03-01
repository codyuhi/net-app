import { PoolClient } from 'pg'
import users from './users'

export default function (conn: PoolClient) {
  return {
    users: users(conn)
  }
}