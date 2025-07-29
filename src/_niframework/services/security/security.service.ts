import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private cleanCpf = new Subject<void>();

  // envia aviso para limpar cpf
  sendRequestCleanCpf() {
    this.cleanCpf.next();
  };

  // recebe aviso para limpar cpf
  getRequestCleanCpf(): Observable<unknown> {
    return this.cleanCpf.asObservable();
  }

}
