import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
class PermissionsGuard {
    constructor(private router: Router, public navCtrl: NavController) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // if (localStorage.getItem('currentUser')) {
        if (localStorage.getItem('token')) {
            return true;
        }

        // not logged in so redirect to login page with the return url
        //this.router.navigate(['/pages/auth/login'], { queryParams: { returnUrl: state.url }});
        // this.navCtrl.navigateRoot('login');
        this.navCtrl.navigateRoot('/');
        console.log('Redirecionando para o login.....')
        return false;
    }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
    return inject(PermissionsGuard).canActivate(next, state);
}
