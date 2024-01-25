Express TS Setup
====================================

## How to Run
### Run Database:
```
docker-compose up -d --build
```
### Run Applications:
```
npm run dev
npm run start
```


## Migration
### New migration:
```
npm run make:migrations --migration_name=create_foos_table
```
### Run migrate:
```
npm run migrate
```


## Contributors
- Agung Yuliyanto: [Github](https://github.com/agung96tm), [LinkedIn](https://www.linkedin.com/in/agung96tm/)