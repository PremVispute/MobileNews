import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { useNewsContext } from "@/hooks/NewsContext";

interface NewsItem {
  urlToImage: string;
  title: string;
  description: string;
}

export default function User() {
  const { currentUser, logout, fetchSavedNews } = useNewsContext();

  const [savedNews, setSavedNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const loadSavedNews = async () => {
      try {
        const newsItems = await fetchSavedNews(currentUser.uid);
        setSavedNews(newsItems);
      } catch (error) {
        console.error("Error loading saved news:", error);
      }
    };

    loadSavedNews();
  }, [fetchSavedNews]);

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Logout Successful", "You have been logged out.");
    } catch (error) {
      Alert.alert("Logout Error");
    }
  };

  return (
    <View style={styles.loggedInContainer}>
      <View style={styles.header}>
        <Text style={styles.displayName}>
          Welcome, {currentUser.displayName || "User"}
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={savedNews}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.newsItem}>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No saved news.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loggedInContainer: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  displayName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutButton: {
    color: "red",
    fontWeight: "bold",
  },
  newsItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
