var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");
const expressSession = require('express-session');
const db = require("./config/mongodb")
var cookieParser = require('cookie-parser');
var cors = require('cors');
const createSessionConfig = require('./config/session');

const checkAuthStatusMiddleWare = require('./middleware/checkAuth')
const protectRoutesMiddleWare = require('./middleware/protectRoutes')

const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const adminRoute = require('./routes/admin.route')


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const cspConfig = {
  directives: {
    scriptSrc: ["'self'", "ajax.googleapis.com", "cdn.jsdelivr.net", "www.google.com"],
    frameSrc: ["'self'", "www.google.com"],
  },
};


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet.contentSecurityPolicy(cspConfig));
app.use(limiter);
app.use(cors({ 
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(cookieParser());



const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));

app.use(checkAuthStatusMiddleWare);

app.use("/",protectRoutesMiddleWare)
app.use("/api/auth", authRoute);
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);


db.connectToDatabase()
.then(function(){
    app.listen(9000);
}).catch(function(error){
    console.log('Failed to connect to database!');
    console.log(error);
});