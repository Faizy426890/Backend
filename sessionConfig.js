import session from 'express-session';
import MongoStore from 'connect-mongo';

const configureSession = (app) => {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // Use MongoDB for sessions
    cookie: { secure: false }, // Set to true if using HTTPS
  }));
};

export default configureSession;
