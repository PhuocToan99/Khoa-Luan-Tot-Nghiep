import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
//import { Course } from '../../model/course';
import { HttpClient } from '@angular/common/http';
import { Course } from '../../addcoursedetail/shared/DialogData';
import {FormControl, Validators} from '@angular/forms';
@Component({
  selector: 'app-coursedialog',
  templateUrl: './coursedialog.component.html',
  styleUrls: ['./coursedialog.component.css']
})
export class CoursedialogComponent implements OnInit {
  hastagFormControl = new FormControl('', Validators.required);
  levelFormControl = new FormControl('', Validators.required);
  coursehastags = ['C - C# - C++', 'Java Basic','Java Advanced','Python - C','IOS - Android','AI - VR - IOT','Javascript','Gear - Hardware','UX - UI - Designer','Photoshop','SEO Service','Frontend','Framework'];
  courselevels = ['Basic', 'Tutorial','Advance','Deep Learning','Guide'];
  constructor( public dialogRef: MatDialogRef<CoursedialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Course, private httpClient: HttpClient) { }

  ngOnInit(): void {
    if (JSON.stringify(this.data.thumbnailImage) != '""' && this.data.thumbnailImage != null)
    {
      var base64 = JSON.stringify(this.data.thumbnailImage).substr(1, JSON.stringify(this.data.thumbnailImage).length - 2);
      var blob: any = this.base64ToBlob(base64, "image/" + this.getImageMime(base64));
      blob.lastModifiedDate = new Date();
      blob.name = this.data.accountId + "/" + this.getImageMime(base64);
      this.data.thumbnailImage =  <File>blob;
    }
  }
  handleFileInput(files: FileList) {
    console.log(files.item(0));
    if (files.item(0))
      this.data.thumbnailImage = files.item(0);  //Lấy file uplload hình gán vào biến
  }
  base64ToBlob(base64: string, type: string) 
  {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; ++i) {
      bytes[i] = binaryString.charCodeAt(i);
    } 
    return new Blob([bytes], { type: type });
  };
  getImageMime(base64: string): string
  {
    if (base64.charAt(0)=='/') return 'jpg';
    else if (base64.charAt(0)=='R') return "gif";
    else if(base64.charAt(0)=='i') return 'png';
    else return 'image/jpeg';
  }

}
