'use strict';

//Express Router
var api = express.Router();

//Middlewares
var md_auth = require('../middlewares/authenticated');

module.exports = function(io) {
    var ChatController = require('../controllers/chat')(io);
    app.get('/chat', md_auth.ensureAuth, ChatController);
}