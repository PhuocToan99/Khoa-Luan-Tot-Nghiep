import { Component, OnInit } from '@angular/core';
declare var JitsiMeetExternalAPI: any
@Component({
  selector: 'app-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.css']
})
export class MeetComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const domain = 'meet.jit.si';
    const options = {
    roomName: 'Khoa luan tot nghiep 2021',
    width: 1200,
    height: 700,
    parentNode: document.querySelector('#meet')
     };
    const api = new JitsiMeetExternalAPI(domain, options);
  }

}
