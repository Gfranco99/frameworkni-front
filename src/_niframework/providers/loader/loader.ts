import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})
export class Loader {
    loading: any;

    constructor(
        public loadingController: LoadingController
    ) {}

    // inicializa o loader
    async present(msg?: string, seconds?: number) {
        this.loading = await this.loadingController.create({
            message: msg,
            duration: seconds != undefined ? seconds * 1000 : 0
        });

        await this.loading.present();
    }

    // finaliza o loader
    async dismiss() {
        await this.loading.dismiss();
    }
}