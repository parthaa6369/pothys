# Service 1: Identity Service

User authentication, KYC verification, bank accounts, referrals, and app version management.

## Features

- User registration and authentication (Email/Phone/MPIN)
- OTP-based login
- JWT token management
- User profile management
- KYC document verification (Aadhar, PAN, Passport)
- Bank account verification (Pennydrop)
- Referral system with rewards tracking
- Force update management for mobile apps

## Tech Stack

- NestJS 10+
- TypeORM + PostgreSQL
- JWT authentication
- Passport (Local + JWT strategies)
- bcrypt for password hashing
- Class-validator for DTO validation

## Database

- **Database Name**: `identities`
