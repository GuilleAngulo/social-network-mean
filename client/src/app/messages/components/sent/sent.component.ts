import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Follow } from '../../../models/follow';
import { User } from '../../../models/user';
import { Message } from '../../../models/message';
import { FollowService } from '../../../services/follow.service';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'sent',
  templateUrl: './sent.component.html',
  styleUrls: ['./sent.component.css'],
  providers: [
      FollowService,
      MessageService,
      UserService
  ]
})
export class SentComponent implements OnInit {

  public title: string;
  public identity;
  public token;
  public url: string;
  public status: string;
  public follows;
  public messages: Message[];
  public pages;
  public total;
  public page;
  public next_page;
  public prev_page;
  public loading: boolean;
    
  constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _messageService: MessageService,
        private _userService: UserService
    ) {
    this.title = 'Sent messages';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.loading = true;
  }

  ngOnInit() {
      console.log("Messages Sent Component Working...");
      this.actualPage();

  }
    
    actualPage(){
      this._route.params.subscribe(params => {
          let page = +params['page']; 
          this.page = page;
          
          if(!params['page']){
              page = 1;
          }
          
          if(!page){
              page = 1;
          } else {
              this.next_page = page + 1;
              this.prev_page = page - 1;
              
              if(this.prev_page <= 0){
                  this.prev_page = 1;
              }
          }
          
          //Get Users List
         this.getMessages(this.token, this.page);
         this.loading = false;
      });
  }
    
    
    
    getMessages(token, page){
        this._messageService.getEmitMessage(token, page).subscribe(
            response => {
                if(response.messages){
                    this.messages = response.messages;
                    this.total = response.total;
                    this.pages = response.pages;
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }
    
    

}
