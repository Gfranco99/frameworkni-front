import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
// import { NoticiasComponent } from '../noticias/noticias/noticias.component';
import { ProtocoloConsultaPageModule } from '../protocolo/protocolo-consulta/protocolo-consulta.module';
import { ProtocoloModule } from 'src/_niframework/modules/protocolo/protocolo.module';
import { ProtocoloConsultaPage } from '../protocolo/protocolo-consulta/protocolo-consulta.page';
// import { NoticiasPage } from '../noticias/noticias/noticias.page';
import { NoticiasComponent } from '../noticias/noticias/noticias.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule,
    ProtocoloModule,
    ProtocoloConsultaPageModule
  ],
  declarations: [HomePage],
  providers: [NoticiasComponent, ProtocoloConsultaPage]
})
export class HomePageModule {}

