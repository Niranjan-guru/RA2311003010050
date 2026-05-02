# Notification System Design

## STAGE 1. API DESIGN

### 1.1 Get Notification
GET /notifications?userId=123

Response:
{
  "notifications": [
    {
      "id": "n1",
      "message": "Exam scheduled",
      "type": "academic",
      "isRead": false,
      "createdAt": "2026-01-01T10:00:00Z"
    }
  ]
}

### 1.2 Create Notification
POST /notifications

Request:
{
  "userId": "123",
  "message": "New assignment posted",
  "type": "academic"
}

Response:
{
  "success": true
}

### 1.3 Mark Notification as Read
### 1.3 Mark Notification as Read

PATCH /notifications/:id/read

Response:
{
  "success": true
}

## STAGE 2. Database Design

### 2.1 Choice of Database

We use PostgreSQL because:
- Structured data
- Strong consistency
- Efficient indexing support

### 2.2 Schema

Table: notifications

| Column     | Type        | Description |
|-----------|------------|-------------|
| id        | UUID        | Primary key |
| userId    | VARCHAR     | User ID |
| message   | TEXT        | Notification content |
| type      | VARCHAR     | Category |
| isRead    | BOOLEAN     | Read status |
| createdAt | TIMESTAMP   | Creation time |

## STAGE 3. Query Optimization

Query:
SELECT * FROM notifications
WHERE userId = '123' AND isRead = false
ORDER BY createdAt DESC;

### QUESTION:
- Slow for large datasets due to full table scan

### Solution:
CREATE INDEX idx_notifications
ON notifications(userId, isRead, createdAt DESC);



## STAGE 5. Bulk Notification Handling

Problem:
Sending notifications to thousands of users at once

Solution:
- Use message queue (Kafka / RabbitMQ)
- Producer sends notification event
- Workers consume and process asynchronously

Benefits:
- Avoids server overload
- Improves scalability

## STAGE 6. Priority Handling

Notifications are prioritized based on:

priority = importance + recency

Implementation:
- Use a Max Heap / Priority Queue
- Higher priority notifications shown first



