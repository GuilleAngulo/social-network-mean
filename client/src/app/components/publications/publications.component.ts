import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { Like } from '../../models/like';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { LikeService } from '../../services/like.service';
import { GLOBAL } from '../../services/global';

declare var jQuery:any;
declare var $:any;


@Component({
  selector: 'publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
  providers: [UserService, PublicationService, LikeService]
})
export class PublicationsComponent implements OnInit, OnChanges {

  public title: string;
  public identity;
  public token;
  public url: string;
  public status: string;
  public page: number;
  public total;
  public pages;
  public itemsPerPage;
  public publications: any[];
  public noMore = false;
  public loading: boolean;
  public likes: any[];
  public liked: boolean;
  @Input() user: string;

  constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService,
        private _likeService: LikeService
    ) {

        this.title = 'Publications';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.page = 1;
        this.loading = true;
    }

  ngOnInit() {
    console.log("Publications Component Working...");
    this.getPublications(this.user, this.page);
  }

  ngOnChanges(){
    this.getPublications(this.user, this.page);
  }

  getPublications(user, page, adding = false){
    this._publicationService.getPublicationsUser(this.token, user, page).subscribe(
      response => {
        if(response.publications){
          this.loading = false;
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.items_per_page;

          if(!adding){
            this.publications = response.publications;
          } else {
            //Array of current page publications
            var arrayA = this.publications;
            //New array of the request
            var arrayB = response.publications;
            //Concat the actual array of publications with the new array of request (wiht adding parameter) of the button
            this.publications = arrayA.concat(arrayB);
            //Scroll down if more publications
            $("html, body").animate({scrollTop: $('html').prop("scrollHeight")}, 500);
          }
          //UPDATE LIKES COUNTER AND HEART
          this.updateLikes();

          if(page > this.pages){
            //this._router.navigate(['/timeline']);
          }

        } else {
          this.status = 'error';
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status == 'error';
        }
      }
    );
  }

  updateLikes(){
    this.publications.forEach((publication, index) => {
      let likes = this.getLikes(this.publications[index]._id)
                      .then((value) => {
                        this.likes = [].concat(value);

                        //CREATE NEW PROPERTY ON PUBLICATIONS TO STORE THE LIKES
                        Object.defineProperty(this.publications[index], 'likes', {
                          value: this.likes,
                          writable: true
                        });

                        Object.defineProperty(this.publications[index], 'liked', {
                          value: false,
                          writable: true
                        });

                        this.likes.forEach((like) => {
                          if(like.user._id == this.identity._id) {
                            this.publications[index].liked = true;
                          }
                        });


                      }).catch(error => console.log(error));
      });
  }


  doLike(publication, event: any) {
    if(publication.liked){
      event.target.src = '../../../assets/images/empty-heart.png';
      this.quitLike(publication._id);
    }
    else if(!publication.liked) {
      event.target.src = '../../../assets/images/liked-heart.png';
      this.addLike(publication._id);
    }
  }


  addLike(publicationId){
    var like = new Like('', this.identity._id, publicationId);
    this._likeService.addLike(this.token, like).subscribe(
      response => {
        if(response.like){
          this.updateLikes();
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
      });
  }


  quitLike(publicationId){
    this._likeService.deleteLike(this.token, publicationId).subscribe(
      response => {
        this.updateLikes();
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
      });
  }

  getLikes(publicationId: string){
    let promise = new Promise((resolve, reject) => {
      this._likeService.getLikes(this.token, publicationId).subscribe(
        response => {
          if(response.likes)
              resolve(response.likes);
          },
          error => {
            reject(error);
          });
    });
    return promise;
 }

 viewMore() {
     this.page += 1;
     if(this.page >= this.pages){
         this.noMore = true;
     }
     this.getPublications(this.user, this.page, true);
 }

}
