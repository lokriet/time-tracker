import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  selectedMonth: Date;

  ngOnInit() {
    this.selectedMonth = new Date(2019, 5, 1, 0, 0, 0, 0);
  }

}
