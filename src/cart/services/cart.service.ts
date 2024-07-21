import {Injectable} from '@nestjs/common';
import {v4} from 'uuid';
import {Cart, CartItem, CartStatuses} from '../models';
import {DatabaseService, QueryItem} from "../../database/database.service";

@Injectable()
export class CartService {
    constructor(
        private readonly dbService: DatabaseService
    ) {
    }

    async findByUserId(userId: string): Promise<Cart> {
        const result = await this.dbService.query(`SELECT *
                                                   FROM carts
                                                   WHERE user_id = $1
                                                     and status = 'OPEN'
                                                   limit 1`,
            [userId],)
        if (result.rowCount === 0) return null
        return {
            ...result.rows[0],
            items: await this.getCartItems(result.rows[0].id)
        }
    }

    async createByUserId(userId: string) {
        const id = v4();
        const currentDate = new Date().toISOString();
        const userCart = {
            id,
            user_id: userId,
            created_at: currentDate,
            updated_at: currentDate,
            status: CartStatuses.OPEN,
            items: [],
        }
        await this.dbService.query(`INSERT INTO carts (id, user_id, created_at, updated_at, status)
                                    VALUES ($1, $2, $3, $4, $5)`,
            [
                userCart.id,
                userCart.user_id,
                userCart.created_at,
                userCart.updated_at,
                userCart.status,
            ],
        )
        return userCart
    }

    async findOrCreateByUserId(userId: string): Promise<Cart> {
        const userCart = await this.findByUserId(userId);

        if (userCart) {
            return userCart;
        }

        return await this.createByUserId(userId);
    }

    async updateByUserId(userId: string, {items}: Cart): Promise<Cart> {
        const {id, ...rest} = await this.findOrCreateByUserId(userId);

        const updatedCart = {
            id,
            ...rest,
            items: [...items],
        }

        const queryItems: QueryItem[] = []
        queryItems.push({
            query: `update carts
                    set updated_at = $1
                    WHERE user_id = $2
                      and status = 'OPEN'`,
            params: [new Date().toISOString(), userId],
        })
        updatedCart.items.forEach((item) => {
            queryItems.push({
                query: `insert into cart_items (cart_id, product_id, count)
                        values ($1, $2, $3)`,
                params: [id, item.product.id, item.count],
            })
        })
        await this.dbService.transaction(queryItems)
        return {...updatedCart};
    }

    async removeByUserId(userId) {
        await this.dbService.query(`update carts
                                    set status = 'ORDERED'
                                    WHERE user_id = $1
                                      and status = 'OPEN'`,
            [userId],)
    }

    async getCartItems(cartId: string): Promise<CartItem[]> {
        const  result = await this.dbService.query(`SELECT * FROM cart_items WHERE cart_id = $1`,
            [cartId],
            )
        return result.rows
    }

}
