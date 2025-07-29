import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { rejects } from 'assert';
// import { resolve } from 'dns';
import { from } from 'rxjs';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SystemProfilesService {
    
  headers = new HttpHeaders({'Content-Type': 'application/json'})
 
  constructor(private httpClient: HttpClient) { }

  getSystemProfiles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(environment.appSettings.API_ENDPOINT + "perfil/listarPerfis").subscribe(response => {
        resolve(response)
      })
    })
  }

  setProfileToUser(idUser: number, stringRequest: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.post(environment.appSettings.API_ENDPOINT +
        "Perfil/associarPerfil?codigoUsuario=" + idUser + stringRequest, this.headers).subscribe(response => {
          if(response) {
            resolve(response)
          } else {
            reject("ocorreu um erro")
          }
        })
    })
  }

  getUsersWithProfile(idProfile: number): Promise<any> {
    return new Promise((resolve, rejects) => {
      this.httpClient.get(environment.appSettings.API_ENDPOINT +
        "perfil/" + idProfile+ "/usuarios").subscribe(response => resolve(response));
        })
  }
}
