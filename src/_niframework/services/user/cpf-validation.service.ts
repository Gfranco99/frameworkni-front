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
export class CpfValidationService {
  constructor(public utils: Utils, private httpClient: HttpClient) {}

  cpfCheck(cpf: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let cpfUnmasked = cpf.replace('.', '').replace('.', '').replace('-', '');

      // let normalizeJson = this.utils.normalizeJsonString(cpfUnmasked);

      const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT + 'Usuario/validarDocumento',
          'documento=' + cpfUnmasked,
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
}
