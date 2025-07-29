import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  // CanActivate,
  // CanActivateChild,
  CanActivateChildFn,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, Subscriber } from 'rxjs';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { VerificarPermissoes } from './VerificarPermissoes';
// import { AuthGuard } from 'src/_niframework/providers/authentication/auth.guard';
import { LocalstorageService } from '../security/localstorage.service';
import ls from 'localstorage-slim';

@Injectable({
  providedIn: 'root',
})
class AuthGuardService {
  teste: string[];

  constructor(
    private router: Router,
    // private authService: AuthGuard,
    private alert: AlertsProvider,
    private localStorageService: LocalstorageService
  ) {}

  // canActivate(activated: ActivatedRouteSnapshot): Observable<boolean> {
  //   return this.checarRota(activated);
  // }

  // canActivateChild(childRoute: ActivatedRouteSnapshot): Observable<boolean> {
  //   return this.checarRota(childRoute);
  // }

  checarRota(activated: ActivatedRouteSnapshot): Observable<boolean> {
    if (
      typeof activated.data['roles'] !== 'undefined' &&
      activated.data['roles'].length
    ) {
      const routerRoles = activated.data['roles'];

      // recupera dados ofuscados
      const userRoles: string[] = JSON.parse(ls.get('rl', { decrypt: true })!);
      console.log("estou no checar rota");
      return new Observable<boolean>((subscriber) => {
        if (!VerificarPermissoes.temPermissao(routerRoles, userRoles)) {
          subscriber.next(false);
          this.alert.showAlert(
            'Acesso negado',
            'Sua conta não tem permissão para acessar este recurso.'
          );
        } else {
          subscriber.next(true);
        }
      });
    }

    return new Observable<boolean>((subscriber) => subscriber.next(true));
  }
}

export const ActivateRouteGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot
): Observable<boolean> => {
  return inject(AuthGuardService).checarRota(next);
};

export const ActivateChildGuard: CanActivateChildFn = (
  next: ActivatedRouteSnapshot
): Observable<boolean> => {
  return inject(AuthGuardService).checarRota(next);
};
