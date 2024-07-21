import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { User } from '../models';
import {DatabaseService} from "../../database/database.service";

@Injectable()
export class UsersService {
  constructor(
      private readonly dbService: DatabaseService
  ) {
  }

  async findOne(userId: string): Promise<User> {
    const result = await this.dbService.query('SELECT * FROM users WHERE id = $1',
        [userId],);
    return result.rows[0];
  }

  async createOne({ name, password }: User): Promise<User> {
    const id = v4();
    const newUser = { id: name || id, name, password };

    await this.dbService.query('INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)',
        [newUser.id,
        newUser.name,
        'email',
        newUser.password])

    return newUser;
  }

}
