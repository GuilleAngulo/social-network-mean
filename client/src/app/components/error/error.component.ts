import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

 public title: string;
 public subtitle: string;

  constructor() {
    this.title = "ERROR 404";
    this.subtitle = "Not Found";
  }

  ngOnInit() {

  }

}
