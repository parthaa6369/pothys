-- PostgreSQL initialization script for Pothys Backend
-- Creates databases for each microservice

-- Create databases
CREATE DATABASE IF NOT EXISTS identity_db;
CREATE DATABASE IF NOT EXISTS cms_db;
CREATE DATABASE IF NOT EXISTS portfolio_db;
CREATE DATABASE IF NOT EXISTS payment_db;
CREATE DATABASE IF NOT EXISTS transaction_db;

-- Grant privileges to the postgres user (if needed)
-- Note: In PostgreSQL, databases are created by default with the owner having full privileges

