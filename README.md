# Mesto (The Place)

## A multi-user photo sharing React/Node/Express/MongoDB web app

## Description

[https://api.mesto.418co.de](https://api.mesto.418co.de/) - 
Node/Express/MongoDB back end for [React photo sharing front end](https://github.com/418code/react-mesto-frontend)\
Sprints: 13 - 15

## Run the project

`npm run start` — starts the server   
`npm run dev` — starts the server with hot-reload

## Technologies used
- Node 16, Express: middlewares, routers, controllers, REST api, error handling
- MongoDB, Mongoose: schemas, models, CRUD operations, refs
- Security: bcrypt password hashing, Celebrate/Joi + MongoDB validation with regex matching, JWT token, rate limiter, CORS
- Google Compute Platform: debian VM, Nginx, PM2 with auto reload, Let's Encrypt SSL certificate, dynamic DNS, custom domain
