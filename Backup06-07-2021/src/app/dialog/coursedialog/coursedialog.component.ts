import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CourseDialogData } from '../shared/sharedata';
import {FormControl, Validators} from '@angular/forms';
import { ImageloadService } from '../../services/imageload.service';
import * as _ from 'lodash';
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
  isImageSaved:boolean;
  constructor( public dialogRef: MatDialogRef<CoursedialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CourseDialogData,private imageLoadService:ImageloadService) {
      this.isImageSaved = (data.thumbnailImage) ? true : false;
      this.cardImageBase64 = (data.thumbnailImage) ? this.loadimage(data.thumbnailImage) : null;
    }
  ngOnInit(): void {
  }
  cardImageBase64: string = "";
  errorImage:boolean = false;
  imageError: string;
  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        const max_size = 20971520;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 15200;
        const max_width = 25600;

        if (fileInput.target.files[0].size > max_size) {
            this.imageError =
                'Maximum size allowed is ' + max_size / 1000 + 'Mb';

            return false;
        }

        if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
            this.imageError = 'Only Images are allowed ( JPG | PNG )';
            return false;
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
                const img_height = rs.currentTarget['height'];
                const img_width = rs.currentTarget['width'];

                console.log(img_height, img_width);


                if (img_height > max_height && img_width > max_width) {
                    this.imageError =
                        'Maximum dimentions allowed ' +
                        max_height +
                        '*' +
                        max_width +
                        'px';
                    return false;
                } else {
                    const imgBase64Path = e.target.result;
                    this.cardImageBase64 = imgBase64Path;
                    this.isImageSaved = true;
                    // this.previewImagePath = imgBase64Path;
                }
            };
        };

        reader.readAsDataURL(fileInput.target.files[0]);
    }
    this.data.thumbnailImage = fileInput.target.files[0];
}
image:any;
async loadFileImage(file : any){
      this.image = await this.toBase64(file);
      return this.image;
  }
  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
  public loadimage(url){
    return this.imageLoadService.getImageSource(url);
  }
}
