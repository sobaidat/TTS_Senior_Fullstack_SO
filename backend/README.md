# analytics_dashboard

> Hotels Analytics Dashboard

## Build Setup

``` bash

# install postgres using docker
docker pull postgres:latest

# config postgres databse using docker
docker run -d --name hotels -p 5432:5432 -e 'POSTGRES_PASSWORD=p@ssw0rd42' postgres

# install dependencies
npm install

# init database structure and insert random data
npm run initdb

# serve with hot reload at localhost:3000
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

