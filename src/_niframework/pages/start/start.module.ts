import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartPageRoutingModule } from './start-routing.module';

import { StartPage } from './start.page';
import {InstallappModalPage} from './installapp-modal/installapp-modal.page';
import { InstallappIosComponent } from './installapp-ios/installapp-ios.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartPageRoutingModule
  ],
  declarations: [StartPage, InstallappModalPage, InstallappIosComponent ]
  // entryComponents: [InstallappModalPage],  
})
export class StartPageModule {}
