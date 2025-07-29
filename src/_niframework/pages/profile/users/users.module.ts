import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UsersPageRoutingModule } from './users-routing.module';
import { UsersPage } from './users.page';
import { OptionsCardComponent } from '../components/options-card/options-card.component';
import { OptionsModalComponent } from '../components/options-modal/options-modal.component';
import { InfoPanelComponent } from '../components/info-panel/info-panel.component';
// import { OptionsCardComponent } from '../components/options-card/options-card.component';
// import { OptionsModalComponent } from '../components/options-modal/options-modal.component';
// import { InfoPanelComponent } from '../components/info-panel/info-panel.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    UsersPage,
    OptionsCardComponent,
    OptionsModalComponent,
    InfoPanelComponent
  ]
})
export class UsersPageModule {}
