export const CATEGORIES_TABLE = "categories";

export const COUNT_CATEGORIES = `SELECT COUNT(*) as count FROM categories;`;

export const INSERT_INTO_CATEGORIES = `
    INSERT INTO categories
    (name, type, icon)
    VALUES (?, ?, ?);
`;

export const SELECT_CATEGORIES = `
    SELECT id, name, type, icon
    FROM categories
`;

export const DELETE_CATEGORY = `
    DELETE
    FROM categories
`;

export const UPDATE_CATEGORY = `
    UPDATE categories
    SET name = ?, icon = ?
`;
