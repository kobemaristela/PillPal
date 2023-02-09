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

## Create Medication
POST /api/medication
```json
{
    "name": "medication name",
    "description": "medication description"
}
```
An `ApiResponse` is returned. 
If it is successful, the payload is currently unspecified.

## Get All Medication
GET /api/medication

An `ApiResponse` is retuned.
If it is successful, the payload is an array of `Medication`.

## Delete Medication
DELETE /api/medication/:medicationId

An `ApiResponse` is retuned.
If it is successful, the payload is currently unspecified.

## Create Medication Schedule
POST /api/medication/schedule
```json
{
    "medicationId": <medication id, as int>,
    "hourOfDay": <hour of day of repeat, as int>
    "dayOfWeek": <day of week, as int. May be null to signify all>
}
```
An `ApiResponse` is returned. 
If it is successful, the payload is currently unspecified.

## Get Medication Schedules for Medication
GET /api/medication/:medicationId/schedule
An `ApiResponse` is returned. 
If it is successful, the payload is currently an array of unspecified data.

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

## Medication
```
Medication {
    "id": <id of the medication, as a string>,
    "name": <name of the medication>,
    "description": <description of the medication>,
}
```

## MedicationSchedule
```
MedicationSchedule {
    "id": <id of the medication schedule, as an int>,
    "medicationId": <id of the medication this schedule belongs to, as an int>,
    "hourOfDay": <the hour of day to take the medication, as an int>,
    "dayOfWeek": <the day of the week to take a medication, as an int>,
}
```

# Graveyard

## Medication Group
POST /api/medication-group
```json
{
    "name": "medication group name"
}
```
An `ApiResponse` is returned. 
If it is successful, the payload is currently unspecified.