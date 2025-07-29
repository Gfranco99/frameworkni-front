import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterPage } from './register.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage
  },
  {
    path: 'confirm',
    loadChildren: () => import('./confirm/confirm.module').then( m => m.ConfirmPageModule)
  },
  {
    path: 'options',
    loadChildren: () => import('./activate-account/options/options.module').then( m => m.OptionsPageModule)
  },
  {
    path: 'email-activation',
    loadChildren: () => import('./activate-account/email/email-activation/email-activation.module').then( m => m.EmailActivationPageModule)
  },
  {
    path: 'finally',
    loadChildren: () => import('./activate-account/finally/finally/finally.module').then( m => m.FinallyPageModule)
  },
  {
    path: 'sms-activation',
    loadChildren: () => import('./activate-account/sms/sms-activation/sms-activation.module').then( m => m.SmsActivationPageModule)
  },
  {
    path: 'security-check',
    loadChildren: () => import('./activate-account/security/security-check/security-check.module').then( m => m.SecurityCheckPageModule)
  },
  {
    path: 'data-profile-update',
    loadChildren: () => import('./activate-account/components/data-profile-update/data-profile-update.module').then( m => m.DataProfileUpdatePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterPageRoutingModule {}
