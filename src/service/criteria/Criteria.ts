export interface Criteria {
    buildCondition(): { query: string, params: any[] };
}