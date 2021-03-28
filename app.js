const createError = require('http-errors');
const express = require('express');
const serveIndex = require('serve-index')
const ejs = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const alasql = require('alasql');

const adminPass = '8665991a2cff1998';
const panelToken = '161e3db7b94020a9';
const formPassword = 'qwerty';
const cookieValue = '7bf10a40d998f0da';

const csv = {
  by: 'kristiansund',
  egg: 2652
};

const flagg = [
  'EGG0{a6c4ae535de6c632}',
  'EGG1{b18ce50433b1c112}',
  'EGG2{32026cc5b03aaca0}',
  'EGG3{34e0ea28d34bf146}',
  'EGG4{58f42a65a52cfc26}',
  'EGG5{0f4e82c54eeb86e0}',
  'EGG6{507f00b2eb5870a8}',
]

const panel2Options = {
  'password': formPassword,
  token: panelToken,
  flagg: flagg[5]
};


// setup db
alasql('CREATE TABLE users (id, INT, username TEXT, password TEXT)');
alasql.tables.users.data = [
  { id: 1, username: 'påskeharen', password: adminPass }
];

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view options', { openDelimiter: '{', closeDelimiter: '}' });
ejs.openDelimiter = '{';
ejs.closeDelimiter = '}';


app.use(logger('dev'));
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/haredata', serveIndex(path.join(__dirname, 'public/haredata'), { 'icons': true }));
app.use('/images', serveIndex(path.join(__dirname, 'public/images'), { 'icons': true }));
app.use('/stylesheets', serveIndex(path.join(__dirname, 'public/stylesheets'), { 'icons': true }));

const render = async (res, file, options = {}) => {
  options = { ...options };
  options.flagg = options.flagg || flagg[0];
  let out = '';
  //out += await ejs.renderFile('./views/header.ejs', options);
  out += await ejs.renderFile(`./views/${file}.ejs`, options);
  //out += await ejs.renderFile('./views/footer.ejs', options);
  res.send(out);
}

// BEGIN ROUTES
app.get('/', (req, res, next) => {
  render(res, 'index');
});

app.get('/login', (req, res, next) => {
  render(res, 'login');
});
app.post('/login', (req, res, next) => {
  if (!req.body.username) {
    render(res, 'login', { error: 'Missing field username' });
    return;
  }
  if (!req.body.password) {
    render(res, 'login', { error: 'Missing field password' });
    return;
  }
  alasql([`SELECT id FROM users WHERE username='${req.body.username}' AND password='${req.body.password}'`])
    .then(user => {
      if (user[0][0]) {
        res.cookie('auth2020', cookieValue);
        res.redirect('/panel');
      } else {
        render(res, 'login', { error: `Invalid username or password` });
      }
    })
    .catch(error => {
      render(res, 'login', { error });
    });
});

app.get('/panel', (req, res, next) => {
  if (req.query.token != panelToken) {
    if (!req.cookies.auth2021) {
      render(res, 'errorPretty', { error: `Missing cookie 'auth2021'`, flagg: flagg[1] });
      return;
    }
    if (req.cookies.auth2021 != cookieValue) {
      render(res, 'errorPretty', { error: `Incorrect auth cookie`, flagg: flagg[1] });
      return;
    }
    render(res, 'panel', { flagg: flagg[2] });
  } else {
    render(res, 'panel2', { ...panel2Options });
  }
});

app.post('/panel', (req, res, next) => {
  if (req.query.token != panelToken) {
    if (!req.body.by) {
      render(res, 'panel', { error: 'Missing field by' });
      return;
    }
    if (!req.body.egg) {
      render(res, 'panel', { error: 'Missing field egg' });
      return;
    }
    if (!String(req.body.by).toLowerCase() == csv.by || req.body.egg != csv.egg) {
      render(res, 'panel', { error: 'Incorrect values' });
      return;
    }
    res.redirect(`/panel?token=${panelToken}`);
  } else {
    if (String(req.body.bekreft).toLowerCase() != 'ja') {
      render(res, 'panel2', { error: 'bekreft != ja, kunne ikke bekrefte utsendelse.', ...panel2Options });
      return;
    }
    if (req.body.passord != formPassword) {
      render(res, 'panel2', { error: 'Feil passord.', ...panel2Options });
      return;
    }
    render(res, 'ferdig', { flagg: flagg[6] });
  }
});
// END ROUTES

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  render(res, 'errorPretty', { error: '404 - Fil ikke funnet :/' })
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
