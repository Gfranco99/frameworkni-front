import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InstallappModalPage } from './installapp-modal/installapp-modal.page';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  deferredPrompt;

  constructor(public modalCtrl: ModalController) {}

  ngOnInit() {
    localStorage.removeItem('doc');
  }

  //Intercepta o banner de instalação da aplicação
  ionViewWillEnter() {
    console.log("entrei no will enter");
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt Event fired');
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
      this.showInstallBannerModal();
    });
  }

  //Exibe ao usuário o banner de instalação
  showInstallBanner() {
    console.log('Usuário pediu pra instalar');
    if (this.deferredPrompt !== undefined && this.deferredPrompt !== null) {
      console.log('deferredPrompt encontrado');
      // Show the prompt
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        // We no longer need the prompt.  Clear it up.
        this.deferredPrompt = null;
      });
    }
  }

  async showInstallBannerModal() {
    const modal = await this.modalCtrl.create({
      component: InstallappModalPage,
    });

    //Event handler on dismiss the modal
    modal.onDidDismiss().then((data) => {
      const modalMsg = data['data'];
      if (modalMsg.install == 'true') {
        if (this.deferredPrompt !== undefined && this.deferredPrompt !== null) {
          console.log('deferredPrompt encontrado');
          // Show the prompt
          this.deferredPrompt.prompt();
          // Wait for the user to respond to the prompt
          this.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the A2HS prompt');
            } else {
              console.log('User dismissed the A2HS prompt');
            }
            // We no longer need the prompt.  Clear it up.
            this.deferredPrompt = null;
          });
        }
      }
    });
    //show the modal
    return await modal.present();
  }
}
