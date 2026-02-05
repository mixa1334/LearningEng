export interface Queryable {
    buildQuery(): { query: string, params: any[] };
}