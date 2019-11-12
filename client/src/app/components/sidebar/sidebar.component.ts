import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { UploadService } from '../../services/upload.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService, PublicationService, UploadService, ToastrService]
})
export class SidebarComponent implements OnInit {

  public identity;
  public token;
  public stats;
  public url;
  public status;
  public publication;
  public loading: boolean;

  constructor(
        private _userService: UserService,
        private _publicationService: PublicationService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _uploadService: UploadService,
        private toastr: ToastrService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.stats = this.getCounters();
        this.url = GLOBAL.url;
        this.publication = new Publication('', '', '', '', this.identity._id);
        this.loading = true;
    }

  ngOnInit() {
      console.log("Sidebar Compent Working...");
      this.loading = false;
  }

  onSubmit(form, $event){
      this.loading = true;
      this._publicationService.addPublication(this.token, this.publication).subscribe(
        response => {
            if(response.publication){

                if(this.filesToUpload && this.filesToUpload.length){
                    //UPLOAD IMAGE
                    this._uploadService.makeFileRequest(this.url + 'upload-image-publication/' + response.publication._id, [], this.filesToUpload, this.token, 'image')
                        .then((result:any) => {
                            this.publication.file = result.image;
                            this.loading = false;
                            this.toastr.success('Posted correctly');
                            this.getCounters();
                            form.reset();
                            this._router.navigate(['/timeline']);
                            this.sent.emit({send: 'true'});
                    });
                }else{
                    this.loading = false;
                    this.toastr.success('Posted correctly');
                    this.getCounters();
                    form.reset();
                    this._router.navigate(['/timeline']);
                    this.sent.emit({send: 'true'});
                }

               } else {
                  this.loading = false;
				          this.toastr.error('Not posted.');
               }
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


  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any){
      this.filesToUpload = <Array<File>>fileInput.target.files;
  }


  //Output, Make the event available for the parent component
  @Output() sent = new EventEmitter();

  getCounters(){
    this._userService.getCounters(this.identity._id).subscribe(
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

  /**
  sendPublication(event){
      this.sent.emit({send: 'true'});
  }**/

}
