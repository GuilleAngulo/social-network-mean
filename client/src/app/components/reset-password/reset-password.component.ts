import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [UserService]
})
export class ResetPasswordComponent implements OnInit {

  public title: string;
  public user: User;
  public resetToken: string;
  public loading: boolean = true;

  constructor(
    private _router: Router,
    private _userService: UserService,
    private toastr: ToastrService
  ) {
    this.title = 'Reset Password';
    this.user = new User("","","","","","","ROLE_USER","");
  }

  ngOnInit() {
    console.log('Reset Password Component Working...');
    this.loading = false;
  }

  onSubmit(){
    //User Login with data
    this.loading = true;

    this._userService.resetPassword(this.user.email, this.resetToken, this.user.password).subscribe(
      response => {
          this.loading = false;
          this.toastr.success(response.message);
          this._router.navigate(['/login']);


        }, error => {
        this.loading = false;
        this.toastr.error(error.error.error);

      }
  );
}

}
