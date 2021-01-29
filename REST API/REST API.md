Cody Uhi
IT410 - 1
Prof. James Speirs
1/17/21

# REST API

## From Domain Driven Design to REST

### User Account (Entity)
| Properties | Events | Commands | Queries |
| --- | --- | --- | --- |
| <ul><li>id (string)</li><li>username (string)</li><li>password (string)</li><li>person id (string)</li></ul> | <ul><li>user account created</li><li>user account deleted</li><li>user account updated</li><li>user password updated</li></ul> | <ul><li>create user account</li><li>set user account data</li><li>delete user account</li><li>authenticate user</li></ul> | <ul><li>get user account info</li></ul> |

### Person (Entity)
| Properties | Events | Commands | Queries |
| --- | --- | --- | --- |
| <ul><li>id (string)</li><li>first name (string)</li><li>last name (string)</li><li>organization id (string)</li><li>position id</li><li>network (Array\<string\>)</li><li>date requested (date)</li><li>date added (date)</li><li>date contacted (date)</li><li>replied (bool)</li><li>description (text)</li></ul> | <ul><li>person created</li><li>person deleted</li><li>person updated</li><li>person added to network</li><li>person removed from network</li><li>connection request sent to person</li><li>connection request accepted by person</li><li>person contacted</li><li>person replied</li></ul> | <ul><li>create person</li><li>set person data</li><li>delete person</li><li>add person to network</li><li>remove person from network</li><li>set person date requested data</li><li>set person date added data</li><li>set person date contacted data</li><li>set person replied data</li></ul> | <ul><li>get person info</li><li>get list of persons based on network</li></ul> |

### Organization (Entity)
| Properties | Events | Commands | Queries |
| --- | --- | --- | --- |
| <ul><li>id (string)</li><li>name (string)</li><li>locations (Array\<string\>)</li><li>positions (Array\<string\>)</li><li>rating (int)</li><li>description (string)</li></ul> | <ul><li>organization created</li><li>organization deleted</li><li>organization updated</li><li>organization added new location</li><li>organization added new position</li><li>organization rating changed</li></ul> | <ul><li>create organization</li><li>set organization data</li><li>delete organization</li><li>add new organization location</li><li>add new organization position</li><li>set organization rating data</li></ul> | <ul><li>get organization info</li><li>get list of organizations based on location</li><li>get list of organizations based on position</li></ul> |

### Application (Entity)
| Properties | Events | Commands | Queries |
| --- | --- | --- | --- |
| <ul><li>id (string)</li><li>organization id (string)</li><li>position id (string)</li><li>files (Array\<string\>)</li><li>status (int)</li><li>date submitted (date)</li><li>description (string)</li><li>notes (string)</li></ul> | <ul><li>application created</li><li>application deleted</li><li>application updated</li><li>application status changed</li></ul> | <ul><li>create application</li><li>set application data</li><li>delete application</li><li>set application status data</li></ul> | <ul><li>get application info</li><li>get list of applications based on organization</li><li>get list of applications based on position</li><li>get list of applications based on status</li></ul> |

### Location (Value Object)
| Properties | Events | Commands | Queries |
| --- | --- | --- | --- |
| <ul><li>id (string)</li><li>name (string)</li><li>description (string)</li></ul> | <ul><li>location created</li><li>location deleted</li><li>location updated</li></ul> | <ul><li>create location</li><li>set location data</li><li>delete location</li></ul> | <ul><li>get location info</li></ul> |

### Position (Value Object)
| Properties | Events | Commands | Queries |
| --- | --- | --- | --- |
| <ul><li>id (string)</li><li>name (string)</li><li>description (string)</li></ul> | <ul><li>position created</li><li>position deleted</li><li>position updated</li></ul> | <ul><li>create position</li><li>set position data</li></ul> | <ul><li>get position info</li></ul> |

### File (Value Object)
| Properties | Events | Commands | Queries |
| --- | --- | --- | --- |
| <ul><li>id (string)</li><li>name (string)</li><li>mime type (string)</li><li>file path (string)</li></ul> | <ul><li>file uploaded</li><li>file deleted</li></ul> | <ul><li>upload file</li><li>delete file</li></ul> | <ul><li>download file</li></ul> |

### Session (Value Object)
| Properties | Events | Commands | Queries |
| --- | --- | --- | --- |
| <ul><li>id (string)</li><li>user id (string)</li><li>expiration (date)</li></ul> | <ul><li>session created</li><li>session deleted</li><li>session expired</li></ul> | <ul><li>create session (login)</li><li>delete session (logout)</li></ul> |  |

____

## Endpoints

