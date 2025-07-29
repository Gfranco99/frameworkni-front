import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private httpClient: HttpClient) {}

  /* Obtem PDF frm URL link*/
  getPDF(url: string): Observable<Blob> {
    const headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      responseType: 'blob',
    });

    return this.httpClient.get<Blob>(url, {
      headers,
      responseType: 'blob' as 'json',
    });
  }

  /* Obtem PDF from backend File */
  //async getPDFFromHTTPResponse(token, id, tipoProtocolo): Promise<any> {
  async getPDFFromHTTPResponse(tipo, hash, token): Promise<any> {
    return new Promise((resolve, reject) => {
      const httpOptions = {
        headers: new HttpHeaders({
          Accept: 'application/pdf',
          Authorization: 'Token ' + token,
        }),
      };

      this.httpClient
        .get(
          environment.appSettings.API_ENDPOINT +
            'Consultas/AnexoAndamento?tipoAnexo=' +
            tipo +
            '&hash=' +
            hash,
          httpOptions
        )
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (err: HttpErrorResponse) => {
            console.log('Erro no download do PDF : ' + JSON.stringify(err));
            resolve(err);
          },
        });
    });
  }
}
