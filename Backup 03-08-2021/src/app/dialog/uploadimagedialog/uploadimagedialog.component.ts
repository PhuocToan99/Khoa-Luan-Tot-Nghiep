import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ImageUploadDialogData } from '../shared/sharedata';
import * as _ from 'lodash';
@Component({
  selector: 'app-uploadimagedialog',
  templateUrl: './uploadimagedialog.component.html',
  styleUrls: ['./uploadimagedialog.component.css']
})
export class UploadimagedialogComponent implements OnInit {
    public isShow:boolean = true;
  constructor(public dialogRef: MatDialogRef<UploadimagedialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageUploadDialogData) { 
        if(this.data.imageOption != null || this.data.imageOption != undefined){
           this.isImageSaved = true;
           this.isShow = false;
        }
    }

  ngOnInit(): void {
  }
  imageError: string;
  isImageSaved: boolean = false;
  cardImageBase64: string = "";
  errorImage:boolean = false;
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
    this.isShow = false;
    this.data.imageURL ="";
    this.data.imageOption = fileInput.target.files[0];
}
removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
    this.isShow = true;
    this.data.imageURL ="";
    this.data.imageOption = null;
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
