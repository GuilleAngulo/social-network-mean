import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService]
})
export class ProfileComponent implements OnInit {


    public title: string;
    public user: User;
    public status: string;
    public identity: User;
    public url: string;
    public token: string;
    public stats;
    public followed: boolean;
    public following: boolean;
    public loading: boolean;

  constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    ) {
        this.title = 'Profile';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.following = false;
        this.followed = false;
        this.loading = true;

    }

  ngOnInit() {
      console.log('Profile Component Working...');
      this.loadPage();
      this.loading = false;
  }

  loadPage(){
      this._route.params.subscribe(params => {
         let id = params['id'];
         this.getUser(id);
         this.getCounters(id);
      });
  }

  getUser(userId){
        this._userService.getUser(userId).subscribe(
            response => {
                if(response.user){
                    this.user = response.user;

                    if(response.following && response.following._id){
                        this.following = true;
                    }else{
                        this.following = false;
                    }


                    if(response.followed && response.followed._id){
                        this.followed = true;
                    }else{
                        this.followed = false;
                    }

                }else{
                    this.status = 'error';
                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if(errorMessage != null){
                    this.status = 'error';
                    //In case an error, redirect to the profile page of current user
                    this._router.navigate(['/profile', this.identity._id]);
                }
            }

        );
    }

    getCounters(userId){
        this._userService.getCounters(userId).subscribe(
            response => {
                this.stats = response;
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if(errorMessage != null){
                    this.status = 'error';
                }
            }
        );
    }


    followUser(userId){
        var follow = new Follow('', this.identity._id, userId);

        this._followService.addFollow(this.token, follow).subscribe(
            response => {
               this.following = true;
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    unfollowUser(userId){
        this._followService.deleteFollow(this.token, userId).subscribe(
            response => {
                this.following = false;
            },
            error => {
                console.log(<any>error)
            }

        );
    }


    public followUserOver;
    mouseEnter(userId){
        this.followUserOver = userId;
    }

    mouseLeave(){
        this.followUserOver = 0;
    }

}
