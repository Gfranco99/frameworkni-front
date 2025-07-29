import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-data-profile-update',
  templateUrl: './data-profile-update.page.html',
  styleUrls: ['./data-profile-update.page.scss'],
})
export class DataProfileUpdatePage implements OnInit {
  option: string = '';

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((param) => {
      this.option = param.option;
    })
  }

}
