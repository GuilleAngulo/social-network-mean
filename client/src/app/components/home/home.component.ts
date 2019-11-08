import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: []
})
export class HomeComponent implements OnInit {

  public title: string;
    
    
  constructor() {
    this.title = 'NGSOCIAL';
  }

  ngOnInit() {
      console.log('Home Component Working...');
  }

}
