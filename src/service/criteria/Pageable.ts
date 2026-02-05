import { Criteria } from "./Criteria";
import { Queryable } from "./Queryable";

export class Pageable implements Queryable {
    lastId?: number;
    limit?: number;
    direction: "asc" | "desc" = "asc";
    tableAlias?: string;
    criteria?: Criteria;

    setTableAlias(tableAlias?: string): Pageable {
        this.tableAlias = tableAlias;
        return this;
    }

    setLastId(lastId?: number): Pageable {
        this.lastId = lastId;
        return this;
    }

    setDirection(direction: "asc" | "desc"): Pageable {
        this.direction = direction;
        return this;
    }

    setLimit(limit?: number): Pageable {
        this.limit = limit;
        return this;
    }

    addCriteria(criteria?: Criteria): Pageable {
        this.criteria = criteria;
        return this;
    }

    buildQuery(): { query: string, params: any[] } {
        let { query, params } = this.criteria?.buildQuery() ?? { query: "1 = 1", params: [] as any[] };
        const idColumn = this.tableAlias ? `${this.tableAlias}.id` : "id";
        if (this.direction === "asc") {
            if (this.lastId) {
                query += ` AND ${idColumn} > ?`;
                params.push(this.lastId);
            }
            query += ` ORDER BY ${idColumn} ASC`;
        }
        if (this.direction === "desc") {
            if (this.lastId) {
                query += ` AND ${idColumn} < ?`;
                params.push(this.lastId);
            }
            query += ` ORDER BY ${idColumn} DESC`;
        }
        if (this.limit) {
            query += ` LIMIT ?`;
            params.push(this.limit);
        }
        return { query, params };
    }

    clone(): Pageable {
        return new Pageable()
            .setLimit(this.limit)
            .setLastId(this.lastId)
            .setTableAlias(this.tableAlias)
            .setDirection(this.direction);
    }
}