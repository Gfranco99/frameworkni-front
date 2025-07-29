import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { first, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserFromFilterService {
  userObservable = new Subject<any>();
  userNotify = new Subject<void>();

  
  setUser(userSelected: any): void {
    setTimeout(() => {
      this.userNotify.next();
      this.userObservable.next(userSelected);
    }, 1000)
  }

  getUser(): Observable<any> {
    return this.userObservable.asObservable();
  }

}

/*
  Atualiza o usuário selecionado no filtro para ser utilizado em um observable no projeto
*/
