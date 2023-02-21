import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import gatewayRoutes from './routes/gatewaysRoutes';
import peripheralsRoutes from './routes/peripheralsRoutes';
// import routes from './routes/crmRoutes';

const app = express();
const PORT = 3000;

// Connection to DB
import('./config/db');

// serving static files
app.use(express.static(__dirname + '/public'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
gatewayRoutes(app);
peripheralsRoutes(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.send('Error');
    // res.render('error')
  });


  app.listen(PORT, () =>
    console.log(`Your server is running on port ${PORT}`)
);