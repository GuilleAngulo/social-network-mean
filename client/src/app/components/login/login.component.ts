import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

    public title: string;
    public user: User;
    public status: string;
    //logged user
    public identity;
    //token hash
    public token;

  constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ) {
    this.title = 'Login';
    this.user = new User("","","","","","","ROLE_USER","");
  }

  ngOnInit() {
      console.log('Login Component Working...')
  }

  onSubmit(){
      //User Login with data
      this._userService.signup(this.user).subscribe(
        response => {
          this.identity = response.user;
          if(!this.identity && !this.identity._id){
              this.status == 'error'
          }else{
              //Persist user data
              localStorage.setItem('identity', JSON.stringify(this.identity));

              //Get token
              this.getToken();
          }
          this.status = 'success';
          }, error => {
          var errorMessage = <any>error;
          console.log(errorMessage);
            if(errorMessage != null){
                this.status = 'error';
            }

        }
    );
  }

    getToken(){
        //User Login with data
      this._userService.signup(this.user, 'true').subscribe(
        response => {
          this.token = response.token;
          if(this.token.length <= 0){
              this.status == 'error';
          }else{
              //Persist User Token
              localStorage.setItem('token', this.token);

              //Get User Counts (Followers, Following and Posts)
              this.getCounters();



          }
          this.status = 'success';
          }, error => {
          var errorMessage = <any>error;
          console.log(errorMessage);
            if(errorMessage != null){
                this.status = 'error';
            }

        }
    );
    }

    getCounters(){
        this._userService.getCounters().subscribe(
            response => {
                localStorage.setItem('stats', JSON.stringify(response));
                this.status = 'success';
                this._router.navigate(['/']);
            },
            error => {
                console.log(<any>error)
            }
        )
    }



}
