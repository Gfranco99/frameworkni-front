import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { ModalFiltroComponent } from '../modal-filtro/modal-filtro.component';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {


  constructor(
    private popCtrl: PopoverController,
    private navCtrl: Router,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  goAdicionarProtocolo() {
    this.popCtrl.dismiss('add');
  }

  goQrCode(){
    this.popCtrl.dismiss('qr');

  }

  async goOrderList(){
    this.popCtrl.dismiss('filter')
  }

  async goRemove(){
    this.popCtrl.dismiss('remove')
  }

}
