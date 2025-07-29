import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utils } from 'src/_niframework/providers/utils/utils-functions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CodigoOtpService {
  constructor(private httpClient: HttpClient, private utils: Utils) {}

  sendOTPcode(userCode, tipoNotificacao?): Promise<any> {
    const headers = new HttpHeaders();
    const formData = new FormData();

    headers.append('Content-Type', 'multipart/form-data');
    formData.append('codigoUsuario', userCode);
    formData.append('tipoNotificacao', tipoNotificacao);

    return new Promise((resolve, reject) => {
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT + 'Access/EnviarCodigoOTP',
          formData,
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
    });
  }

  validateOTPcode(userCode, OTPcode, mustActivate: boolean) {
    const headers = { 'Content-Type': 'application/json; charset=utf8' };

    let userData = {
      codigoUsuario: userCode,
      codigoOTP: OTPcode,
      ativarContaUsuario: mustActivate,
    };

    let normalizeJson = this.utils.normalizeJsonString(userData);

    return new Promise((resolve, reject) => {
      this.httpClient.post(environment.appSettings.API_ENDPOINT + 'Access/ValidarCodigoOTP', normalizeJson, {headers})
      .subscribe({
        next: (response) => {
          resolve(response);
        },
        error: (err: HttpErrorResponse) => {
          reject(err);
        }
      })
    })
  }
}
