import { Language } from "@/src/entity/types";
import { Criteria } from "../Criteria";

export class TranslationCriteria implements Criteria {
    searchPattern?: string;
    textLanguage?: Language;
    datetimeFrom?: string;

    appendSearchPattern(searchPattern?: string): this {
        if (searchPattern && searchPattern.trim() !== "") {
            this.searchPattern = searchPattern.trim();
            return this;
        }
        this.searchPattern = undefined;
        return this;
    }

    appendTextLanguage(textLanguage?: Language): this {
        this.textLanguage = textLanguage;
        return this;
    }

    appendDatetimeFrom(datetimeFrom?: string): this {
        this.datetimeFrom = datetimeFrom;
        return this;
    }

    buildQuery(): { query: string, params: any[] } {
        let { query, params } = { query: "1 = 1", params: [] as any[] };
        if (this.searchPattern) {
            query += ` AND text LIKE ?`;
            const searchPattern = `%${this.searchPattern}%`;
            params.push(searchPattern);
        }
        if (this.textLanguage) {
            query += ` AND text_language = ?`;
            params.push(this.textLanguage);
        }
        if (this.datetimeFrom) {
            query += ` AND translation_date >= ?`;
            params.push(this.datetimeFrom);
        }
        return { query, params };
    }

    clone(): TranslationCriteria {
        return new TranslationCriteria()
            .appendSearchPattern(this.searchPattern)
            .appendTextLanguage(this.textLanguage)
            .appendDatetimeFrom(this.datetimeFrom);
    }
}