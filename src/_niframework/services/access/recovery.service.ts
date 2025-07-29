import { Injectable } from '@angular/core';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecoveryService {
  constructor(private httpClient: HttpClient) {}

  async sendRecoverPasswordEmail(dataRecovery: any): Promise<any> {
    const headers = { 'Content-Type': 'application/json; charset=utf8' };
    return new Promise((resolve, reject) => {
      // new sintax for observable
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT +
            'access/SolicitarReinicializarSenha',
          dataRecovery,
          { headers }
        )
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (err: HttpErrorResponse) => {
            reject(err);
          },
        });

      // deprecated sintax for observable
      // this.httpClient.post(environment.appSettings.API_ENDPOINT + 'access/SolicitarReinicializarSenha', dataRecovery, {headers}).subscribe(response => {
      //   resolve(response);
      // }, (err: HttpErrorResponse) => {
      //   reject(err)
      // })
    });
  }

  async resetPasswordRequest(formData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // new sintax
      this.httpClient
        .post(environment.appSettings.API_ENDPOINT + 'Access/reinicializarSenha', formData)
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (err: HttpErrorResponse) => {
            reject(err);
          },
        });
    });
    // deprecated sintax for observable
    //   this.httpClient.post(AppSettings.API_ENDPOINT + 'Access/reinicializarSenha', formData)
    //   .subscribe(response => {
    //     resolve(response);
    //   }, (err: HttpErrorResponse) => {
    //     reject(err);
    //   })
    // })
  }
}
