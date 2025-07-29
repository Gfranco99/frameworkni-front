import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { IonicModule } from '@ionic/angular';

import { ListaPageRoutingModule } from './lista-routing.module';
// import { ListaPage } from './lista.page';
// import { NoticiasComponent } from '../noticias/noticias.component';
import { IonicModule } from '@ionic/angular';
import { ListaPage } from './lista.page';
import { HomePageModule } from '../../home/home.module';
import { NoticiasModule } from '../noticias/noticias.module';
// import { NoticiasPage } from '../noticias/noticias.page';
// import { NoticiasComponent } from '../noticias/noticias.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // IonicModule,
    IonicModule,
    ListaPageRoutingModule,
    // HomePageModule
    NoticiasModule
  ],
  declarations: [ListaPage]
})
export class ListaPageModule {}
