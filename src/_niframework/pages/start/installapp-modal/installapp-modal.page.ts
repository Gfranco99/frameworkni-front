import { Component, OnInit } from '@angular/core';
import {  ModalController } from '@ionic/angular';

@Component({
  selector: 'app-installapp-modal',
  templateUrl: './installapp-modal.page.html',
  styleUrls: ['./installapp-modal.page.scss'],
})
export class InstallappModalPage implements OnInit {

  constructor(public modalCtrl: ModalController) { 

  }

  ngOnInit() {

  }

  closeModal(choice) {
    let msg = { "install": choice};
    this.modalCtrl.dismiss(msg);
  }  

}
