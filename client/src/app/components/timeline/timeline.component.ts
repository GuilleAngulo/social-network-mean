import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';

import { Like } from '../../models/like';
import { LikeService } from '../../services/like.service';

declare var jQuery:any;
declare var $:any;


@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService, LikeService]
})
export class TimelineComponent implements OnInit {

  public title: string;
  public identity;
  public token;
  public url: string;
  public status: string;
  public page: number;
  public total;
  public pages;
  public itemsPerPage;
  //public publications: Publication[];
  public publications: any[];
  //Check if show or no button of Load More
  public noMore = false;
  public showImage;
  public loading: boolean;
  //LIKES//
  //public likes: Like[];
  public likes: any[];
  public liked: boolean;

  constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService,
        private _likeService: LikeService
    ) {

        this.title = 'Timeline';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.page = 1;
        this.loading = true;
    }

  ngOnInit() {
      console.log("Timeline Component Working...");
      this.getPublications(this.page);
  }

  getPublications(page, adding = false){
      this._publicationService.getPublications(this.token, page).subscribe(
        response => {
            if(response.publications) {
              this.loading = false;
              this.total = response.total_items;
              this.pages = response.pages;
              this.itemsPerPage = response.items_per_page;
              console.log(response.publications);
              console.log(this.page);

              if(!adding){
                this.publications = response.publications;
              } else {
                //Array of current page publications
                var arrayA = this.publications;
                //New array of the request
                var arrayB = response.publications;
                //Concat the actual array of publications with the new array of request (wiht adding parameter) of the button
                this.publications = arrayA.concat(arrayB);

                $("html, body").animate({scrollTop: $('body').prop("scrollHeight")}, 500);

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
    //The Button View More
     viewMore(){
     this.page += 1;
     if(this.page == this.pages){
      this.noMore = true;
     }
     this.getPublications(this.page, true);
 }

    //This functions comes from the component child Sidebar (Output), when the button post publication is clicked
    refresh(event = null){
      this.page = 1;
      this.getPublications(this.page);
      this.noMore = false;
    }

    showThisImage(id){
      this.showImage = id;
    }

    hideThisImage(id){
      this.showImage = 0;
    }

    deletePublication(id){
      this._publicationService.deletePublication(this.token, id).subscribe(
        response => {
          this.refresh();
        },
        error => {
          console.log(<any>error);
        });
    }

    updateLikes(){
      this.publications.forEach((publication, index) => {
        let likes = this.getLikes(this.publications[index]._id)
                    .then((value) => {
                      this.likes = [].concat(value);

                      Object.defineProperty(this.publications[index], 'likes', {
                        value: this.likes,
                        writable: true
                      });

                      Object.defineProperty(this.publications[index], 'liked', {
                        value: false,
                        writable: true
                      });

                      this.likes.forEach((like) => {
                        if(like.user._id == this.identity._id){
                          this.publications[index].liked = true;
                        }
                      });

                    }).catch(error => console.log(error));
        });
    }


    doLike(publication, event: any) {
      if(publication.liked) {
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
            if(response.likes) resolve(response.likes);
          },
          error => {
            reject(error);
          });
      });
      return promise;
    }

}
