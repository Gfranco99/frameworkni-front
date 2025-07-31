import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    // loadChildren: () => import('./_niframework/pages/start/start.module').then( m => m.StartPageModule)
    loadChildren: () => import('./_niframework/pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./_niframework/pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./_niframework/tabs/tabs.module').then(m => m.TabsPageModule),
  },
  {
    path: 'app',
    loadChildren: () => import('./_niframework/pages/home/home.module').then( m => m.HomePageModule),
    data: {
      roles: ['CRIAR_GRUPO']
    }
  },
  {
    path: 'details-aw-cofre',
    loadChildren: () => import('./_niframework/pages/profile/details-aw-cofre/details-aw-cofre.module').then( m => m.DetailsAwCofrePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./_niframework/pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'confirm',
    loadChildren: () => import('./_niframework/pages/register/confirm/confirm.module').then( m => m.ConfirmPageModule)
  },
  {
    path: 'confirm/:id',
    loadChildren: () => import('./_niframework/pages/register/confirm/confirm.module').then( m => m.ConfirmPageModule)
  },
  {
    path: 'recovery/password',
    loadChildren: () => import('./_niframework/pages/recovery/senha/recovery.module').then( m => m.RecoveryPageModule)
  },
  {
    path: 'recovery/email',
    loadChildren: () => import('./_niframework/pages/recovery/email/email-recovery.module').then( m => m.EmailPageModule)
  },
  {
    path: 'newpassword',
    loadChildren: () => import('./_niframework/pages/newpassword/newpassword.module').then( m => m.NewpasswordPageModule)
  },
  {
    path: 'newpassword/:id',
    loadChildren: () => import('./_niframework/pages/newpassword/newpassword.module').then( m => m.NewpasswordPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./_niframework/pages/errors/notfound404/notfound404.module').then( m => m.Notfound404PageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
