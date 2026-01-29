
export const wrapThunk = async <T>(
    producer: () => Promise<T>,
    thunkAPI: any,
    customErrorMsg?: string
): Promise<T> => {
    try {
        return await producer();
    } catch (error: any) {
        // Centralized error mapping logic
        const message = customErrorMsg || error?.message || "Operation failed";
        return thunkAPI.rejectWithValue(message);
    }
};