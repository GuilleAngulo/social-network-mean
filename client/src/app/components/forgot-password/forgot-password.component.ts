import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers: [UserService]
})
export class ForgotPasswordComponent implements OnInit {

  public title: string;
  public user: User;
  public loading: boolean = true;

  constructor(
    private _router: Router,
    private _userService: UserService,
    private toastr: ToastrService
) {
  this.title = 'Forgot Password';
  this.user = new User("","","","","","","ROLE_USER","");
}

  ngOnInit() {
    console.log('Forgot Password Component Working...');
    this.loading = false;
  }

  onSubmit(){
    //User Login with data
    this.loading = true;
    this._userService.forgotPassword(this.user.email).subscribe(
      response => {
          this.loading = false;
          this.toastr.success(response.message);
          this._router.navigate(['/reset-password']);

        }, error => {
        this.loading = false;
        this.toastr.error(error.error.error);

      }
  );
}

}
