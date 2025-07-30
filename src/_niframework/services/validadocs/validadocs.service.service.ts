import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidadocsServiceService {

  constructor(private httpClient: HttpClient) {}
  
    async postvalidadocs(file: File): Promise<any> {
      return new Promise(async (resolve, reject) => {
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'multipart/form-data',
              Authorization: 'Token 424B4F58517752616B7573372F6134644463584B5A43426F414A2F6B382B4B357A32546D76727A68466C414239776A4D4134736757767134614D594B50613757',
            }),
          };
  
          const formData = new FormData();
          formData.append('file', file, file.name);
        
          this.httpClient
          .post(
            '/endpoint/api/VerifyConformance',
            formData,
            httpOptions
          )
          .subscribe({
            next: (response) => {
              resolve(true);
            },
            error: (err: HttpErrorResponse) => {
              console.log(
                'Erro ao enviar requisição paro o Validadocs : ' +
                  JSON.stringify(err)
              );
            },
          });
  
        
      });
    }
}
