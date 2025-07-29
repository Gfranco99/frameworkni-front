import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-tipo-add',
  templateUrl: './modal-tipo-add.component.html',
  styleUrls: ['./modal-tipo-add.component.scss'],
})
export class ModalTipoAddComponent implements OnInit {

  public tipo: string

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  filter(){
    this.modalCtrl.dismiss(this.tipo);
  }
  
}
