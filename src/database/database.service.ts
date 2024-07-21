import {Inject, Injectable} from "@nestjs/common";
import {Pool} from 'pg'

@Injectable()
export class DatabaseService{
    constructor(@Inject('POSTGRES') private readonly pool: Pool) {}

    async query(queryText: string, params?: any[]) {
        const client = await this.pool.connect()
        try {
            return await client.query(queryText, params)
        } finally {
            client.release()
        }
    }

    async startTransaction() {
        console.log("start transaction")
        const client = await this.pool.connect()
        await client.query('BEGIN')
        return client
    }

    async commit(client) {
        console.log("commit")
        await client.query('COMMIT')
    }

    async rollback(client) {
        console.log("rollback")
        await client.query('ROLLBACK')
    }

    async transaction(queries: QueryItem[]) {
        console.log('Before start transaction, queryItems:', queries)
        const client = await this.pool.connect()
        try {
            await client.query('BEGIN')
            const results = []
            for (const { query, params } of queries) {
                const res = await client.query(query, params)
                results.push(res)
            }
            await client.query('COMMIT')
            return results
        } catch (error) {
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
    }
}

export type QueryItem = { query: string, params?: any[]}