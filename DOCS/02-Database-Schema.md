# Database Schema Design

The PostgreSQl database acts as the single source of truth for this application. If the tables are defined incorrectly, the entire backend API fails. 

The section details the 7 primary tables required to manage this system: Roles, Users, Sessions, Assets, Asset_assignments, Audit_logs, Network_connections. It includes the foreign key relationships required to maintain strict accountability. 

## Schema Blueprints
![Database Phase 1](./handwritten_notes/3.jpeg)
![Roles and Users Tables](./handwritten_notes/4.jpeg)
![Sessions, Assets Tables](./handwritten_notes/5.jpeg)
![Assignments and Audit Logs Tables](./handwritten_notes/6.jpeg)
![Entity Relationship Mapping](./handwritten_notes/7.jpeg)