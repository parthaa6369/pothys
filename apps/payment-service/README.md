# Service 3: Payment Service

Payment gateway integration, webhook handling, SIP debits, and reconciliation.

## Features

- Payment gateway integration (Razorpay)
- Payment status tracking and retries
- Webhook processing (idempotent)
- SIP automated debits with retry logic
- Daily payment reconciliation with ERP
- Refund management

## Tech Stack

- NestJS 10+
- TypeORM + PostgreSQL
- Razorpay SDKs
- RabbitMQ for event handling
- Redis for idempotency

## Database

- **Database Name**: `payments`
