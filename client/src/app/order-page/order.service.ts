import { Injectable } from "@angular/core";
import { OrderPosition, Position } from "../shared/interfaces";

@Injectable()
export class OrderService {

  public list: OrderPosition[] = [];
  public totalPrice = 0;

  add(position: Position){
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id,
    });
    const candidate: any = this.list.find(item => item._id === orderPosition._id);
    if (candidate) {
      candidate.quantity += orderPosition.quantity;
    } else {
      this.list.push(orderPosition);
    }

    this.computeTotal();
  };

  remove(orderPosition: OrderPosition) {
    const index = this.list.findIndex(item => item._id === orderPosition._id);
    this.list.splice(index, 1);
    this.computeTotal();
  };

  clear() {

  };

  private computeTotal() {
    this.totalPrice = this.list.reduce((total, item: any) => {
      return total += item.quantity * item.cost;
    }, 0)
  };
}
