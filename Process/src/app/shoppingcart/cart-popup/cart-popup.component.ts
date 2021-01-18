import {Component, HostBinding, ElementRef} from "@angular/core";
import {CartService} from "../../services/cart.service";
import {CartBaseComponent} from "../cart-base.component";
import {Course} from '../../model/course';
import { AuthenticationService } from '../../services/authentication.service';
import { Account } from  '../../model/Account';
import { UserService } from  '../../services/user.service';
import { User } from '../../model/user';
@Component({
  selector: 'cart-popup',
  templateUrl: './cart-popup.component.html',
  styleUrls: ['./cart-popup.component.css'],
  host: {
    '(document:click)': 'onPageClick($event)',
}
})
export class CartPopupComponent extends CartBaseComponent {
  currentAccount: Account;
  public balance;
  public haveBalance:boolean = false;
  @HostBinding("class.visible") isVisible:boolean = false;

    constructor(
        protected cartService: CartService,
        private eleref: ElementRef,
        private authenticationService: AuthenticationService,
        private userService:UserService
    ) {
        super(cartService);
        this.authenticationService.currentAccount.subscribe(x => this.currentAccount = x);
    }
    async ngOnInit() {
        this.cartService.toggleCartSubject.subscribe(res => {
            this.isVisible = res;
        });
        await this.getuser();
    }
    onPageClick = (event) => {
        if (this.isVisible && !this.eleref.nativeElement.contains(event.target) && event.target.className !== 'cart-remove'){
            this.cartService.toggleCart();
        }
    };
    getImageMime(base64: string): string
    {
      if (base64.charAt(0)=='/') return 'jpg';
      else if (base64.charAt(0)=='R') return "gif";
      else if(base64.charAt(0)=='i') return 'png';
      else return 'jpeg';
    }
    getImageSource(course: Course): string
    {
      return `data:image/${this.getImageMime(course.thumbnailImage)};base64,${course.thumbnailImage}`; 
    }
    public getuser = async () => {
      const user = await this.userService.getuser(this.currentAccount.userId) as User;
      if (user) {
          this.balance = user.balance;
          if(this.currentAccount.role =="instructor"){
            this.haveBalance = true;
          }
      }
    }
}
