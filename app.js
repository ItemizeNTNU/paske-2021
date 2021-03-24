const createError = require('http-errors');
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view options', { openDelimiter: '{', closeDelimiter: '}' });
ejs.openDelimiter = '{';
ejs.closeDelimiter = '}';


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const render = async (res, file, options) => {
  let out = await ejs.renderFile('./views/header.ejs', options);
  out += await ejs.renderFile(`./views/${file}.ejs`, options);
  out += await ejs.renderFile('./views/footer.ejs', options);
  res.send(out);
}

// BEGIN ROUTES
app.get('/', function (req, res, next) {
  render(res, 'index', { title: 'Påskeharens admin-side', sitat: 'Hei hei! Jeg er påskeharen, og dette er min egne nettside! Her holder jeg kontroll over alt arbeidet jeg må gjøre nå i påsketider.' });
});
app.get('/login', function (req, res, next) {
  render(res, 'login', { title: 'Logg inn', sitat: 'Ah, jeg har glemt passordet mitt! Kan du logge meg inn?' });
});
// END ROUTES

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
