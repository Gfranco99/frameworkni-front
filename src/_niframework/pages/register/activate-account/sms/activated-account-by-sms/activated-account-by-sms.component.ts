import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-activated-account-by-sms',
  templateUrl: './activated-account-by-sms.component.html',
  styleUrls: ['./activated-account-by-sms.component.scss'],
})
export class ActivatedAccountBySmsComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }
  
}
