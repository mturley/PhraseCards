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

#### To run mongodb
```
install at website:
http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/

just in case do sudo apt-get update

go to project directory
npm install

Set your data directory do the path it would be for your computer
e.g mongod --dbpath /home/student/team-phrase-cards/project/data

if you get an addr already in user error, try
sudo service mongodb stop
sudo mongod

and then setting your path

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
