import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { auth } from "./firebase";
import { ref, set, push, get, child, remove } from "firebase/database"; // Firebase Realtime Database functions
import { db } from "./firebase"; // Import your Firebase config

interface NewsItem {
  urlToImage: string;
  title: string;
  description: string;
  url: string;
}

interface NewsContextType {
  news: NewsItem[];
  loading: boolean;
  category: string;
  source: string | null;
  setCategory: (category: string) => void;
  setSource: (source: string | null) => void;
  loadMore: () => void;
  currentUser: any;
  signup: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  saveNewsItem: (newsItem: any) => Promise<void>;
  fetchSavedNews: (userId: string) => Promise<NewsItem[]>;
  removeSavedNewsItem: (newsUrl: string) => Promise<void>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("general");
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function signup(email: string, password: string, displayName: string) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return updateProfile(user, {
          displayName: displayName,
        });
      })
      .then(() => {
        console.log("Profile updated successfully");
      })
      .catch((error) => {
        console.error("Error during sign up or profile update:", error);
      });
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

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

  // In your NewsProvider, add these functions:
  const saveNewsItem = async (newsItem: any) => {
    if (!currentUser) return;

    try {
      const userRef = ref(db, `savedNews/${currentUser.uid}`);
      const newNewsRef = push(userRef); // Create a new reference in the user's saved news list
      await set(newNewsRef, newsItem);
      console.log("News item saved successfully!");
    } catch (error) {
      console.error("Error saving news item:", error);
    }
  };

  const removeSavedNewsItem = async (newsUrl: string) => {
    if (!currentUser) return;

    try {
      const userRef = ref(db, `savedNews/${currentUser.uid}`);

      // Find the news item by its URL
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const savedNews = snapshot.val();

        // Loop through the saved news to find the one with the matching URL
        const newsKey = Object.keys(savedNews).find(
          (key) => savedNews[key].url === newsUrl
        );

        if (newsKey) {
          const newsItemRef = ref(
            db,
            `savedNews/${currentUser.uid}/${newsKey}`
          );
          await remove(newsItemRef); // Remove the saved news item from the database
          console.log("News item removed successfully!");
        } else {
          console.log("News item not found!");
        }
      }
    } catch (error) {
      console.error("Error removing news item:", error);
    }
  };

  const fetchSavedNews = async (userId: string): Promise<NewsItem[]> => {
    try {
      const savedNewsRef = ref(db, `savedNews/${userId}`);
      const snapshot = await get(savedNewsRef);
      if (snapshot.exists()) {
        const savedNewsData = snapshot.val();
        return Object.values(savedNewsData) as NewsItem[];
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching saved news:", error);
      return [];
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
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        news,
        loading,
        category,
        source,
        setCategory,
        setSource,
        loadMore,
        saveNewsItem,
        fetchSavedNews,
        removeSavedNewsItem,
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
