import { Injectable } from '@angular/core';
// import { rejects } from 'assert';
import { Utils } from 'src/_niframework/providers/utils/utils-functions';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PhoneService {
  constructor(public utils: Utils, private httpClient: HttpClient) {}

  getPhone(cpf: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let cpfUnmasked = cpf.replace('.', '').replace('.', '').replace('-', '');

      // let normalizeJson = this.utils.normalizeJsonString(cpfUnmasked);
      const headers = { 'Content-Type': 'application/json; charset=utf8' };

      this.httpClient
        .get(
          environment.appSettings.API_ENDPOINT +
            'usuario/gettelefone?documento=' +
            cpfUnmasked,
          { headers }
        )
        .subscribe({
          next: (response: any) => {
            resolve(response);
          },
          error: (err: HttpErrorResponse) => {
            return console.log(err);
          },
        });
    });
  }

  // Solicita o envio de código sms
  smsCodeRequest(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let normalizeJson = this.utils.normalizeJsonString(data);
      const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

      let body = new URLSearchParams();
      body.set('telefone', data);
      let bodyToString = body.toString();

      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT + 'Access/EnviarSmsCode',
          bodyToString,
          { headers }
        )
        .subscribe({
          next: (response: any) => {
            resolve(response);
          },
          error: (err: HttpErrorResponse) => {
            reject(err);
          },
        });
    });
  }

  //  // Verifca código SMS e ativa usuário se válido
  // smsCodeCheck(data: any): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     let normalizeJson = this.utils.normalizeJsonString(data);
  //     const headers = { 'Content-Type': 'application/json; charset=utf8' };

  //   this.httpClient.post(environment.appSettings.API_ENDPOINT + 'Access/ValidarSmsCode', normalizeJson, { headers })
  //     .subscribe((response: any) => {
  //       resolve(response)
  //     }, (err: HttpErrorResponse) => {
  //       return console.log(err);
  //     } )
  //   })
  // }

  // Verifca código SMS e ativa usuário se válido
  smsCodeCheck(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let normalizeJson = this.utils.normalizeJsonString(data);
      const headers = { 'Content-Type': 'application/json; charset=utf8' };

      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT + 'Access/ValidarSmsCode',
          normalizeJson,
          { headers }
        )
        .subscribe({
          next: (response: any) => {
            resolve(response);
          },
          error: (err: HttpErrorResponse) => {
            reject(err);
          },
        });
    });
  }
}
