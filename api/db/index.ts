import { PoolClient } from 'pg'
import persons from './persons'
import users from './users'
import organizations from './organizations'
import locations from './locations'
import positions from './positions'

export default function (conn: PoolClient) {
  return {
    users: users(conn),
    persons: persons(conn),
    organizations: organizations(conn),
    locations: locations(conn),
    positions: positions(conn)
  }
}