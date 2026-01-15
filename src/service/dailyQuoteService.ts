import axios from "axios";

export interface Quote {
  q: string;
  a: string;
  h: string;
}

const QUOTE_URL = "https://zenquotes.io/api";

const api = axios.create({
  baseURL: QUOTE_URL,
  timeout: 5000,
});

// Requests are restricted by IP: 5 requests per 30 second period by default.
export async function getDailyQuote(): Promise<Quote> {
  return api
    .get<Quote[]>("/today")
    .then((response) => {
      const data = response.data;
      if (data.length > 0) {
        return data[0];
      }
      const msg = "No quote found";
      console.error(msg);
      throw new Error(msg);
    })
    .catch(() => {
      const msg = "Unable to load quote";
      console.error(msg);
      throw new Error(msg);
    });
}
