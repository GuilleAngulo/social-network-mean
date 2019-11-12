import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Router, Event, NavigationEnd, NavigationStart} from '@angular/router';

import * as io from 'socket.io-client';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [UserService]
})
export class ChatComponent implements OnInit {

  public title: string;
  public nickname: string;
  public messageText: string;
  public identity;
  public socket: any;
  //public numberUsers : any;

  constructor(
        private _userService: UserService,
        private _router: Router
    ) {
        this.identity = this._userService.getIdentity();
        this.title = "Global Chat";
        this.nickname = this.identity.name + ' ' + this.identity.surname;

        this._router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                    if(this.socket != null){
                        this.disconnection();
                    }
            }
        });
    }

  ngOnInit() {

  }


 connection(){
     this.socket = io.connect(GLOBAL.url_general, {'forceNew':true});
     $('#chat').css("display", "block");
     $('#start-chat').css("display", "none");
     this.start();
 }

  start(){
        var conection = {
             nickname: this.nickname,
             connection: true
        };

        this.socket.emit('add-message', conection);


        this.socket.on('users', function(data){
             document.getElementById('active_users').innerHTML = data;
        });

        this.socket.on('messages', function(data){
            var html = data.map(function(message, index){
                if(message.connection == true) {
                    return (`
                        <div class="connection">${message.nickname} has <strong>connected</strong></div>
                    `);
                }


                else if (message.connection == false){
                     return (`
                        <div class="connection">${message.nickname} has <strong>disconnected</strong></div>
                    `);
                }


                else if (!message.connection){

                return (`
                    <div class="message">
                        <strong>${message.nickname}</strong> says: <div class="hour"><span>${message.hora}</span></div>
                        <p>${message.texto}</p>
                    </div>
                    `);
                }
            }).join(' ');


            var div_msgs =  document.getElementById('messages');
            div_msgs.innerHTML = html;
            div_msgs.scrollTop = div_msgs.scrollHeight;
        });
    }


  onSubmit(form){
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    var message = {
      nickname: this.nickname,
      texto: this.messageText,
      hora: hours+":"+ (minutes<10?'0':'') + minutes
    };
    this.socket.emit('add-message', message);

    form.reset();
    return false;
  }

 disconnection(){
     var conection = {
        nickname: this.nickname,
        connection: false
     };
     $('#chat').css("display", "none");
     $('#start-chat').css("display", "block");
     this.socket.emit('disconnection', conection);
 }

}
