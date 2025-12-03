const PAGE_SIZE = 10;
const GNEWS_BASE_URL = "https://gnews.io/api/v4/top-headlines";
const DEFAULT_LANGUAGE = "en";
const DEFAULT_COUNTRY = "us";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const apiKey =
    process.env.GNEWS_API_KEY ??
    process.env.VITE_GNEWS_API_KEY ??
    process.env.VITE_NEWS_API_KEY;

  if (!apiKey) {
    response.status(500).json({ error: "Missing GNews API key" });
    return;
  }

  const {
    q = "",
    topic = "breaking-news",
    page = "1",
    lang = DEFAULT_LANGUAGE,
    country = DEFAULT_COUNTRY,
    max = PAGE_SIZE.toString(),
  } = request.query ?? {};

  const url = new URL(GNEWS_BASE_URL);
  if (topic) {
    url.searchParams.set("topic", topic);
  }
  url.searchParams.set("lang", lang);
  url.searchParams.set("country", country);
  url.searchParams.set("max", max);
  url.searchParams.set("page", page);
  if (q) {
    url.searchParams.set("q", q);
  }
  url.searchParams.set("apikey", apiKey);

  try {
    const apiResponse = await fetch(url.toString());
    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      response.status(apiResponse.status).json(data);
      return;
    }

    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
