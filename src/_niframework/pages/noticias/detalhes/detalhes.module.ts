import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalhePageRoutingModule } from './detalhes-routing.module';

import { DetalhesPage } from './detalhes.page';
import { NoticiasComponent } from '../noticias/noticias.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalhePageRoutingModule,
  ],
  declarations: [DetalhesPage],
  providers: [
    NoticiasComponent
  ]
})
export class DetalhesPageModule {}
