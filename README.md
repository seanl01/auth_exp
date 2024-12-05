## Auth experiment
Simple user authentication implementation using a minimal frontend with Vue, and an Express.js backend.

### Features:
- Uses a simple password hash with salt to store passwords securely, using `pgcrypto` extension in Postgres
- Uses signed JWTs in httpOnly cookies to provide stateless authentication.
- Protects routes by redirecting user to login if user tries to access protected route.

### Instructions to run:
- Clone the repo:
- `docker compose up` in the project folder
- Navigate to `http://localhost:8000`
