Express TS Setup
====================================

### Migrations
```
npm run migrate
npm run make:migrations --migration_name=create_foos_table
```

### Run App
database:
```
docker-compose up -d --build  
```
server (dev):
```
npm run dev
```