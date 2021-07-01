import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }
  showNotification(message, title, timespan){
    this.toastr.success(message, title,{
      timeOut :  timespan,
      closeButton: true,
      progressBar: true,
      tapToDismiss: true,
    });
  }
  showDeleteNotification(message, title, timespan){
    this.toastr.error(message, title,{
      timeOut :  timespan,
      closeButton: true,
      progressBar: true,
      tapToDismiss: true
    });
  }
  showConnectNotification(message, title, timespan){
    this.toastr.warning(message, title,{
      timeOut :  timespan,
      closeButton: true,
      progressBar: true,
      tapToDismiss: true
    });
  }
}
