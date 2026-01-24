import { Category, EntityType } from "@/src/entity/types";

export interface WordCriteriaDTO {
    category?: Category;
    type?: EntityType;
    offset?: number;
    limit?: number;
    searchPattern?: string;
    orderBy: "ASC" | "DESC";
}

export class WordCriteria {
    category?: Category;
    type?: EntityType;
    offset?: number;
    limit?: number;
    searchPattern?: string;
    orderBy: "ASC" | "DESC" = "DESC";

    appendCategory(category?: Category): this {
        this.category = category;
        return this;
    }

    appendType(type?: EntityType): this {
        this.type = type;
        return this;
    }

    appendIdOffset(offset?: number): this {
        this.offset = offset;
        return this;
    }

    appendLimit(limit?: number): this {
        this.limit = limit;
        return this;
    }

    appendSearchPattern(searchPattern?: string): this {
        if (searchPattern && searchPattern.trim() !== "") {
            this.searchPattern = searchPattern.trim();
            return this;
        }
        this.searchPattern = undefined;
        return this;
    }

    appendOrderBy(orderBy: "ASC" | "DESC"): this {
        this.orderBy = orderBy;
        return this;
    }

    buildCondition(): string {
        let query = `1 = 1`;
        if (this.category) {
            query += ` AND w.category_id = ${this.category.id}`;
        }
        if (this.type) {
            query += ` AND w.type = '${this.type}'`;
        }
        if (this.offset) {
            query += ` AND w.id ${this.orderBy === "ASC" ? ">" : "<"} ${this.offset}`;
        }
        if (this.searchPattern) {
            query += ` AND (w.word_en LIKE '%${this.searchPattern}%' OR w.word_ru LIKE '%${this.searchPattern}%')`;
        }
        query += ` ORDER BY w.id ${this.orderBy}`;
        if (this.limit) {
            query += ` LIMIT ${this.limit}`;
        }
        return query;
    }

    clone(): WordCriteria {
        return new WordCriteria()
            .appendCategory(this.category)
            .appendType(this.type)
            .appendIdOffset(this.offset)
            .appendLimit(this.limit)
            .appendSearchPattern(this.searchPattern)
            .appendOrderBy(this.orderBy);
    }

    toRedux(): WordCriteriaDTO {
        return {
            category: this.category,
            type: this.type,
            offset: this.offset,
            limit: this.limit,
            searchPattern: this.searchPattern,
            orderBy: this.orderBy,
        };
    }

    static fromRedux(dto: WordCriteriaDTO): WordCriteria {
        return new WordCriteria()
            .appendCategory(dto.category)
            .appendType(dto.type)
            .appendIdOffset(dto.offset)
            .appendLimit(dto.limit)
            .appendSearchPattern(dto.searchPattern)
            .appendOrderBy(dto.orderBy);
    }
}