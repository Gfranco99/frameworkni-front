import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { rejects } from 'assert';
import { Observable, of } from 'rxjs';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { PermissionsFilter } from 'src/_niframework/models/permissions-filter copy';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) {}

  getPermissions(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(
          environment.appSettings.API_ENDPOINT + 'Permissao/listarPermissoes'
        )
        .subscribe((response) => {
          resolve(response);
        });
    });
  }

  setPermissionsToUser(idUser: number, stringRequest: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT +
            'permissao/associarUsuario?codigoUsuario=' +
            idUser +
            stringRequest +
            '&combinar=true',
          this.headers
        )
        .subscribe({
          next: (response) => {
            resolve('salvo com sucesso');
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          },
        });
      // this.httpClient.post(environment.appSettings.API_ENDPOINT +
      // "permissao/associarUsuario?codigoUsuario=" + idUser + stringRequest + "&combinar=true", this.headers)
      // .subscribe(response => resolve("salvo com sucesso"),
      // ((err: HttpErrorResponse) => console.log(err)))
    });
  }

  addPermission(
    idGroup: number,
    idPermission: number,
    combine: any
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT +
            'permissao/associarGrupo?idGrupo=' +
            idGroup +
            '&idPermissao=' +
            idPermission +
            '&combinar=' +
            combine,
          {}
        )
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err: HttpErrorResponse) => {
            reject(err);
          },
        });
    });
  }

  delPermission(idGroup: number, idPermission: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT +
            'permissao/desassociarGrupo?idGrupo=' +
            idGroup +
            '&idPermissao=' +
            idPermission,
          {}
        )
        .subscribe({
          next: (res) => {
            resolve(res);
          },
          error: (err: HttpErrorResponse) => {
            reject(err);
          },
        });
    });
  }

  getGroupPermissions(idGroup: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(
          environment.appSettings.API_ENDPOINT + 'Permissao/grupo/' + idGroup
        )
        .subscribe((res) => resolve(res));
    });
  }
}
