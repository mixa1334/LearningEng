import { Criteria } from "./Criteria";

export type PageableDTO = {
    lastId?: number;
    limit: number;
    direction: "asc" | "desc";
    tableAlias?: string;
};

export class Pageable {
    lastId?: number;
    limit: number;
    direction: "asc" | "desc";
    tableAlias?: string;

    constructor(limit: number) {
        this.limit = limit;
        this.direction = "asc";
    }

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

    buildQuery(criteria?: Criteria): { query: string, params: any[] } {
        let { query, params } = criteria?.buildCondition() ?? { query: "1 = 1", params: [] as any[] };
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

    toRedux(): PageableDTO {
        return {
            lastId: this.lastId,
            tableAlias: this.tableAlias,
            limit: this.limit,
            direction: this.direction,
        };
    }

    clone(): Pageable {
        return new Pageable(this.limit)
            .setLastId(this.lastId)
            .setTableAlias(this.tableAlias)
            .setDirection(this.direction);
    }

    static fromRedux(dto: PageableDTO): Pageable {
        const pageable = new Pageable(dto.limit);
        pageable.setLastId(dto.lastId);
        pageable.setTableAlias(dto.tableAlias);
        pageable.setDirection(dto.direction);
        return pageable;
    }
}