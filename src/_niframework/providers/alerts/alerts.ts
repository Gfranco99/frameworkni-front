import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular'; // Importe LoadingController

@Injectable({
    providedIn: 'root'
})
export class AlertsProvider {

    private currentLoading: HTMLIonLoadingElement | null = null; // Para controlar a instância do loading

    constructor(
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        private loadingCtrl: LoadingController // Injete o LoadingController aqui
    ) { }

    public async showAlert(pTitle: string, pMessage: string) {
        const alert = await this.alertCtrl.create({
            header: pTitle,
            message: pMessage,
            buttons: ['OK'],
            cssClass: 'custom-alert-class',
        });

        await alert.present();
    }

    public async showAlertWithComplement(pMessage: string, pComplement: string) {
        const alert = await this.alertCtrl.create({
            message: pMessage + " " + pComplement,
            buttons: ['OK']
        });

        await alert.present();
    }

    public async showToaster(pMessage, color?) {
        const toast = await this.toastCtrl.create({
            message: pMessage,
            duration: 3000,
            position: 'top',
            cssClass: 'custom-toast-class',
            color: color != null ? color : "primary"
        });

        toast.present();
    }

    public async showAlertRadio(title: string, message: string, options: any[], callback: any){
        const alert = await this.alertCtrl.create({
            header: title,
            message: message,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        let str = data;
                        callback(str);
                    },
                    role: ''
                }
            ],
            inputs: options
        });

        await alert.present();
    }

    public async showConfirmationAlert(title: string, message: string, confirmMessage?: string, cancelMessage?: string) {
        return new Promise(async (resolve) => {
            const alert = await this.alertCtrl.create({
                header: title,
                message: message,
                buttons: [
                    {
                        text: cancelMessage != null ? cancelMessage : 'Cancelar',
                        role: 'cancel',
                        handler: () => {
                            resolve(false);
                        },
                    },
                    {
                        text: confirmMessage != null ? confirmMessage : 'Confirmar',
                        role: 'confirm',
                        handler: () => {
                            resolve(true);
                        },
                    },
                ],
                cssClass: 'custom-alert-class',
            });

            await alert.present();
        });
    }

    // NOVOS MÉTODOS: showLoading e dismissLoading
    public async showLoading(message: string = 'Aguarde...') {
        // Se já houver um loading visível, descarta-o antes de criar um novo
        if (this.currentLoading) {
            await this.currentLoading.dismiss();
            this.currentLoading = null;
        }
        this.currentLoading = await this.loadingCtrl.create({
            message: message,
            spinner: 'crescent' // Você pode escolher outro spinner: 'dots', 'lines', 'circles'
        });
        await this.currentLoading.present();
    }

    public async dismissLoading() {
        if (this.currentLoading) {
            await this.currentLoading.dismiss();
            this.currentLoading = null;
        }
    }
}