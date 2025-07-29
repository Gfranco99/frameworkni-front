import { Injectable, inject } from '@angular/core';
import { UserService } from '../user/user.service';
import { Auth, authState } from '@angular/fire/auth';
import { Database, object, ref, update } from '@angular/fire/database';
import { Messaging } from '@angular/fire/messaging';
import { getToken } from '@angular/fire/messaging';
// import { requesttoken}
// import { to}
// import { }
// import { requestPermiss}
// import { }
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  // private database: Database = inject(Database);

  constructor(
    private userService: UserService,
    private angularFireDB: Database,
    private angularFireAuth: Auth,
    private angularFireMessaging: Messaging,
    // private dbInstances: DatabaseInstances

  ) { }

  /**
   * update token in firebase database
   *
   * @param userId userId as a key
   * @param token token as a value
   */
  updateToken(userId, token) {

    // we can change this function to request our backend service
    authState(this.angularFireAuth).pipe(take(1)).subscribe(
      () => {
        const data = {};
        data["userid"] = userId;
        data["token"] = token;

        if (localStorage.getItem("token")) {
          this.userService.updateMessagingToken(userId, token, localStorage.getItem("token"));
        }

        update(ref(this.angularFireDB), data);
      }
    )
  }

  /**
   * request permission for notification from firebase cloud messaging
   *
   * @param userId userId
   */
  // requestPermission(userId) {
  //   this.angularFireMessaging.requestToken.subscribe(
  //     (token) => {
  //       this.updateToken(userId, token);
  //     },
  //     (err) => {
  //       console.error('Unable to get permission to notify.', err);
  //     }
  //   );
  // }
  requestPermission(userId) {
    // this.angularFireMessaging.app.options.requ
    // this.angularFireMessaging.
    // request
    getToken(this.angularFireMessaging).then((response) => {
      this.updateToken(userId, response);
    })
  }
}
