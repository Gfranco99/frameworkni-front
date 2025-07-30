import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidadocsServiceService {
  
  private API_URL = '/api/VerifyConformance';
  private TOKEN = 'Token 424B4F58517752616B7573372F6134644463584B5A43426F414A2F6B382B4B357A32546D76727A68466C414239776A4D4134736757767134614D594B50613757';

  constructor(private http: HttpClient) {}

  postPdf(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      Authorization: this.TOKEN,
      // 'Content-Type' deve ser omitido para FormData (será definido automaticamente pelo browser)
    });

    return this.http
      .post(this.API_URL, formData, { headers })
      .toPromise()
      .catch((error: HttpErrorResponse) => {
        console.error('Erro ao enviar para Validadocs:', error.message);
        throw error;
      });
  }
}
