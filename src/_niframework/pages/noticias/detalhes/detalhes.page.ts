import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { NoticiasComponent } from '../noticias/noticias.component';
// import { NoticiasPage } from '../noticias/noticias.page';
import { NoticiasComponent } from '../noticias/noticias.component';
// import { NoticiasComponent } from '../noticias/noticias.component';


@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
})
export class DetalhesPage implements OnInit {

  public data:any = [];
  public noticiaId: string
  public detalhe: any = [];

  constructor(
    private inputRoute: ActivatedRoute,
    private noticiaComponent: NoticiasComponent
  ) { }

  ngOnInit() {
    this.getDetalhes();
   }

  async getDetalhes(){
    // this.noticiaId = this.inputRoute.snapshot.params.id;
    // if(await this.noticiaComponent.getNoticias() === true){
    //   this.data = this.noticiaComponent.data;
    //   this.data.forEach(noticia =>{
    //     if(noticia.NoticiaId.toString() === this.noticiaId){
    //       this.detalhe.push(noticia);
    //       console.log('Noticia encontrada');
    //     }
    //   });
    // }

  }

}
