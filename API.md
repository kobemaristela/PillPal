# API
This is the documentation for the REST backend of this service.

# Authentication

## Login
POST /api/login
```json
{
    "username": "user",
    "password": "pass",
}
```

An `ApiResponse` is returned. 
If it is successful, the payload is a `LoginResponse`.

## Registration
POST /api/login/register
```json
{
    "username": "user",
    "password": "pass",
}
```
An `ApiResponse` is returned. 
If it is successful, the payload is a `LoginResponse`.

# Medication

## Medication
POST /api/medication
```json
{
    "name": "medication name",
    "description": "medication description",
    "group": "medication group name",
}
```
An `ApiResponse` is returned. 
If it is successful, the payload is currently unspecified.

## Medication Group
POST /api/medication-group
```json
{
    "name": "medication group name"
}
```
An `ApiResponse` is returned. 
If it is successful, the payload is currently unspecified.

# Types

## ApiResponse
The response for an API call.

```
ApiResponse {
    "type": <"ok" or "error">,
    "data": <a JSON object>,
}
```

If `type` is `error`, `data` is an `ApiError`. 
Otherwise, `data` will vary based on the route of the API call.

## ApiError
```
ApiError {
    "message": <human-readable description of failure, as a string>
}
```

## LoginResponse
```
LoginResponse {
    "token": <JWT, as a string>
}
```