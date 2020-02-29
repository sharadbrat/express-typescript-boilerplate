# APP_NAME server

This repository contains source code base for Schedules application server. It is developed and deployed using following technologies:  
- Node.js v10.15
- Typescript v3.3
- Express v4.16
- Sequelize v5.1
- MySQL v8.0

# Naming conventions

As far as we use typescript, different entity types should be named differently. This is done for easier code completion and better performance on search through the project.

### Interfaces:

Prefix with "I".

##### Example:
```typescript
interface ISomething {
  // ...
}
```

### Types: 

Prefix with "T".

##### Example:
```typescript
type TSomething = any;
```

### Enums:
Prefix with "E".

##### Example:
```typescript
enum ESomething {
  // ...
}
```

### Abstract classes:
Prefix with "Abstract".

##### Example:
```typescript
class AbstractSomething {
  // ...
}
```

# Scripts

##### Build:
```
npm run build
```

##### Production build:
```
npm run build:prod
```

##### Lint:
```
npm run lint
```

##### Build and serve, watch for file changes:
```
npm run start
```

##### Run swagger server:
```
npm run swagger
```

# License

MIT

# Roadmap

- Data transfer layer
- Class components + decorators
- Permissions
- Logging
- winston as logger


# Credits

Georgii Sharadze
