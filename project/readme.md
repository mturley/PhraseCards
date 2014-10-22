## 326 Project

#### To get started
```
> cd project
> npm install

```
#### To start server
```
npm start
```

#### To run tests (runs the test.js file in the test dir)
```
mocha
```

#### To run the database
```
Starting out-

install at website:
http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
just in case do sudo apt-get update after you do an install

go to project directory and do
npm install

Mongoose npm packages now installed.

Ask for the database connection string from a teammate
Once you get the database connection, create a local config file that will be ignored by git within a new folder config called database.js
So you should have config/database.js.
In database.js, add the following: module.exports = {'url' : /* the given connection string in single quotes*/};


In order to test out mongoose, we are using a RESTful API model. We are currently following this
http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4

Install Postman:
https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en

At the moment, we have a player schema that fully utilizes the POST, GET, PUT, and DELETE

run node app.js
Once the app is running, try a get on the following http://localhost:8080/api/players/
if you want to try a POST make sure it is using x-www-form-urlencoded 
then pass it in the forms username /* some name */ and 
						  email	/* some email */

The schema is subject to change later on

```




### Links to technologies
[Express](http://expressjs.com/) (Web App Framework)<br>
[Mocha](http://visionmedia.github.io/mocha/) (Testing)<br>
[Foundation](http://foundation.zurb.com/) (Css Framework)<br>
[ejs](http://www.embeddedjs.com/) (JavaScript Template library)

### Add in the future
[Passport](http://passportjs.org/) (Authentication Middleware)<br>
[Gulp](http://gulpjs.com/) (Compiler/Task Runner)<br>
[Mongoose](http://mongoosejs.com/) (Mongodb object modeling)
