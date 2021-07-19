import { Component } from '@angular/core';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from './services/notification.service';
import { CartService } from './services/cart.service';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Courses';
  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }
  constructor(private notificationService:NotificationService,private cartService: CartService) {
    this.createOnline$().subscribe(isOnline => 
      {
        if(!isOnline){
          this.notificationService.showConnectNotification("No Internet connection found,check your connection","No Internet",3000);
        }
      });
      this.cartService.loadCart();
  }
}
