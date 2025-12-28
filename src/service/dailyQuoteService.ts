import axios from "axios";

export interface Quote {
  q: string;
  a: string;
  h: string;
}

// Requests are restricted by IP to 5 per 30 second period by default.
export async function getDailyQuote(): Promise<Quote> {
  return axios
    .get<Quote[]>("https://zenquotes.io/api/today", { timeout: 5000 })
    .then((response) => {
      const data = response.data;
      if (data.length > 0) {
        return data[0];
      }
      return { q: "Unable to load", a: "Unable to load", h: "Unable to load" };
    })
    .catch((error) => {
      console.error(error);
      return {
        q: "Some quote is missing",
        a: "Some author is missing",
        h: "Some quote is missing",
      };
    });
}
