import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { Noticia } from '../../../models/noticia-model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss'],
})
export class NoticiasComponent implements OnInit {

  /* ATTRIBUTES */
  public data: Noticia[] = [];

  weatherResult = false;

  constructor(
    private httpClient: HttpClient,
    private loadingController: LoadingController,
    private navctrl: Router
    ) { }

  ngOnInit() {

    /** INICIALIZAÇÃO */
    this.getNoticias();

  }


  async getNoticias(): Promise<boolean>{
    const loading = await this.loadingController.create({
      duration: 8000
    });

    return new Promise(async (resolve, reject) => {
      this.httpClient.get(environment.appSettings.API_ENDPOINT + 'Consultas/Noticias').subscribe((response: any) =>{

        this.weatherResult = true;
        this.data = [];

        response.forEach(noticia =>{
          //console.log(noticia);
          this.data.push(noticia);
          resolve(true);
          loading.dismiss();
        },
        (err: HttpErrorResponse) => {
          console.log('Falha ao coletar noticias: ' + JSON.stringify(err));
          resolve(false);
        });
        this.data.sort((b,a)=> a.Data.localeCompare(b.Data)); //ordena array por data em ordem decrescente
      });
      loading.present();
    });
  }

  goNoticiaDetail(noticiaId) {
    this.navctrl.navigate([`app/noticias/detalhes/${noticiaId}`]);
  }

}
