import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageloadService {
  constructor() { }
  getImageMime(base64: string): string
  {
    if (base64.charAt(0)=='/') return 'jpg';
    else if (base64.charAt(0)=='R') return "gif";
    else if(base64.charAt(0)=='i') return 'png';
    else return 'jpeg';
  }
  getImageSource(url): string
  {
    return `data:image/${this.getImageMime(url)};base64,${url}`; 
  }
}
