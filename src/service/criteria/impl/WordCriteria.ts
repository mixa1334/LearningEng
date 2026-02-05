import { Category, EntityType } from "@/src/entity/types";
import { Criteria } from "../Criteria";

export class WordCriteria implements Criteria {
    category?: Category;
    type?: EntityType;
    searchPattern?: string;
    isLearned?: boolean;

    appendCategory(category?: Category): this {
        this.category = category;
        return this;
    }

    appendType(type?: EntityType): this {
        this.type = type;
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

    appendIsLearned(isLearned?: boolean): this {
        this.isLearned = isLearned;
        return this;
    }

    buildQuery(): { query: string, params: any[] } {
        let { query, params } = { query: "1 = 1", params: [] as any[] };
        if (this.category) {
            query += ` AND w.category_id = ?`;
            params.push(this.category.id);
        }
        if (this.type) {
            query += ` AND w.type = '${this.type}'`;
        }
        if (this.searchPattern) {
            query += ` AND (w.word_en LIKE ? OR w.word_ru LIKE ?)`;
            const searchPattern = `%${this.searchPattern}%`;
            params.push(searchPattern, searchPattern);
        }
        if (this.isLearned) {
            query += ` AND w.learned = ?`;
            params.push(this.isLearned ? 1 : 0);
        }
        return { query, params };
    }

    clone(): WordCriteria {
        return new WordCriteria()
            .appendCategory(this.category)
            .appendType(this.type)
            .appendSearchPattern(this.searchPattern)
            .appendIsLearned(this.isLearned);
    }
}