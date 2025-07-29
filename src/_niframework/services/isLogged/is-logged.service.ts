import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedService {
  // userStatus: Subject<any> = new Subject();

  constructor( private navctrl: Router ) { }
 
  /* Válida se usuário logado, para então liberar a página  */ 
 
  isLoggedVerify(): void {
    let isLogged = localStorage.getItem('currentUser');
    if (isLogged === null){
      alert("Faça login para acessar a página.")
      this.navctrl.navigateByUrl('/login').then(() => {
      window.location.reload();  
        }
      )
    }
  }
}
