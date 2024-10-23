import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { auth } from "./firebase";
import { ref, set, push, get, remove } from "firebase/database";
import { db } from "./firebase";
import * as FileSystem from "expo-file-system";
import Papa from "papaparse";
import { Asset } from "expo-asset";

interface NewsItem {
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
      const { localUri } = await Asset.fromModule(
        require("../assets/data/Testcsvnews.csv")
      ).downloadAsync();
      const fileUri = localUri || "";
      const csvContent = await FileSystem.readAsStringAsync(fileUri);

      Papa.parse(csvContent, {
        header: true,
        complete: (results) => {
          const parsedNews = results.data.map((row: any) => ({
            title: row.Trending,
            description: row.Headline,
          }));
          setNews(parsedNews);
        },
        error: (error: any) => {
          console.error("Error parsing CSV:", error);
        },
      });
    } catch (error) {
      console.error("Error fetching CSV file:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveNewsItem = async (newsItem: any) => {
    if (!currentUser) return;

    try {
      const userRef = ref(db, `savedNews/${currentUser.uid}`);
      const newNewsRef = push(userRef);
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

      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const savedNews = snapshot.val();

        const newsKey = Object.keys(savedNews).find(
          (key) => savedNews[key].url === newsUrl
        );

        if (newsKey) {
          const newsItemRef = ref(
            db,
            `savedNews/${currentUser.uid}/${newsKey}`
          );
          await remove(newsItemRef);
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
    fetchNews();
  }, []);

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
