import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProtocoloConsultaPageRoutingModule } from './protocolo-consulta-routing.module';

import { ProtocoloConsultaPage } from './protocolo-consulta.page';

import { ModalTipoAddComponent } from '../components/modal-tipo-add/modal-tipo-add.component';
import { ModalFiltroComponent } from '../components/modal-filtro/modal-filtro.component';
import { ListarCertidaoComponent } from '../components/listarCertidao/listarCertidao.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProtocoloConsultaPageRoutingModule
  ],
  declarations: [ProtocoloConsultaPage, ModalTipoAddComponent, ListarCertidaoComponent, ModalFiltroComponent]
})
export class ProtocoloConsultaPageModule {}
