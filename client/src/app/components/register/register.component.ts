import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
    
    public title: string;
    public user: User;
    public status: string;

  constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ) {
    this.title = 'Register';
    this.user = new User("","","","","","","ROLE_USER","");
  }

  ngOnInit() {
      console.log('Register Component Working...')
  }

  onSubmit(form){           

     /*The subscribe method of Observable to take the response from the API*/ this._userService.register(this.user).subscribe(
         response => {
            //Check if the response comes with an user and an user _id
             if(response.user && response.user._id){
                 this.status = 'success';
                 //Reset all the form inputs
                 form.reset();
            } else {
                this.status = 'error';
            }
         },
         error => {
             console.log('ERROR: ' + <any>error);
         }
     );
  }    
    
}
