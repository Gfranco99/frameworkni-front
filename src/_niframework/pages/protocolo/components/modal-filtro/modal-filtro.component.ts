import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-filtro',
  templateUrl: './modal-filtro.component.html',
  styleUrls: ['./modal-filtro.component.scss'],
})
export class ModalFiltroComponent implements OnInit {

  public filtro: string
  public ordem: string

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  filter(){
    let data = {
      filtro: this.filtro,
      ordem: this.ordem
    }
    this.modalCtrl.dismiss(data);
  }
}
