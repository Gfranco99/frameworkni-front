import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-finally',
  templateUrl: './finally.page.html',
  styleUrls: ['./finally.page.scss'],
})
export class FinallyPage implements OnInit {
  option: string;


  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.option = params.option;
      //sessionStorage.removeItem("tel")
    });
  }

}
