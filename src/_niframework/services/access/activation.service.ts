import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { Utils } from 'src/_niframework/providers/utils/utils-functions';
import { environment } from 'src/environments/environment';
import { error } from '@rxweb/reactive-form-validators';

@Injectable({
  providedIn: 'root'
})
export class ActivationService {
  
  constructor(
    private httpClient: HttpClient,
    private utils: Utils,
    
    ) { }
    
    async emailValidate(email: string): Promise<any> {
      // let data = {dsEmail : email}
      let normalizeJson = this.utils.normalizeJsonString(email);
      const headers = { "Content-Type": "application/json; charset=utf8" };
      
    return new Promise((resolve, reject) => {
      
      this.httpClient.post(environment.appSettings.API_ENDPOINT + 'Usuario/validarEmail', normalizeJson, {headers})
      .subscribe({
        next: (response) => { resolve(response) },
        error: (error: HttpErrorResponse) => { return console.log(error) }
      })

      // this.httpClient.post(environment.appSettings.API_ENDPOINT + 'Usuario/validarEmail', normalizeJson, {headers})
      // .subscribe(response => {
      //   resolve(response)
      // }, (err: HttpErrorResponse) => {
      //   return console.log(err);
      // })
    })
  }
}
