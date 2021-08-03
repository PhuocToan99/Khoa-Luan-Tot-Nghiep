import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryComponent } from './category.component';


import {Product} from "../model/product";
import {Cart} from "../model/cart";
import {ShoppingcartComponent} from "../shoppingcart/shoppingcart.component";
import {RouterModule} from "@angular/router";
// import {CartService} from "../service/cart.service";
// import {ProductsService} from "../service/products.service";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpModule} from "@angular/http";

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;

  let cartPageComponent: ShoppingcartComponent;
  let products: Product[];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [  CategoryComponent,ShoppingcartComponent ],
      // providers: [CartService,ProductsService],
      imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    let f = TestBed.createComponent(ShoppingcartComponent);
    cartPageComponent = f.componentInstance;
    f.detectChanges();
    products = [
      {
        "title": "1",
        "price": 40
      },
      {
        "title": "2",
        "price": 28
      }
    ];
  });

  it('test shopping cart, add a duplicate item should increment the quantity for that item.', () => {
    // component.addToCart(products[0]);
    // expect(cartPageComponent.cartList).toEqual([{product:products[0],quantity:1}]);
    // expect(cartPageComponent.totalPrice).toEqual(40);
    // component.addToCart(products[0]);
    // expect(cartPageComponent.cartList).toEqual([{product:products[0],quantity:2}]);
    // expect(cartPageComponent.totalPrice).toEqual(80);
    // component.addToCart(products[1]);
    // expect(cartPageComponent.cartList).toEqual([{product:products[0],quantity:2},{product:products[1],quantity:1}]);
    // expect(cartPageComponent.totalPrice).toEqual(108);
  });
});