| Query | URL Fragment | HTTP Method | Path Parameters |
| --- | --- | --- | --- |
| create user account | `/accounts` | POST |  |
| edit user account | `/accounts/{account_id}` | PUT | `account_id` |
| delete user account | `/accounts/{account_id}` | DELETE | `account_id` |
| login | `/accounts/login` | POST |  |
| logout | `/accounts/logout` | DELETE |  |
| get user account info | `/accounts/{account_id}` | GET | `account_id` |
| create person | `/persons` | POST |  |
| edit person | `/persons/{person_id}` | PUT | `person_id` |
| delete person | `/persons/{person_id}` | DELETE | `person_id` |
| add person to network | `/persons/{person_id}/network` | POST | `person_id` |
| remove person from network | `/persons/{person_id}/network/{person2_id}` | DELETE | `person_id`, `person2_id` |
| set person date requested data | `/persons/{person_id}/daterequested` | PUT | `person_id` |
| set person date added data | `/persons/{person_id}/dateadded` | PUT | `person_id` |
| set person date contacted data | `/persons/{person_id}/datecontacted` | PUT | `person_id` |
| set person replied data | `/persons/{person_id}/personreplied` | PUT | `person_id` |
| get person info | `/persons/{person_id}` | GET | `person_id` |
| get list of persons based on network | `/persons/{person_id}/network` | GET | `person_id` |
| create organization | `/organizations` | POST |  |
| edit organization | `/organizations/{organization_id}` | PUT | `organization_id` |
| delete organization | `/organizations/{organization_id}` | DELETE | `organization_id` |
| add new organization location | `/organizations/{organization_id}/locations` | POST | `organization_id` |
| add new organization position | `/organizations/{organization_id}/positions` | POST | `organization_id` |
| set organization rating data | `/organizations/{organization_id}/ratings` | PUT | `organization_id` |
| get organization info | `/organizations/{organization_id}` | GET | `organization_id` |
| get list of organizations based on location | `/organizations/{organization_id}/locations` | GET | `organization_id` |
| get list of organizations based on position | `/organizations/{organization_id}/positions` | GET | `organization_id` |
| create application | `/applications` | POST |  |
| edit application | `/applications/{application_id}` | PUT | `application_id` |
| delete application | `/applications/{application_id}` | DELETE | `application_id` |
| set application status | `/applications/{application_id}/status` | PUT | `application_id` |
| get application info | `/applications/{application_id}` | GET | `application_id` |
| get list of applications based on organization | `/applications/organizations/{organization_id}` | GET | `organization_id` |
| get list of applications based on position | `/applications/positions/{position_id}` | GET | `position_id` |
| get list of applications based on status | `/applications/statuses/{status}` | GET | `status` |
| create location | `/locations` | POST |  |
| edit location | `/locations/{location_id}` | PUT | `location_id` |
| delete location | `/locations/{location_id}` | DELETE | `location_id` |
| get location info | `/locations/{location_id}` | GET | `location_id` |
| create position | `/positions` | POST |  |
| edit position | `/positions/{position_id}` | PUT | `position_id` |
| delete position | `/positions/{position_id}` | DELETE | `position_id` |
| get position info | `/positions/{position_id}` | GET | `position_id` |
| upload file | `/files` | POST |  |
| delete file | `/files/{file_id}` | DELETE | `file_id` |
| download file | `/files/{file_id}` | GET | `file_id` |

____
## Representations

### User Account
```
{
  "id": "uuid",
  "username": "string",
  "person_id": "personuuid"
}
```

### Person
```
{
  "id": "uuid",
  "first_name": "string",
  "last_name": "string",
  "organization_id": "orguuid",
  "position_id": "positionuuid",
  "network": [
    "personuuid",
    "personuuid2"
  ],
  "date_requested": "2021-01-01T08:00:00.00Z",
  "date_added": "2021-01-01T08:00:00.00Z",
  "date_contacted": null,
    // If date values are null,
    // the event hasn't happened yet
  "replied": false,
  "description":, "string"
}
```

### Organization
```
{
  "id": "uuid",
  "name": "string",
  "locations": [
    "locationuuid",
    "locationuuid2"
  ],
  "positions": [
    "positionuuid",
    "positionuuid2"
  ],
  "rating": 7,
  "description": "string"
}
```

### Application
```
{
  "id": "uuid",
  "organization_id": "orguuid",
  "position_id": "positionuuid",
  "files": [
    "fileuuid",
    "fileuuid2"
  ],
  "status": 0,
  "date_submitted": "2021-01-01T08:00:00.00Z",
  "description": "string",
  "notes": "string"
}
```

### Location
```
{
  "id": "uuid",
  "name": "string",
  "description": "string"
}
```

### Position
```
{
  "id": "uuid",
  "name": "string",
  "description": "string"
}
```

### File
```
{
  "id": "uuid",
  "name": "string",
  "mime_type": "PDF",
  "file_path": "/test/path"
}
```

### Session
```
{
  "id": "uuid",
  "user_id": "useruuid",
  "expiration": "2021-01-01T08:00:00.00Z"
}
```