import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private httpClient: HttpClient
  ) { }

  goLogin(dataUserLogin: any): Promise<any> {

    const headers = { "Content-Type": "application/json; charset=utf8" };

    // Sintaxe antiga. Angular avisa que está depreciada
    // return new Promise((resolve, reject) => {
    //   this.httpClient.post(environment.appSettings.API_ENDPOINT + 'access/login', dataUserLogin, { headers })
    //     .subscribe(response => {
    //       resolve(response);
    //     }, (err: HttpErrorResponse) => {
    //       reject(err);
    //     })
    // })

    // Nova sintaxe
    return new Promise((resolve, reject) => {
      this.httpClient.post(environment.appSettings.API_ENDPOINT + 'Access/login', dataUserLogin, { headers })
        .subscribe({
          next: (response) => { resolve(response) },
          error: (err: HttpErrorResponse) => { reject(err) }
        })
    })
  }
}
