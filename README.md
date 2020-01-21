# 🗣️ Social Network MEAN
This application is a social network developed with MEAN Stack (MongoDB, Express, AngularJs and Node.js). Allows to follow people´s publications, which can include photos. Also it implements one message panel to send private messages to users, and also a global chat to talk in a public way.

### Backend
Developed in NodeJS, an API Rest that attend requests from the web version of the frontend.

### Frontend
Developed in AngularJS, the main components are:

#### Login / Register
Two main options at the right-top side of the app, where you can register yourself and login as well. In case of password forgotten, the login component allows to follow a link for password reset: First an email is sent to the email address of the user with a token. This token is used to reset the user´s password in the next step (this token is set to be valid only for 60 minutes).

#### Account
Its possible to update user data at any time, including the profile photo.

#### Timeline
The publications of the people followed by the user is shown. Also at the right side of the page the "user panel" sidebar is displayed.

#### People
The list of people registered at the app. A button for follow or unfollow is enabled. Again, the current user panel is displayed.

### Profile
By clicking the name of an user or entering the own name, the profile page is shown. All publications and stats of the user are displayed.

#### Messages
Shows a panel with the messages sent and received by the user. It´s possible to send messages only to people who is already following the current user.

#### Chat
This global chat connects everybody together for chatting in a public way.
 


### Modules
* [Express](https://expressjs.com) and [CORS](https://www.npmjs.com/package/cors) - Node.js web framework for API routing
* [Mongoose](https://mongoosejs.com/) - Mongo DB object modeling
* [Socket.io / Socket.io-Client](https://socket.io/) - Real-time WebSocket for the Global Chat.
* [NGX-Toastr](https://www.npmjs.com/package/ngx-toastr) - Toast messages notifications (animations in Angular)
* [RxJS](https://rxjs-dev.firebaseapp.com/guide/overview) - Library for composing asynchronous and event-based programs by using observable sequences
* [jQuery](https://jquery.com/) - A feature-rich JavaScript library
* [bcrypt](https://www.npmjs.com/package/bcrypt) - A library to help to hash passwords
* [JWT-simple](https://www.npmjs.com/package/jwt-simple) - JSON Web Token for session identity.
* [Nodemailer](https://nodemailer.com/about/) - Email sending issue in Node.js
* [Connect-Multiparty](https://www.npmjs.com/package/connect-multiparty) - Upload middleware.


### How to run
It´s necessary to have installed: [Node.js (LTS)](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/get-npm): It´s also recommended [Angular-CLI](https://cli.angular.io/).

#### Backend
```
cd server/
npm start
```
#### Frontend
The client can be run also with Angular-CLI command "ng serve", or simply (will run "start" script at package.json): 
```
cd client/
npm start
```

## 🧱 Built With

* [MongDB](https://www.mongodb.com/) - Database System
* [Express](https://expressjs.com/en/guide/routing.html) - Routing framework
* [Angular](https://angular.io/) - Application framework for client-side, developed in typescript.
* [NodeJS](https://nodejs.org/en/) - The server-side JavaScript runtime environment


## 📸 Screens
<img src="https://github.com/GuilleAngulo/social-network-mean/blob/master/home.png" width="420"> <img src="https://github.com/GuilleAngulo/social-network-mean/blob/master/login.png" width="420">

<img src="https://github.com/GuilleAngulo/social-network-mean/blob/master/timeline.png" width="420"> <img src="https://github.com/GuilleAngulo/social-network-mean/blob/master/timeline-photo.png" width="420">

<img src="https://github.com/GuilleAngulo/social-network-mean/blob/master/people.png" width="420"> <img src="https://github.com/GuilleAngulo/social-network-mean/blob/master/profile.png" width="420">

<img src="https://github.com/GuilleAngulo/social-network-mean/blob/master/messages.png" width="420"> <img src="https://github.com/GuilleAngulo/social-network-mean/blob/master/chat.png" width="420">

## 💬 Live Demo
You can test it [here](http://ngsocial.guilleangulo.me)

## 📹 Video
[![Watch the demo](https://github.com/GuilleAngulo/social-network-mean/blob/master/frame.png)](https://youtu.be/zaY9g2BiZR8)
