import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { rejects } from "assert";
// import { error } from "console";
// import { resolve } from "dns";
// // import { appendFile } from "fs";
// import { Observable } from "rxjs";
// import { AppSettings } from "src/_niframework/config/appSettings";
// import { UserFilter } from "src/_niframework/models/user-filter";
// import { UserProfileModel } from "src/_niframework/models/user.model";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  registerUser(newUser: any): Promise<any> {
    const headers = { 'Content-Type': 'application/json; charset=utf8' };

    return new Promise((resolve, reject) => {
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT + 'access/registrar',
          newUser,
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

  /** Service Method to retries User Profile **/
  getUserProfile(userCode: any, token: any): Promise<any> {
    return new Promise((resolve, reject) => {
      //POST user/SolicitarDadosUsuario
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Token ' + token,
        }),
      };

      const body = new URLSearchParams();
      body.set('codigoUsuario', userCode);
      body.toString();

      this.httpClient
        .get(
          environment.appSettings.API_ENDPOINT + 'usuario/detalhe?' + body,
          httpOptions
        )
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error: HttpErrorResponse) => {
            reject('error');
            console.log(error);
          },
        });

      // this.httpClient
      //   .get(
      //     environment.appSettings.API_ENDPOINT + 'usuario/detalhe?' + body,
      //     httpOptions
      //   )
      //   .subscribe(
      //     (response: any) => {
      //       //console.log(response)
      //       resolve(response);
      //     },
      //     (error) => {
      //       reject('error');
      //       console.log(error);
      //     }
      //   );
    });
  }

  // getUserProfile(userEmail, token): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     //POST user/SolicitarDadosUsuario
  //     const httpOptions = {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json',
  //         Authorization: 'Token ' + token
  //       })
  //     };

  //     this.httpClient.get(environment.appSettings.API_ENDPOINT + 'usuario/detalhe/?email=' + userEmail,  httpOptions)
  //       .subscribe((response: UserProfileModel) => {
  //         //console.log(response)
  //         resolve(response);
  //       },
  //       error => {
  //         resolve('error');
  //         console.log(error);
  //       });
  //   });
  // }

  /*
   * Service Method to update User Profile
   */

  async setUserProfile(
    userProfile: any,
    token: any,
    idUser: any
  ): Promise<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token,
      }),
    };

    return new Promise((resolve, reject) => {
      this.httpClient
        .put(
          environment.appSettings.API_ENDPOINT +
            'usuario/atualizarUsuario/' +
            idUser,
          userProfile,
          httpOptions
        )
        .subscribe({
          next: (repsonse: any) => {
            resolve(true);
          },
          error: (err: HttpErrorResponse) => {
            console.log('Falha ao atualizar o profile: ' + JSON.stringify(err));
            resolve(false);
          },
        });

      // this.httpClient
      //   .put(
      //     environment.appSettings.API_ENDPOINT +
      //       'usuario/atualizarUsuario/' +
      //       idUser,
      //     userProfile,
      //     httpOptions
      //   )
      //   .subscribe({
      //     next: (response: any) => {
      //       resolve(true);
      //     },
      //     error: (err: HttpErrorResponse) => {
      //       console.log('Falha ao atualizar o profile: ' + JSON.stringify(err));
      //       resolve(false);
      //     },
      //   });

      //  return new Promise((resolve, reject) => {
      //   this.httpClient.put(environment.appSettings.API_ENDPOINT + "usuario/atualizarUsuario/" + idUser, userProfile, httpOptions)
      //   .subscribe(response => resolve(true),
      //     (err: HttpErrorResponse) => {
      //      console.log("Falha ao atualizar o profile: " + JSON.stringify(err))
      //        resolve(false)
      //       });
    });

    // return new Promise((resolve, reject) => {
    //   const httpOptions = {
    //     headers: new HttpHeaders({
    //       'Content-Type': 'application/json',
    //       Authorization: 'Token ' + token
    //     })
    //   };

    //   this.httpClient.put(environment.appSettings.API_ENDPOINT + 'usuario/atualizarUsuario/' + idUser, {userProfile}).subscribe(response => console.log(response))
    // });
  }

  // async setUserProfile(userProfile, token): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     //POST user/SolicitarDadosUsuario
  //     const httpOptions = {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json',
  //         Authorization: 'Token ' + token
  //       })
  //     };

  //     this.httpClient.post(environment.appSettings.API_ENDPOINT + 'Usuario/AtualizarUsuario', userProfile, httpOptions)
  //       .subscribe(
  //         (response: any) => {
  //           resolve(true);
  //         },
  //         (err: HttpErrorResponse) => {
  //           console.log("Falha ao atualizar o profile: " + JSON.stringify(err))
  //           resolve(false);
  //         }
  //       );
  //   });
  // }

  /*
   * Service Method to update User messaging token
   */
  async updateMessagingToken(
    userId: any,
    messageToken: any,
    token: any
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      //POST user/AtualizaTokenPush
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Token ' + token,
        }),
      };

      let userMessagingModel = {
        userId: userId,
        token: messageToken,
      };

      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT + 'usuario/AtualizaTokenPush',
          userMessagingModel,
          httpOptions
        )
        .subscribe({
          next: (response: any) => {
            resolve(true);
          },
          error: (err: HttpErrorResponse) => {
            console.log(
              'Falha ao atualizar o User Messaging Token: ' +
                JSON.stringify(err)
            );
            resolve(false);
          },
        });
    });
  }
  getUsersFromDB(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(
          environment.appSettings.API_ENDPOINT + '/api/Usuario/listarUsuarios'
        )
        .subscribe((response) => {
          resolve(response);
        });
    });
  }

  /* filtro de avançado de usuários  */
  async getUserListFilter(data: any): Promise<any> {
    const body = new URLSearchParams();

    if (data.nome) {
      body.set('nome', data.nome);
    }
    if (data.idPerfil) {
      body.set('idPerfil', data.idPerfil);
    }
    if (data.idGrupo) {
      body.set('idGrupo', data.idGrupo);
    }

    const bodyString = body.toString();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Token ' + data.token,
      }),
    };
    return new Promise((resolve, reject) => {
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT +
            'Usuario/listarUsuarios/filtros',
          bodyString,
          httpOptions
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

  async getUserList(user: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(
          environment.appSettings.API_ENDPOINT +
            'usuario/listarUsuarios?nome=' +
            user
        )
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (err: HttpErrorResponse) => {
            console.log('Falha ao realizar a requisição');
            console.log(err.message);
          },
        });
    });
  }

  async getSystemUserProfiles(userCode: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(
          environment.appSettings.API_ENDPOINT + 'perfil/usuario/' + userCode
        )
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (err: HttpErrorResponse) => {
            console.log('Falha ao trazer os perfis do usuário');
            console.log(err.message);
          },
        });
    });
  }

  async getCurrentUserPermissions(userCode: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(
          environment.appSettings.API_ENDPOINT + 'permissao/usuario/' + userCode
        )
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (err: HttpErrorResponse) => {
            console.log('Falha ao trazer as permissões do usuário');
            console.log(err.message);
          },
        });
      // .subscribe(
      //   (response) => {
      //     resolve(response);
      //   },
      //   (err: HttpErrorResponse) => {
      //     console.log('Falha ao trazer as permissões do usuário');
      //     console.log(err.message);
      //   }
      // );
    });
  }

  async getCurrentUserGroups(userCode: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .get(environment.appSettings.API_ENDPOINT + 'grupo/usuario/' + userCode)
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (err: HttpErrorResponse) => {
            console.log('Falha ao trazer os grupos do usuário');
            console.log(err.message);
          },
        });
      // .subscribe(
      //   (response) => {
      //     resolve(response);
      //   },
      //   (err: HttpErrorResponse) => {
      //     console.log('Falha ao trazer os grupos do usuário');
      //     console.log(err.message);
      //   }
      // );
    });
  }

  // valida se usário é válido no sistema através de e-mail e documento
  async userValidate(emailData: string, documentData?: string): Promise<any> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    const bodyData = new URLSearchParams();
    bodyData.set('email', emailData);
    bodyData.set('documento', documentData!);
    let bodyDataToString = bodyData.toString();

    return new Promise((resolve, reject) => {
      this.httpClient
        .post(
          environment.appSettings.API_ENDPOINT + 'Usuario/validarUsuario',
          bodyDataToString,
          { headers }
        )
        .subscribe({
          next: (response) => {
            return resolve(response);
          },
          error: (err: HttpErrorResponse) => {
            return reject(err);
          },
        });
    });
  }
}
