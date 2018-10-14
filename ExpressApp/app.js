//jshint esversion: 6
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var v1 = require('./routes/v1');
var app = express();
var cors = require('cors');
var ipn = require('express-ipn');
const db = require('./util/db');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json({limit: '20mb', extended: true}));
app.use(bodyParser.urlencoded({ extended: false })); // IPN data is sent in the body as x-www-form-urlencoded data
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../AngularApp/dist')));

app.post('/notify/:notifyId', ipn.validator(ipnValidationHandler, true));

function ipnValidationHandler(err, ipnContent, req) {
  if (err) {
      console.error("IPN invalid");              // The IPN was invalid
  } else {
      console.log(`Incoming IPN: `, ipnContent, req.params); // The IPN was valid.
      db.updateDocument('authbox', 'Members', { 
        "registration.notifyId": req.params.notifyId
      }, { 
        $push: { paypal: ipnContent },
        $set: { "registration.registrationComplete": true }
      }, { updateType: 'complex' }) // bind the paypal data to the member
      .then((result) => {
        console.log(`IPN modified ${result.modifiedCount} member records.`);
        if(result.modifiedCount === 1) {
          // find the member's email, and if called for send a welcome email
          return db.findDocuments('authbox', 'Members',{ 'registration.notifyId': req.params.notifyId })
          .then((members) => {
            if (members && members[0] && members[0].email && !members[0].welcomeEmailSent) {
              return this.v1.sendWelcomeEmail(members[0].email) // send the new member welcome email to this person
              .then(() => {
                return db.updateDocument('authbox', 'Members', { 'registration.notifyId': req.params.notifyId }, { welcomeEmailSent: true });
              })
              .catch((err) => {
                console.error(err.message, err.stack);
              });
            }
          });
        } else {
          console.error(`Got IPN to '${req.params.notifyId}', which doesn't match any user`);
        }
      })
      .catch((err) => {
        console.log(`IPN member record update failed.`, err);
      });
  }
}

app.get('/testnotifyurl/:notifyId', (req, res, next) => {
  if(req.params.notifyId) {
    ipnValidationHandler(null, {}, req);
  }
});

app.use('/', index);
app.use('/v1', v1);
app.get('*', function(req, res, next) { 
  res.sendFile(path.join(__dirname, '../AngularApp/dist/index.html')); 
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.error(err.mesage, err.stack);
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
