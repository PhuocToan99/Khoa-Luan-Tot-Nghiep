import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {ShoppingcartComponent} from "./shoppingcart.component";
import {cartPageRoutes} from "./shoppingcart.routes";
import {QuantityControlComponent} from "./quantity-control/quantity-control.component";

@NgModule({
  declarations: [ShoppingcartComponent,QuantityControlComponent],
  imports: [
    QuantityControlComponent,
    CommonModule,
    RouterModule.forChild(cartPageRoutes)
  ]
})
export class ShoppingcartModule { }
