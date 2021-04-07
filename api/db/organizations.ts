import { PoolClient } from 'pg'
import { v4 as uuid } from 'uuid'

export default function (conn: PoolClient) {
  return {
    async createOrganization(token: string, name: string, locations: JSON[], positions: JSON[], rating: Number, description: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          id: '',
          name: '',
          locations: [],
          positions: [],
          rating: -1,
          description: ''
        }
      }
      const organizationId = uuid()
      const createOrganizationResponse = await conn.query({
        text: `INSERT INTO "organizations" ("id", "name", "locations", "positions", "rating", "description") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        values: [
          organizationId,
          name,
          locations,
          positions,
          rating,
          description
        ]
      })
        .then((res) => {
          console.log(res.rows[0])
          res.rows[0].locations.forEach(async (location: { id: string, name: string, description: string }) => {
            const locationDb = await conn.query({
              text: 'SELECT * FROM locations WHERE id=$1',
              values: [
                location.id
              ]
            })
              .then((res2) => {
                if (res2.rows.length > 0) {
                  return {
                    exists: true,
                    posId: res2.rows[0].id
                  }
                }
                return {
                  exists: false,
                  posId: null
                }
              })
              .catch((err) => {
                return {
                  exists: false,
                  posId: null,
                }
              })
            if (!locationDb.exists) {
              await conn.query({
                text: 'INSERT INTO "locations" ("id", "name", "description") VALUES ($1, $2, $3) RETURNING *;',
                values: [
                  location.id,
                  location.name,
                  location.description
                ]
              })
                .then((res2) => {
                  if (res2.rows.length > 0) {
                    return {
                      success: true,
                    }
                  }
                  return {
                    success: false
                  }
                })
                .catch((err) => {
                  return {
                    success: false
                  }
                })
            }
          })
          res.rows[0].positions.forEach(async (position: { id: string, name: string, description: string }) => {
            const positionDb = await conn.query({
              text: 'SELECT * FROM positions WHERE id=$1',
              values: [
                position.id
              ]
            })
              .then((res2) => {
                if (res2.rows.length > 0) {
                  return {
                    exists: true,
                    posId: res2.rows[0].id
                  }
                }
                return {
                  exists: false,
                  posId: null
                }
              })
              .catch((err) => {
                return {
                  exists: false,
                  posId: null,
                }
              })
            if (!positionDb.exists) {
              await conn.query({
                text: 'INSERT INTO "positions" ("id", "name", "description") VALUES ($1, $2, $3) RETURNING *;',
                values: [
                  position.id,
                  position.name,
                  position.description
                ]
              })
                .then((res2) => {
                  if (res2.rows.length > 0) {
                    return {
                      success: true,
                    }
                  }
                  return {
                    success: false
                  }
                })
                .catch((err) => {
                  return {
                    success: false
                  }
                })
            }
          })
          return {
            code: 201,
            success: true,
            id: res.rows[0].id,
            name: res.rows[0].name,
            locations: res.rows[0].locations,
            positions: res.rows[0].positions,
            rating: res.rows[0].rating,
            description: res.rows[0].description
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 500,
            success: false,
            id: '',
            name: '',
            locations: [],
            positions: [],
            rating: -1,
            description: ''
          }
        })
      return createOrganizationResponse
    },
    async getOrganizations(token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          organizations: [],
        }
      }
      const dbResponse = conn.query({
        text: `SELECT * FROM organizations`,
        values: []
      })
        .then((res) => {
          return {
            code: 200,
            success: true,
            organizations: res.rows
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 400,
            success: false,
            organizations: []
          }
        })
      return dbResponse
    },
    async getOrganization(id: string, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          id: '',
          name: '',
          locations: [],
          positions: [],
          rating: -1,
          description: ''
        }
      }
      const dbResponse = conn.query({
        text: 'SELECT * FROM organizations WHERE id=$1',
        values: [
          id,
        ]
      })
        .then((res) => {
          console.log(res.rows[0])
          return {
            code: 200,
            success: true,
            id: res.rows[0].id,
            name: res.rows[0].name,
            locations: res.rows[0].locations,
            positions: res.rows[0].positions,
            rating: res.rows[0].rating,
            description: res.rows[0].description
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 404,
            success: false,
            id: '',
            name: '',
            locations: [],
            positions: [],
            rating: -1,
            description: ''
          }
        })
      return dbResponse
    },
    async updateOrganization(organizationId: string, token: string, name: string, locations: JSON[], positions: JSON[], rating: Number, description: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          id: '',
          name: '',
          locations: [],
          positions: [],
          rating: -1,
          description: ''
        }
      }
      const dbResponse = conn.query({
        text: `UPDATE organizations SET name=$2, locations=$3, positions=$4, rating=$5, description=$6 WHERE "id"=$1 RETURNING *;`,
        values: [
          organizationId,
          name,
          locations,
          positions,
          rating,
          description
        ]
      })
        .then((res) => {
          console.log(res.rows[0])
          res.rows[0].locations.forEach(async (location: { id: string, name: string, description: string }) => {
            const locationDb = await conn.query({
              text: 'SELECT * FROM locations WHERE id=$1',
              values: [
                location.id
              ]
            })
              .then((res2) => {
                if (res2.rows.length > 0) {
                  return {
                    exists: true,
                    posId: res2.rows[0].id
                  }
                }
                return {
                  exists: false,
                  posId: null
                }
              })
              .catch((err) => {
                return {
                  exists: false,
                  posId: null,
                }
              })
            if (!locationDb.exists) {
              await conn.query({
                text: 'INSERT INTO "locations" ("id", "name", "description") VALUES ($1, $2, $3) RETURNING *;',
                values: [
                  location.id,
                  location.name,
                  location.description
                ]
              })
                .then((res2) => {
                  if (res2.rows.length > 0) {
                    return {
                      success: true,
                    }
                  }
                  return {
                    success: false
                  }
                })
                .catch((err) => {
                  return {
                    success: false
                  }
                })
            }
          })
          res.rows[0].positions.forEach(async (position: { id: string, name: string, description: string }) => {
            const positionDb = await conn.query({
              text: 'SELECT * FROM positions WHERE id=$1',
              values: [
                position.id
              ]
            })
              .then((res2) => {
                if (res2.rows.length > 0) {
                  return {
                    exists: true,
                    posId: res2.rows[0].id
                  }
                }
                return {
                  exists: false,
                  posId: null
                }
              })
              .catch((err) => {
                return {
                  exists: false,
                  posId: null,
                }
              })
            if (!positionDb.exists) {
              await conn.query({
                text: 'INSERT INTO "positions" ("id", "name", "description") VALUES ($1, $2, $3) RETURNING *;',
                values: [
                  position.id,
                  position.name,
                  position.description
                ]
              })
                .then((res2) => {
                  if (res2.rows.length > 0) {
                    return {
                      success: true,
                    }
                  }
                  return {
                    success: false
                  }
                })
                .catch((err) => {
                  return {
                    success: false
                  }
                })
            }
          })
          return {
            code: 200,
            success: true,
            id: res.rows[0].id,
            name: res.rows[0].name,
            locations: res.rows[0].locations,
            positions: res.rows[0].positions,
            rating: res.rows[0].rating,
            description: res.rows[0].description
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 500,
            success: false,
            id: '',
            name: '',
            locations: [],
            positions: [],
            rating: -1,
            description: ''
          }
        })
      return dbResponse
    },
    async deleteOrganization(id: string, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false
        }
      }
      const dbResponse = conn.query({
        text: 'DELETE FROM organizations WHERE id=$1',
        values: [
          id
        ]
      })
        .then((res) => {
          console.log('Successfully deleted organization with id:', id)
          return {
            code: 204,
            success: true,
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 500,
            success: false,
          }
        })
      return dbResponse
    },
    async addOrganizationLocation(id: string, location: { id: string, name: string, description: string }, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          locations: []
        }
      }

      const locationDb = await conn.query({
        text: 'SELECT * FROM locations WHERE id=$1',
        values: [
          location.id
        ]
      })
        .then((res) => {
          if (res.rows.length > 0) {
            return {
              exists: true,
              posId: res.rows[0].id
            }
          }
          return {
            exists: false,
            posId: null
          }
        })
        .catch((err) => {
          return {
            exists: false,
            posId: null,
          }
        })
      if (!locationDb.exists) {
        await conn.query({
          text: 'INSERT INTO "locations" ("id", "name", "description") VALUES ($1, $2, $3) RETURNING *;',
          values: [
            location.id,
            location.name,
            location.description
          ]
        })
          .then((res) => {
            if (res.rows.length > 0) {
              return {
                success: true,
              }
            }
            return {
              success: false
            }
          })
          .catch((err) => {
            return {
              success: false
            }
          })
      }

      const organization = await this.getOrganization(id, token)
      if (!organization.success) {
        return {
          code: 404,
          success: false,
          locations: []
        }
      } else if (!organization.locations) {
        organization.locations = []
      } else if (organization.locations.some((loc: { id: string, name: string, description: string }) => { loc.name === location.name })) {
        return {
          code: 400,
          success: false,
          locations: []
        }
      }
      if (!location.id) {
        location.id = uuid()
      }
      organization.locations.push(location)
      const updateOrganizationResponse = await this.updateOrganization(id, token, organization.name, organization.locations, organization.positions, organization.rating, organization.description)
      if (!updateOrganizationResponse.success) {
        return {
          code: 400,
          success: false,
          locations: []
        }
      }
      return {
        code: 201,
        success: true,
        locations: organization.locations
      }
    },
    async getOrganizationsByLocation(id: string, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          organizations: []
        }
      }
      const dbResponse = conn.query({
        text: `SELECT * FROM organizations`,
        values: []
      })
        .then((res) => {
          console.log(res.rows)
          let orgs = []
          for (let i = 0; i < res.rows.length; i++) {
            for (let j = 0; j < res.rows[i].locations.length; j++) {
              if (res.rows[i].locations[j].id === id) {
                orgs.push(res.rows[i])
                break
              }
            }
          }
          return {
            code: 200,
            success: true,
            organizations: orgs
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 404,
            success: false,
            organizations: []
          }
        })
      return dbResponse
    },
    async addOrganizationPosition(id: string, position: { id: string, name: string, description: string }, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          positions: []
        }
      }
      const positionDb = await conn.query({
        text: 'SELECT * FROM positions WHERE id=$1',
        values: [
          position.id
        ]
      })
        .then((res) => {
          if (res.rows.length > 0) {
            return {
              exists: true,
              posId: res.rows[0].id
            }
          }
          return {
            exists: false,
            posId: null
          }
        })
        .catch((err) => {
          return {
            exists: false,
            posId: null,
          }
        })
      if (!positionDb.exists) {
        await conn.query({
          text: 'INSERT INTO "positions" ("id", "name", "description") VALUES ($1, $2, $3) RETURNING *;',
          values: [
            position.id,
            position.name,
            position.description
          ]
        })
          .then((res) => {
            if (res.rows.length > 0) {
              return {
                success: true,
              }
            }
            return {
              success: false
            }
          })
          .catch((err) => {
            return {
              success: false
            }
          })
      }

      const organization = await this.getOrganization(id, token)
      if (!organization.success) {
        return {
          code: 404,
          success: false,
          positions: []
        }
      } else if (!organization.positions) {
        organization.positions = []
      } else if (organization.positions.some((loc: { id: string, name: string, description: string }) => { loc.name === position.name })) {
        return {
          code: 400,
          success: false,
          positions: []
        }
      }
      if (!position.id) {
        position.id = uuid()
      }
      organization.positions.push(position)
      const updateOrganizationResponse = await this.updateOrganization(id, token, organization.name, organization.locations, organization.positions, organization.rating, organization.description)
      if (!updateOrganizationResponse.success) {
        return {
          code: 400,
          success: false,
          positions: []
        }
      }
      return {
        code: 201,
        success: true,
        positions: organization.positions
      }
    },
    async getOrganizationsByPosition(id: string, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
          organizations: []
        }
      }
      const dbResponse = conn.query({
        text: `SELECT * FROM organizations`,
        values: []
      })
        .then((res) => {
          console.log(res.rows)
          let orgs = []
          for (let i = 0; i < res.rows.length; i++) {
            for (let j = 0; j < res.rows[i].positions.length; j++) {
              if (res.rows[i].positions[j].id === id) {
                orgs.push(res.rows[i])
                break
              }
            }
          }
          return {
            code: 200,
            success: true,
            organizations: orgs
          }
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 404,
            success: false,
            organizations: []
          }
        })
      return dbResponse
    },
    async updateOrganizationRating(id: string, rating: Number, token: string) {
      const authenticatedUser = await this.getUserIdFromToken(token)
      if (!authenticatedUser.success) {
        return {
          code: 403,
          success: false,
        }
      }
      const organization = await this.getOrganization(id, token)
      if (!organization.success) {
        return {
          code: 404,
          success: false
        }
      }
      organization.rating = rating
      const updateOrganizationResponse = await this.updateOrganization(id, token, organization.name, organization.locations, organization.positions, organization.rating, organization.description)
      if (!updateOrganizationResponse.success) {
        return {
          code: 400,
          success: false
        }
      }
      return {
        code: 200,
        success: true
      }
    },
    async getUserIdFromToken(token: string) {
      const dbResponse = conn.query({
        text: `SELECT * FROM auth WHERE token=$1`,
        values: [
          token
        ]
      })
        .then((res) => {
          if (res && res.rows.length > 0) {
            return {
              code: 200,
              success: true,
              userId: res.rows[0].userid
            }
          }
          throw Error('Invalid token')
        })
        .catch((err) => {
          console.error(err)
          return {
            code: 403,
            success: false,
            userId: undefined
          }
        })
      return dbResponse
    }
  }
}