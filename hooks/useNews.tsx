import { useState, useEffect } from "react";

interface NewsItem {
  urlToImage: string;
  title: string;
  description: string;
}

const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("general");
  const [source, setSource] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const baseUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=599b400f84f74625841e05ddc3fd06ff`;
      const categoryQuery = category ? `&category=${category}` : "";
      const sourceQuery = source ? `&sources=${source}` : `&page=${page}`;

      console.log(
        "Fetching news with URL:",
        baseUrl + categoryQuery + sourceQuery
      ); // Log the request URL

      const response = await fetch(baseUrl + categoryQuery + sourceQuery);
      const data = await response.json();
      setNews((prevNews) =>
        page === 1 ? data.articles : [...prevNews, ...data.articles]
      );
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Category or Source changed. Fetching news...");
    console.log("Category:", category, "Source:", source);

    setPage(1);
    setNews([]);
    fetchNews();
  }, [category, source]);

  useEffect(() => {
    if (page > 1) {
      fetchNews();
    }
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return { news, loading, loadMore, setCategory, setSource, category, source };
};

export default useNews;
