import { ApplicationRef, Component, OnInit, isStandalone } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { register } from 'swiper/element/bundle';
import { UserService } from './_niframework/services/user/user.service';
import { AppSettings } from './_niframework/config/appSettings';
import { interval } from 'rxjs';


register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public userlogged;
  public isLogged: boolean;
  public appversion: string;
  public itensMenu: any[] = [
    {
      id: 'id_1',
      text: 'Opção 1',
      badge: 0,
      icon: 'newspaper-outline',
      rota: 'app',
      params: '',
    },
    {
      id: 'id_2',
      text: 'Opção 2',
      badge: 0,
      icon: 'ribbon-outline',
      rota: 'app',
      params: '',
    },
    {
      id: 'id_3',
      text: 'Opção 3',
      badge: 0,
      icon: 'calculator-outline',
      rota: 'app',
      params: '',
    },
    {
      id: 'faq',
      text: 'Dúvidas Frequentes',
      badge: 0,
      icon: 'help-circle-outline',
      rota: 'app/duvidas',
      params: '',
    },
  ];

  constructor(
    private routeCtrl: Router,
    private update: SwUpdate,
    private appRef: ApplicationRef,
    private userservice: UserService,
    
  ) {

   
  }

  ngOnInit(): void {
    /* INITILIZE */
    this.userlogged = localStorage.getItem('currentUser');
    this.isLogged = localStorage.getItem('currentUser') != null;

    if (this.isLogged) {
      this.userservice
        .getUserProfile(this.userlogged, localStorage.getItem('token'))
        .then((storedUser) => {
          if (storedUser) {
            this.userlogged = storedUser.dsNome.split(' ')[0];
          }
        });
    }

    // Menu header
    if (this.userlogged) {this.userlogged = this.userlogged.split('@')[0];}
    this.appversion = 'V'+ AppSettings.VERSION;
  }

  goProcotolConsult(itemMenu) {
    this.routeCtrl.navigateByUrl(itemMenu.rota + itemMenu.params);
  }

  updateClient() {
    if (!this.update.isEnabled) {
      return;
    }

    this.update.checkForUpdate().then((response) => {
      this.update.activateUpdate().then(() => location.reload());
    })
  }

  checkUpdate() {
    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        const timeInterval = interval(20000);

        timeInterval.subscribe(() => {
          this.update.checkForUpdate().then(() => console.log('Checked!'));
          console.log('Update Checked!');
        })
      }
    })
  }
}
