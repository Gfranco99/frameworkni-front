import { Injectable } from '@angular/core';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { resolve } from 'dns';
// import { rejects } from 'assert';
// import { data } from 'jquery';
// import { getgroups } from 'process';
import { Groups } from 'src/_niframework/models/groups-filter';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  public headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private httpClient: HttpClient) {}

  getGroup(id?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(environment.appSettings.API_ENDPOINT + 'Grupo/' + id)
        .subscribe((value) => {
          resolve(value);
        });
    });
  }

  getGroups(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(environment.appSettings.API_ENDPOINT + 'grupo/listarGrupos')
        .subscribe((value) => {
          resolve(value);
        });
    });
  }

  setGroupToUser(idUser: number, stringRequest: string): Promise<any> {
    return new Promise((resolve, rejects) => {
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT +
            'grupo/associarUsuario?codigoUsuario=' +
            idUser +
            stringRequest +
            '&combinar=true',
          this.headers
        )
        .subscribe((response) => {
          resolve(response);
        });
    });
  }

  getUsersFromGroup(idGroup: number): Promise<any> {
    return new Promise((resolve, rejects) => {
      this.httpClient
        .get(
          environment.appSettings.API_ENDPOINT +
            'grupo/' +
            idGroup +
            '/usuarios'
        )
        .subscribe((response) => resolve(response));
    });
  }

  enableDisableGroup(group: any, idStatus: boolean): Promise<any> {
    let dataGroup: any = group;
    dataGroup.ativo = idStatus;

    return new Promise((resolve, reject) => {
      this.httpClient
        .put(
          environment.appSettings.API_ENDPOINT + 'Grupo/' + dataGroup.idGrupo,
          dataGroup
        )
        .subscribe((res) => {
          resolve(res);
        });
    });
  }

  newGroup(group: any, token): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Token ' + token,
    });

    return new Promise((resolve, reject) => {
      this.httpClient
        .post(environment.appSettings.API_ENDPOINT + 'grupo/', group, {
          headers: headers,
        })
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err) => {
            reject(err);
          },
        });
      // this.httpClient.post(environment.appSettings.API_ENDPOINT + "grupo/", group, {headers: headers}).subscribe(res => {
      //   resolve(res)
      // }, (err) => {
      //   reject(err)
      // })
    });
  }

  deleteGroup(idGroup: number | undefined): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .delete(environment.appSettings.API_ENDPOINT + 'Grupo/' + idGroup)
        .subscribe((res) => {
          resolve(res);
        });
    });
  }

  updateNameGroup(idGroup: number, group: Object): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .put(environment.appSettings.API_ENDPOINT + 'Grupo/' + idGroup, group)
        .subscribe((res) => resolve(res));
    });
  }

  addUserToGroup(idUser: string, idGroup: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT +
            'Grupo/associarUsuario?codigoUsuario=' +
            idUser +
            '&idGrupo=' +
            idGroup +
            '&combinar=false',
          { headers: this.headers }
        )
        .subscribe((res) => {
          resolve(res);
        });
    });
  }

  delUserFromGroup(idUser: string, idGroup: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT +
            'Grupo/desassociarUsuario?codigoUsuario=' +
            idUser +
            '&idGrupo=' +
            idGroup,
          { headers: this.headers }
        )
        .subscribe((res) => {
          resolve(res);
        });
    });
  }
}
