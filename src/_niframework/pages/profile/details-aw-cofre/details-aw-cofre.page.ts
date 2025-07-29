import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UserProfileModel } from 'src/_niframework/models/user.model';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { SharedService } from 'src/_niframework/services/shared/shared.service';
import { UserService } from 'src/_niframework/services/user/user.service';

@Component({
  selector: 'app-details-aw-cofre',
  templateUrl: './details-aw-cofre.page.html',
  styleUrls: ['./details-aw-cofre.page.scss'],
})
export class DetailsAwCofrePage implements OnInit {
  updateDataUser: Subscription;
  userCode: string;
  token: string;
  userData: any;
  firstLetter: string;
  firstName: string;
  dataArrived: boolean = false;
  currentUser: any;
  isLogged: boolean;

  constructor(
    private navCtrl: Router,
    private alerts: AlertsProvider,
    private userService: UserService,
    private sharedService: SharedService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.userCode = localStorage.getItem('userCode')!;
    this.token = localStorage.getItem('token')!;

    this.currentUser = localStorage.getItem('currentUser');
    this.isLogged = localStorage.getItem('currentUser') != null;

    this.updateDataUser = this.sharedService
      .getRequestUpdateUserFilter()
      .subscribe(() => {
        if (this.isLogged) {
          this.getUserData();
        }
      });

    setTimeout(() => {
      this.sharedService.sendUpdateUserFilter();
    }, 500);
  }

  getUserData() {
    this.userService
      .getUserProfile(this.userCode, this.token)
      .then((response) => {
        if (response) {
          this.userData = response;

          this.firstLetter = this.userData.nome.charAt(0);
          this.firstName = this.userData.nome.split(' ')[0];
          this.dataArrived = true;
        } else {
          console.log(response);
          this.alerts.showAlert(
            'Ops! Algo deu errado.',
            'Lamentamos, mas ocorreu algum erro inesperado.'
          );
          this.goExit();
        }
      }).catch((err: HttpErrorResponse) => {
        if (err.error.responseString != null && err.error.responseString != undefined) {
          this.alerts.showAlert('Atenção!', err.error.responseString);
        } else {
          this.alerts.showAlert("Atenção!", "Falha ao recuperar os dados!");
        }

        this.goExit();
      });
  }

  goExit() {
    this.updateDataUser.unsubscribe();
    localStorage.clear();
    this.navCtrl.navigate(['/'], { replaceUrl: true});
  }
}
