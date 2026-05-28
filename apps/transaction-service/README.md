# Service 2: Transaction Service

Order management, SIP subscriptions, redemptions, and CMS content management.

## Features

- Spot gold/silver order placement
- SIP (Systematic Investment Plan) management
- Physical/Digital redemption
- Price locking mechanism (10-minute window)
- Order status tracking
- ERP synchronization for orders and SIPs
- CMS: Banners, FAQs, Terms & Conditions (multi-language)

## Tech Stack

- NestJS 10+
- TypeORM + PostgreSQL
- RabbitMQ for event-driven architecture
- Redis for price caching

## Database

- **Database Name**: `transactions`
