import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-installapp-ios',
  templateUrl: './installapp-ios.component.html',
  styleUrls: ['./installapp-ios.component.scss'],
})
export class InstallappIosComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

}
