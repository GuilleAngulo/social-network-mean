const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');



const { host, port, user, pass } = require('../config/mail.json');

var transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
  });


 transport.use('compile', hbs({
    viewEngine: {
        extName: '.html',
        partialsDir: path.resolve('./resources/mail/'),
        layoutsDir: path.resolve('./resources/mail/'),
        defaultLayout: '',
    },
    viewPath: path.resolve('./resources/mail/'),
    extName: '.html',
  }));


  module.exports = transport;