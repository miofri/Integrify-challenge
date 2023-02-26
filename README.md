# Integrify-challenge

I use WSL2 Ubuntu. 

Due to time constraints (had work 4 days during the week of this challenge) I did not have the opportunity to tackle tests nor docker-compose, but will add it in the future for learning purposes. :) 

### Navigation: 
- `./controllers`: contains routers.
- `./controllers/router-utils`: small functions to help the routers.
- `./config`: contains configurations for pg and passport.js, as well as the template for the tables, 
- `./requests`: contains HTTP requests using REST Client VSCode extension.
- `app.js`: contains the application itself and all middlewares.
- `index.js`: calls the app and the HTTP server.

## Postgresql: 
1. Installed postgresql `sudo apt install postgresql postgresql-contrib` as well as npm package `pg` 
2. Log in to psql with default postgres username `sudo -u postgres psql`
3. `CREATE USER selvi` & `CREATE DATABASE todo OWNER selvi`. Create a new user in Ubuntu as well if it didn't exist with `sudo adduser selvi`.
4. Logout and login as selvi, `CREATE TABLE users id SERIAL PRIMARY KEY NOT NULL ... etc` as well as todolist. Fill the columns as required in the subject; there's a template in `./config/psql-tables.sql`. 

## Node.js
npm install per usual; app will start in localhost:8080.
