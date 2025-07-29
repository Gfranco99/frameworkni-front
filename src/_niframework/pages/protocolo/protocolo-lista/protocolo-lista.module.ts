import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProtocoloListaPageRoutingModule } from './protocolo-lista-routing.module';

import { ProtocoloListaPage } from './protocolo-lista.page';
import { ProtocoloModule } from 'src/_niframework/modules/protocolo/protocolo.module';

import { ModalFiltroComponent } from '../components/modal-filtro/modal-filtro.component';
import { ListarCertidaoComponent } from '../components/listarCertidao/listarCertidao.component';
import { PopoverComponent } from '../components/popover/popover.component';
import { ProtocoloConsultaPage } from '../protocolo-consulta/protocolo-consulta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProtocoloListaPageRoutingModule,
    ProtocoloModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ProtocoloListaPage, PopoverComponent],
  providers: [ProtocoloConsultaPage]
})
export class ProtocoloListaPageModule {}
