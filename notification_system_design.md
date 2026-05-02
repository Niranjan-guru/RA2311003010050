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

## STAGE 4. DB overload optimization
Instead of fetching all notifications:

GET /notifications?userId=123&page=1&limit=20

SQL:
SELECT * FROM notifications
WHERE userId = '123'
ORDER BY createdAt DESC
LIMIT 20 OFFSET 0;



## STAGE 5. Bulk Notification Handling

Problem:
Sending notifications to thousands of users at once

Solution:
- Use message queue (Kafka / RabbitMQ)
- Producer sends notification event
- Workers consume and process asynchronously

function notify_all(student_ids, message):

    for student_id in student_ids:
        queue.publish({
            "student_id": student_id,
            "message": message
        })


worker():

    while true:
        job = queue.consume()

        try:
            save_to_db(job.student_id, job.message)

            send_email(job.student_id, job.message)

            push_to_app(job.student_id, job.message)

        except error:
            retry(job)

Benefits:
- Avoids server overload
- Improves scalability

## STAGE 6. Priority Handling

Notifications are prioritized based on:

priority = importance + recency

Use a Max Heap (Priority Queue)

---

### Pseudocode

function getTopNotifications(notifications, N):

    heap = new MaxHeap()

    for notification in notifications:

        weight = getWeight(notification.type)

        recency = getRecency(notification.timestamp)

        score = weight * 1000 + recency

        heap.push(notification, score)

    result = []

    for i in range(N):
        result.append(heap.pop())

    return result

---

### Efficient Update Strategy

When new notification arrives:
- Insert into heap → O(log N)
- Maintain only top N elements

---

### Optimized Approach (Better)

Use Min Heap of size N:

for notification in notifications:
    push into heap

    if heap size > N:
        remove smallest

→ O(N log N) → efficient for streaming data

---




