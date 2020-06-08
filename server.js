const express = require('express');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const config = require('./config/config');
const path = require('path');
const root = require('./routes/root');
const routeLogin = require('./routes/login');
const register = require('./routes/register');

const app = express();
const server = require('http').createServer(app);
const io = require('./events/socket')(server);
const cookie = cookieParser(config.SECRET);
const store = new expressSession.MemoryStore();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(cookie);
app.use(expressSession({
    secret: config.SECRET,
    name: config.KEY,
    resave: true,
    saveUninitialized: true,
    store: store
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


app.use('/login', routeLogin);
app.use('/register', register);
app.use('/', root);


io.use((socket, next) => {
    let data = socket.request;
    cookie(data, {}, (err) => {
        let sessionID = data.signedCookies[config.KEY];
        store.get(sessionID, (err, session) => {
            if (err || !session) {
                return next(new Error('Acesso negado!'));
            } else {
                socket.handshake.session = session;
                return next();
            }
        });
    });
});

server.listen(3000, () => {
    console.log('Server rodando em http://localhost:3000');
});