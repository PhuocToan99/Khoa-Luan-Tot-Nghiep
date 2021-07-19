import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as _ from 'lodash';
export class ImageData{
  imageURL;
} 
@Component({
  selector: 'app-updateuserimagedialog',
  templateUrl: './updateuserimagedialog.component.html',
  styleUrls: ['./updateuserimagedialog.component.css']
})
export class UpdateuserimagedialogComponent implements OnInit {
  imageURL;
  public isShow:boolean = true;
  imageError: string;
  isImageSaved: boolean = false;
  cardImageBase64: string = "";
  errorImage:boolean = false;
  imageURLString: string = "";
  imageOption;
  constructor(public dialogRef: MatDialogRef<UpdateuserimagedialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageData) { 
        this.isImageSaved = false;
        this.isShow = true;
  }

  ngOnInit(): void {
  }
  getBase64FromUrl = async () => {
    const data = await fetch(this.imageURLString);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = () => {
        const base64data = reader.result;   
        resolve(base64data);
        this.data.imageURL = base64data;
      }
    });
  }
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
                    this.data.imageURL = this.cardImageBase64;
                    console.log(this.data.imageURL);
                }
            };
        };

        reader.readAsDataURL(fileInput.target.files[0]);
    }
    this.isShow = false;
    this.data.imageURL ="";
}
removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
    this.isShow = true;
    this.imageURLString = "";
    this.imageOption = null;
    this.data.imageURL = null;
}
updateUrl() {
    this.errorImage = true;
    this.data.imageURL ="";
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
}
