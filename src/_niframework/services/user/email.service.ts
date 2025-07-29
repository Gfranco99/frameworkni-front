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
export class EmailService {
  constructor(public utils: Utils, private httpClient: HttpClient) {}

  // Alteração de e-mail
  async emailUpdate(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let normalizeJson = this.utils.normalizeJsonString(data);
      const headers = { 'Content-Type': 'application/json; charset=utf8' };

      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT + 'Access/AtualizarDados',
          normalizeJson,
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

  async getEmail(document: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = { 'Content-Type': 'application/json; charset=utf8' };

      this.httpClient
        .get(
          environment.appSettings.API_ENDPOINT +
            'Access/recuperaremailconta?documento=' +
            document +
            '&enviarEmailConfirmacao=true',
          { headers }
        )
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error) => {
            resolve('error');
          },
        });
    });
  }

  // atualiza e-mail no banco de dados mediante a token válido via sms
  async updateEmailWithToken(
    token: string,
    email: string,
    document: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      // const userEmail = 'email=' + email;
      // const userDocument = '&document=' + document;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Token ' + token,
        }),
      };

      const body = new URLSearchParams();
      body.set('email', email);
      body.set('documento', document);
      const bodyString = body.toString();

      this.httpClient
        .put(
          environment.appSettings.API_ENDPOINT + 'usuario/atualizaremail',
          bodyString,
          httpOptions
        )
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error) => {
            resolve('error');
          },
        });
    });
  }
}
