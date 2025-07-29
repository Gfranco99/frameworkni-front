import {
  TiposProtocoloEnum,
  TiposProtocoloLabel,
} from './../../../models/enum-protocolos';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { ModalTipoAddComponent } from '../components/modal-tipo-add/modal-tipo-add.component';

@Component({
  selector: 'app-protocolo-consulta',
  templateUrl: './protocolo-consulta.page.html',
  styleUrls: ['./protocolo-consulta.page.scss'],
})
export class ProtocoloConsultaPage implements OnInit {
  /*ATTRIBUTES*/
  public onProtConsultaProtocolForm: FormGroup;

  //Indicador para associação de protocolo na conta do usuário
  public inDoAssociation: boolean;

  //Tipo de protocolo que será consultado
  public protocolType: string;
  public protocolDescription: string;
  public passwordType = 'password';

  constructor(
    private formBuilder: FormBuilder,
    private routeCtrl: Router,
    private inputRoute: ActivatedRoute,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    console.log('iniciado');
    /*FORM*/
    this.onProtConsultaProtocolForm = this.formBuilder.group({
      numero: [null, Validators.compose([Validators.required])],
      senha: [null, Validators.compose([Validators.required])],
    });

    //Get param filter from Home
    this.inputRoute.queryParams.subscribe((params) => {
      this.inDoAssociation = params.add === 'true';
      if (this.inDoAssociation) {
        this.protocolOptionsShow();
      }
      this.protocolType = params.type;
      this.onProtConsultaProtocolForm.reset();
      this.protocolDescription = TiposProtocoloLabel.get(
        TiposProtocoloEnum[params.type]
      )!;
    });
  }

  goProtocolDetails() {
    const prot = this.onProtConsultaProtocolForm.controls.numero.value;
    let pass = this.onProtConsultaProtocolForm.controls.senha.value;
    localStorage.setItem('volta', 'app/home');

    try {
      //this.routeCtrl.navigate(['#/app/protocolo', prot, pass, this.protocolType, this.inDoAssociation]);
      this.routeCtrl.navigate(
        [prot, pass, this.protocolType, this.inDoAssociation],
        { relativeTo: this.inputRoute }
      );
    } catch (error) {
      if (this.inDoAssociation) {
        this.protocolOptionsShow();
      } else {
        this.routeCtrl.navigate(['/app']);
      }
    }
  }

  togglePasswordMode() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  }

  async protocolOptionsShow() {
    const modal = await this.modalCtrl.create({
      //modal de confirmação
      component: ModalTipoAddComponent,
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    this.protocolType = data;
    this.protocolDescription = TiposProtocoloLabel.get(
      TiposProtocoloEnum[data]
    )!;
  }

  editar(eve: any) {
    eve.srcElement.readonly = false;
  }
}
