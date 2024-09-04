// app/hooks/useNews.tsx
import { useState, useEffect } from "react";

interface NewsItem {
  urlToImage: string;
  title: string;
  description: string;
}

const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=599b400f84f74625841e05ddc3fd06ff"
        );
        const data = await response.json();
        setNews(data.articles);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { news, loading };
};

export default useNews;
