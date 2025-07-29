import { Component, OnInit, ViewChild } from '@angular/core';
import {
  IonContent,
  LoadingController,
  ModalController,
  AlertController,
} from '@ionic/angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Duvida } from 'src/_niframework/models/duvidas-model';
import { ModalDescComponent } from './modal-desc/modal-desc.component';
import { AppSettings } from 'src/_niframework/config/appSettings';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  //EXEMPLO DE API DA LISTA DE DÚVIDAS
  public api = environment.appSettings.API_ENDPOINT + 'Generico/ListarFAQ';
  // public duvidas: Duvida[] = []; //array das duvidas vindas do back

  //EXEMPLIO DE DUVIDAS
  public duvidas: Duvida[] = [];
  public teste = {
    Id: 1,
    Pergunta: 'SUA PRIMEIRA DÚVIDA',
    Texto: 'TEXTO CONTIDO NO MODAL',
    TipoDuvida: {
      Descricao: 'TIPO DE DUVIDA',
      Id: 1,
    },
    TipoDuvidaId: 1,
    Titulo: 'TITULO DA DUVIDA',
  };

  public search: any[]; //array para a barra de pesquisa

  //tipos de duvidas existentes (temporario)
  public tipos = [
    'TODOS',
    'TÍTULOS',
    'CERTIDÃO',
    'EXAME E CÁLCULO',
    'INTIMAÇÃO',
    'RETIFICAÇÃO',
    'TÍTULO DIGITAL',
    'USUCAPIÃO',
    'OUTRAS',
    'COVID19',
  ];

  constructor(
    private httpClient: HttpClient,
    private loadingCtrl: LoadingController,
    private navCtrl: Router,
    private alertaCtrl: AlertController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getDuvidas();
  }

  //Função para coletar as dúvidas do back
  async getDuvidas() {
    const loading = await this.loadingCtrl.create({
      duration: 8000,
    });

    return new Promise(async (resolve, reject) => {
      this.httpClient.get(this.api).subscribe({
        next: (response) => {
          resolve(true);
          //this.duvidas = response;
          this.duvidas.push(this.teste);
          loading.dismiss();
        },
        error: (err: HttpErrorResponse) => {
          this.alertError();
          resolve(false);
          loading.dismiss();
        },
      });
      loading.present();
    });
  }

  //alerta de erro no back
  async alertError() {
    const alert = await this.alertaCtrl.create({
      header: 'OCORREU UM ERRO',
      message: `Desculpe, houve um erro no carregamento das dúvidas.<br> Por favor tente novamente mais tarde.`,

      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.navigate(['/app']).then(() => {
              window.location.reload();
            });
          },
        },
      ],
    });
    await alert.present();
  }

  //scroll para o topo da página
  pageScroller() {
    this.content.scrollToTop(400);
  }

  //filtra a lista pela pergunta
  async filterPergunta(event) {
    this.search = this.duvidas;
    const searchTerm = event.srcElement.value;

    if (searchTerm) {
      this.search = this.search.filter(
        (item) =>
          item.Pergunta.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      );
    }
  }

  //filtra a lista pelo tipo selecionado
  async filterTipo(event) {
    this.search = this.duvidas;
    let searchTerm = event.srcElement.value;

    //remove o filtro
    if (searchTerm === 'TODOS') {
      searchTerm = null;
    }

    //filtro
    if (searchTerm) {
      this.search = this.search.filter(
        (item) =>
          item.TipoDuvida.Descricao.toLowerCase().indexOf(
            searchTerm.toLowerCase()
          ) > -1
      );
    }
  }

  //chama a modal com detalhes da dúvida
  async goDetalhe(id: number) {
    const modal = await this.modalCtrl.create({
      //modal de confirmação
      component: ModalDescComponent,
      cssClass: 'modal-detalhes',
      componentProps: {
        duvida: this.duvidas.find((item) => item.Id === id),
      },
    });
    await modal.present();
  }

  //tela de cadastro de pergunta
  goCadastro() {
    this.navCtrl.navigate(['/app/duvidas/cadastro']);
  }
}
