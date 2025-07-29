import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NoticiasComponent } from './noticias.component';



@NgModule({
  declarations: [NoticiasComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    NoticiasComponent
  ]
})
export class NoticiasModule { }
