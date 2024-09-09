import React, { createContext, useState, useEffect, ReactNode } from "react";

interface NewsItem {
  urlToImage: string;
  title: string;
  description: string;
}

interface NewsContextType {
  news: NewsItem[];
  loading: boolean;
  category: string;
  source: string | null;
  setCategory: (category: string) => void;
  setSource: (source: string | null) => void;
  loadMore: () => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <NewsContext.Provider
      value={{
        news,
        loading,
        category,
        source,
        setCategory,
        setSource,
        loadMore,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNewsContext = () => {
  const context = React.useContext(NewsContext);
  if (!context) {
    throw new Error("useNewsContext must be used within a NewsProvider");
  }
  return context;
};
