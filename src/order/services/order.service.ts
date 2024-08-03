import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { Order } from '../models';
import {DatabaseService} from "../../database/database.service";

@Injectable()
export class OrderService {
  constructor(
      private readonly dbService: DatabaseService
  ) {
  }
    private orders: Record<string, Order> = {}

  async findById(orderId: string): Promise<Order> {
    const result = await this.dbService.query(`SELECT *
                                                   FROM orders
                                                   WHERE id = $1 `,
        [orderId],);
    return result.rows[0]
  }

  create(data: any) {
    const id = v4()
    const order = {
      ...data,
      id,
      status: 'inProgress',
    };

    this.orders[ id ] = order;

    return order;
  }

  update(orderId, data) {
    const order = this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    this.orders[ orderId ] = {
      ...data,
      id: orderId,
    }
  }
}
