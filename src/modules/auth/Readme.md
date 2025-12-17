## Big picture (lock this in your head first)

- Auth in NestJS = 4 moving parts
- User module → stores users, hashes passwords
- Auth module → verifies credentials, issues JWT
- JWT strategy → validates token on protected routes
- Auth guard → blocks unauthenticated users

No shortcuts. This structure scales.

## Install auth dependencies

```bash
npm i @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm i -D @types/passport-jwt
```

- passport → auth framework
- passport-jwt → token validation
- bcrypt → password hashing