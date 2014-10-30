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
plus his tutorial on passport


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
