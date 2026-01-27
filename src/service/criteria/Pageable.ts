import { Criteria } from "./Criteria";

export type PageableDTO = {
    lastId?: number;
    firstId?: number;
    limit: number;
    direction: "asc" | "desc";
};

export class Pageable {
    lastId?: number;
    firstId?: number;
    limit: number;
    direction: "asc" | "desc";

    constructor(limit: number) {
        this.limit = limit;
        this.direction = "asc";
    }

    setLastId(lastId?: number): Pageable {
        this.lastId = lastId;
        return this;
    }

    setFirstId(firstId?: number): Pageable {
        this.firstId = firstId;
        return this;
    }

    setDirection(direction: "asc" | "desc"): Pageable {
        this.direction = direction;
        return this;
    }

    buildQuery(criteria?: Criteria): { query: string, params: any[] } {
        let { query, params } = criteria?.buildCondition() ?? { query: "1 = 1", params: [] as any[] };
        if (this.direction === "asc") {
            if (this.lastId) {
                query += `AND id > ?`;
                params.push(this.lastId);
            }
            query += ` ORDER BY id ASC`;
        }
        if (this.direction === "desc") {
            if (this.firstId) {
                query += ` AND id < ?`;
                params.push(this.firstId);
            }
            query += ` ORDER BY id DESC`;
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
            firstId: this.firstId,
            limit: this.limit,
            direction: this.direction,
        };
    }

    clone(): Pageable {
        return new Pageable(this.limit)
            .setLastId(this.lastId)
            .setFirstId(this.firstId)
            .setDirection(this.direction);
    }

    static fromRedux(dto: PageableDTO): Pageable {
        const pageable = new Pageable(dto.limit);
        pageable.setLastId(dto.lastId);
        pageable.setFirstId(dto.firstId);
        pageable.setDirection(dto.direction);
        return pageable;
    }
}