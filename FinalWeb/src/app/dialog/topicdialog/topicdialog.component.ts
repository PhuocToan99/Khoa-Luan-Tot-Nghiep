import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TopicDialogData } from '../shared/sharedata';
import { HttpClient } from '@angular/common/http';
import {TopicService}  from '../../services/topic.service';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-topicdialog',
  templateUrl: './topicdialog.component.html',
  styleUrls: ['./topicdialog.component.css']
})
export class TopicdialogComponent implements OnInit {
  mess: string;
  constructor(public dialogRef: MatDialogRef<TopicdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TopicDialogData, private httpClient: HttpClient,private topicService:TopicService,private notificationService:NotificationService) { 
      console.log(data);
      console.log(data.topicTitle);
      if(data.topicTitle == ""){
        this.mess = "Add Topic Detail";
      }
      else{
        this.mess = "Edit Topic Infomation";
      }
    }

  ngOnInit(): void {
  }
  async checkCheckBoxvalue(event,topic: TopicDialogData){
    //console.log(event.target.checked+" "+account);
    if(event.target.checked == false){
      await this.unBlockTopic(topic); 
    }
    if(event.target.checked == true){
        await this.blockTopic(topic);
    }
  }
  async blockTopic(topic: TopicDialogData) {
      if(topic.topicId != undefined){
        topic.isLocked = true;
        await this.topicService.updatetopic(topic.topicId, topic);
      }
      else{
        this.data.isLocked = true;
      }
      this.notificationService.showDeleteNotification("This topic have been block","Block topic",3000);
  }
  async unBlockTopic(topic: TopicDialogData) {
      if(topic.topicId != undefined){
        topic.isLocked = false;
        await this.topicService.updatetopic(topic.topicId,topic);
      }
      else{
        this.data.isLocked = false;
      }
      this.notificationService.showNotification("This topic have been unblock","Unlock topic",3000);
  }
}
