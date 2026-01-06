import axios from "axios";

export interface Quote {
  q: string;
  a: string;
  h: string;
}

const errorResponse: Quote = {
  q: "Unable to load",
  a: "Unable to load",
  h: "Unable to load",
};

const QUOTE_URL = "https://zenquotes.io/api";

const api = axios.create({
  baseURL: QUOTE_URL,
  timeout: 5000,
});

// Requests are restricted by IP to 5 per 30 second period by default.
export async function getDailyQuote(): Promise<Quote> {
  return api
    .get<Quote[]>("/today")
    .then((response) => {
      const data = response.data;
      if (data.length > 0) {
        return data[0];
      }
      return errorResponse;
    })
    .catch(() => {
      return errorResponse;
    });
}
