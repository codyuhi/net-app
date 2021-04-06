import { PoolClient } from 'pg'
import persons from './persons'
import users from './users'
import organizations from './organizations'

export default function (conn: PoolClient) {
  return {
    users: users(conn),
    persons: persons(conn),
    organizations: organizations(conn),
  }
}