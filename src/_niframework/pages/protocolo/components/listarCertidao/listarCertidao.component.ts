import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-listar-certidao',
  templateUrl: './listarCertidao.component.html',
  styleUrls: ['./listarCertidao.component.css']
})
export class ListarCertidaoComponent implements OnInit {


  @Input() dados: any;
  @Input() nrProtocolo: any;

  public vlTotal = 0

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.calculaTotal();
  }

  consol() {
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async calculaTotal() {
    this.dados.forEach((item: any) => {
      this.vlTotal += item.vlValor
    });
  }

}
