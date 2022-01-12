import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { Order, OrderPosition } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService],
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef!: ElementRef

  isRoot!: boolean;
  modal!: MaterialInstance;
  pending = false;
  oSub!: Subscription;

  constructor(private router: Router,
              public order: OrderService,
              private ordersService: OrdersService) { }

  ngOnInit() {
    this.isRoot = this.router.url === '/order';
    this.oSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd)
      this.isRoot = this.router.url === '/order';
    })
  };

  ngOnDestroy() {
    this.modal.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  };

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  };

  openModal() {
    this.modal.open();
  };

  closeModal() {
    this.modal.close();
  };

  submit() {
    this.pending = true;

    const order: Order = {
      list: this.order.list.map(item => {
        delete item._id;
        return item;
      }),
    }
    this.oSub = this.ordersService.create(order).subscribe({
      next: newOrder => {
        MaterialService.toast(`Order #${newOrder.order} has been added`);
        this.order.clear();
      },
      error: error => MaterialService.toast(error.message),
      complete: () => {
        this.modal.close();
        this.pending = false;
      },
    });
  };

  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition);
  };
}
