export const CATEGORIES_TABLE = "categories";

export const COUNT_CATEGORIES = `SELECT COUNT(*) as count FROM categories;`;

export const INSERT_INTO_CATEGORIES = `
    INSERT INTO categories
    (name, type, icon)
    VALUES (?, ?, ?);
`;
