import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Follow } from '../../../models/follow';
import { User } from '../../../models/user';
import { Message } from '../../../models/message';
import { FollowService } from '../../../services/follow.service';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [
      FollowService,
      MessageService,
      UserService,
      ToastrService
  ]
})
export class AddComponent implements OnInit {

  public title: string;
  public message: Message;
  public identity;
  public token;
  public url: string;
  public status: string;
  public follows;
  public loading: boolean;
    
  constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _messageService: MessageService,
        private _userService: UserService,
        private toastr: ToastrService
    ) {
    this.title = "Send Message";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.message = new Message('','','','',this.identity._id,'');
    this.loading = true;
  }

  ngOnInit() {
      console.log("Messages Add Component Working...");
      this.loading = false;
      this.getMyFollows();
  }
    
  onSubmit(form){
    this.loading = true;
    this._messageService.addMessage(this.token, this.message).subscribe(
        response => {
            if(response.message){
                //this.status = 'success';
                this.loading = false;
				this.toastr.success('Message Sent Successfully.');
                form.reset();
                
            }
        },
        error => {
            console.log(error);
            //var errorMessage = <any>error;
            /*if(errorMessage != null){
                this.status = 'error';
            }*/
            this.loading = false;                
            this.toastr.error('Fail to send the message. Try again.');
        }
    
    );  
  }
    
   getMyFollows(){
        this._followService.getMyFollows(this.token).subscribe(
            response => {
                this.follows = response.follows;
            },
            error => {
                console.log(<any>error);

            }
        );
    }

}
