import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Countries } from 'src/_niframework/models/county-model';
import { countries } from '../countries.service';

@Component({
  selector: 'app-lista-paises',
  templateUrl: './lista-paises.component.html',
  styleUrls: ['./lista-paises.component.scss'],
})
export class ListaPaisesComponent implements OnInit {

   
  public countries:any = countries

  constructor(
    private popCtrl: PopoverController
  ) { }

  ngOnInit() {
  }
  
  seleciona(selected: Countries){
    this.popCtrl.dismiss(selected);
  }

}
