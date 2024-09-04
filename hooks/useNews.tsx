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

  const fetchNews = async () => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=599b400f84f74625841e05ddc3fd06ff&page=${page}`
      );
      const data = await response.json();
      console.error(data.articles.length);
      setNews((prevNews) => [...prevNews, ...data.articles]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return { news, loading, loadMore };
};

export default useNews;
