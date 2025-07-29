
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import { ActivateChildGuard, ActivateRouteGuard } from '../services/guards/auth-guard.service';

// import { AuthGuardService } from '../services/guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    canActivate: [ActivateRouteGuard],
    canActivateChild: [ActivateChildGuard],
    children: [
      // Tab Home
      {
        path: '',
        children: [
          {
            path: '',
            loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'home',
            loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'profile/details',
            loadChildren: () => import('../pages/profile/details/details.module').then(m => m.DetailsPageModule)
          },
          {
            path: 'profile/edit',
            loadChildren: () => import('../pages/profile/edit/edit.module').then(m => m.EditPageModule)
          },
          {
            path: 'details-aw-cofre',
            loadChildren: () => import('../pages/profile/details-aw-cofre/details-aw-cofre.module').then( m => m.DetailsAwCofrePageModule)
          },
          {
            path: 'noticias',
            loadChildren: () => import('../pages/noticias/lista/lista.module').then( m => m.ListaPageModule)
          },
          {
            path: 'meusprotocolos',
            loadChildren: () => import('../pages/protocolo/protocolo-lista/protocolo-lista.module')
            .then( m => m.ProtocoloListaPageModule)
          },
          {
            path: 'duvidas',
            loadChildren: () => import('../pages/duvidas/lista/lista.module').then( m => m.ListaPageModule)
          },
          {
            path: 'users',
            loadChildren: () => import('../pages/profile/users/users.module').then( m => m.UsersPageModule)
          },
          {
            path: 'users-filter',
            loadChildren: () => import('../pages/profile/users-filter/users-filter.module').then( m => m.UsersFilterPageModule)
          },
          {
            path: 'groups',
            loadChildren: () => import('../pages/profile/groups/groups.module').then( m => m.GroupsPageModule)
          },
          {
            path: 'group-properties',
            loadChildren: () => import('../pages/profile/group-properties/group-properties.module').then( m => m.GroupPropertiesPageModule),
            data: {
              roles: ['CRIAR_GRUPO']
            }
          }
        ]
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  // providers: [AuthGuardService],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
