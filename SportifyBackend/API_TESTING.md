# Field Manager API Testing Guide

## Get Detailed Usage By Date
This endpoint retrieves detailed field usage statistics for a specific date.

**Endpoint:** 
```
GET /api/field-usage/detail/by-date?date=2023-11-15
```

**Alternative Format:**
```
GET /api/field-usage/detail/by-date?date=15/11/2023
```

**Expected Response:**
```json
[
  {
    "fieldId": 1,
    "fieldName": "Sân Số 1",
    "oneTimeBookings": 3,
    "permanentBookings": 1,
    "totalBookings": 4
  },
  {
    "fieldId": 2,
    "fieldName": "Sân Số 2",
    "oneTimeBookings": 2,
    "permanentBookings": 0,
    "totalBookings": 2
  }
]
```

## Get Detailed Usage By Month
This endpoint retrieves detailed field usage statistics for a specific month.

**Endpoint:**
```
GET /api/field-usage/detail/by-month?yearMonth=2023-11
```

**Alternative Format:**
```
GET /api/field-usage/detail/by-month?yearMonth=11/2023
```

**Expected Response:**
```json
[
  {
    "fieldId": 1,
    "fieldName": "Sân Số 1",
    "oneTimeBookings": 45,
    "permanentBookings": 4,
    "totalBookings": 49
  },
  {
    "fieldId": 2,
    "fieldName": "Sân Số 2",
    "oneTimeBookings": 38,
    "permanentBookings": 8,
    "totalBookings": 46
  }
]
```

## Get Active Fields By Date
This endpoint retrieves all fields that are active on a specific date with their booking counts.

**Endpoint:**
```
GET /api/field-usage/active-fields/by-date?date=2023-11-15
```

**Alternative Format:**
```
GET /api/field-usage/active-fields/by-date?date=15/11/2023
```

**Expected Response:**
```json
[
  {
    "fieldId": 1,
    "fieldName": "Sân Số 1",
    "oneTimeBookings": 3,
    "permanentBookings": 1,
    "totalBookings": 4
  },
  {
    "fieldId": 2,
    "fieldName": "Sân Số 2",
    "oneTimeBookings": 2,
    "permanentBookings": 0,
    "totalBookings": 2
  },
  {
    "fieldId": 3,
    "fieldName": "Sân Số 3",
    "oneTimeBookings": 0,
    "permanentBookings": 0,
    "totalBookings": 0
  }
]
```

## Get Active Fields By Month
This endpoint retrieves all fields that are active during a specific month with their booking counts.

**Endpoint:**
```
GET /api/field-usage/active-fields/by-month?yearMonth=2023-11
```

**Alternative Format:**
```
GET /api/field-usage/active-fields/by-month?yearMonth=11/2023
```

**Expected Response:**
```json
[
  {
    "fieldId": 1,
    "fieldName": "Sân Số 1",
    "oneTimeBookings": 45,
    "permanentBookings": 4,
    "totalBookings": 49
  },
  {
    "fieldId": 2,
    "fieldName": "Sân Số 2",
    "oneTimeBookings": 38,
    "permanentBookings": 8,
    "totalBookings": 46
  },
  {
    "fieldId": 3,
    "fieldName": "Sân Số 3",
    "oneTimeBookings": 25,
    "permanentBookings": 0,
    "totalBookings": 25
  }
]
```

## Key Differences Between Endpoints

1. **Detail vs Active Fields**
   - Detail endpoints only return fields that have at least one booking (one-time or permanent)
   - Active Fields endpoints return all fields, even those with zero bookings

2. **Date vs Month**
   - Date endpoints show bookings for a specific day
   - Month endpoints show bookings for an entire month

## Supported Date/Month Formats

- Date: `yyyy-MM-dd` (e.g., 2023-11-15) or `dd/MM/yyyy` (e.g., 15/11/2023)
- Month: `yyyy-MM` (e.g., 2023-11) or `MM/yyyy` (e.g., 11/2023)
