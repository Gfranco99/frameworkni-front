import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private subjectNewGroup = new Subject<void>();
  private subjetDetailsChanges = new Subject<void>();
  private subjectEditGroup = new Subject<void>();
  private subjetUpdateDataTableGroups = new Subject<void>();
  private subjetUpdateDataTableUserFilter = new Subject<void>();
  private subjetUpdateChanges = new Subject<void>();
  private subjetCleanChanges = new Subject<void>();
  
  // criar novo grupo
  sendCreateNewGroup() {
    setTimeout(() => {
      this.subjectNewGroup.next();
    }, 1000)
  }

  getRequestNewGroup(): Observable<any> {
    return this.subjectNewGroup.asObservable();
  }

  // editar grupo existente
  sendEditGroup() {
    setTimeout(() => {
      this.subjectEditGroup.next();
    }, 1000)
  }

  getRequestEditGroup(): Observable<any> {
    return this.subjectEditGroup.asObservable();
  }

  // atualizar tablea de grupos após edição
  sendUpdateGroupsTable():void {
    this.subjetUpdateDataTableGroups.next();
  }

  getRequestUpdateGroupsTable() {
    return this.subjetUpdateDataTableGroups.asObservable();
  }

  // atualizar table de filtros de usuarios
  sendUpdateUserFilter():void {
    this.subjetUpdateDataTableUserFilter.next();
  }

  getRequestUpdateUserFilter() {
    return this.subjetUpdateDataTableUserFilter.asObservable();
  }

  // envia uma notificação ao identificar mudanças no card
  sendUpdateChanges():void {
    this.subjetUpdateChanges.next();
  }

  getRequestChanges() {
    return this.subjetUpdateChanges.asObservable();
  }

   // Notifica ao identificar mudanças que não foram salvas
   sendCleanChanges():void {
    setTimeout(() => {
      this.subjetCleanChanges.next();
    }, 1000);
  }
  
  getCleanChanges() {
    return this.subjetCleanChanges.asObservable();
  }

  // atualiza dados do usuário em detalhes
  sendDetailsChanges():void {
  setTimeout(() => {
    this.subjetDetailsChanges.next();
  }, 1000);
  }
  
  getDetailsChanges() {
    return this.subjetDetailsChanges.asObservable();
  }

}
