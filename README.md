## Dotos! API

A NodeJS todo app which implements unit and integration tests, email sending and refresh token functionalities following SOLID design principles. Contributions and testing are highly appreciated!

This API is hosted in AWS EC2.

**[DOCUMENTATION](https://api.dotos.tech/api-docs/)**

**[LIVE PREVIEW](https://app.dotos.tech/)**

**[WEB APP REPOSITORY](https://github.com/GessioMori/dotos-react)**

### Features:

- PostgreSQL for the database and Redis for the rate limiter.
- CI/CL with GitHub actions.
- Documentation with Swagger.
- Containerization with Docker.
- Unit and integration tests with jest and supertest.
- JWT access and refresh tokens stored via http-only cookies.
- Email sending for password recovery.


### Dependencies:
- aws-sdk
- bcrypt
- cookie-parser
- cors
- dayjs
- dotenv
- express
- express-async-errors
- jsonwebtoken
- nodemailer
- pg
- rate-limiter-flexible
- redis
- reflect-metadata
- swagger-ui-express
- tsyringe
- typeorm
- uuid
- validator