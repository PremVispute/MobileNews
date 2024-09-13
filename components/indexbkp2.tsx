import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import NewsCard from "@/components/NewsCard";
import { useNewsContext } from "@/hooks/NewsContext";

export default function HomeScreen() {
  const {
    news,
    loading,
    saveNewsItem,
    removeSavedNewsItem,
    fetchSavedNews,
    currentUser,
  } = useNewsContext();
  const [localNews, setLocalNews] = useState<any[]>([]);
  const [savedNewsIds, setSavedNewsIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("My Feed");

  // Check the fetched news data from the API
  useEffect(() => {
    console.log("Fetched news data:", news);
    setLocalNews(news);
  }, [news]);

  // Fetch saved news on load and when currentUser changes
  useEffect(() => {
    const loadSavedNews = async () => {
      if (currentUser?.uid) {
        const savedNewsItems = await fetchSavedNews(currentUser.uid);
        const savedIds = savedNewsItems.map((item) => item.url); // Assuming 'url' is unique
        setSavedNewsIds(savedIds);
      }
    };
    loadSavedNews();
  }, [currentUser]);

  // Toggle saved status for a news item
  const handleSaveToggle = (newsItem: any) => {
    const isAlreadySaved = savedNewsIds.includes(newsItem.url);
    if (isAlreadySaved) {
      removeSavedNewsItem(newsItem.url); // Remove from saved news
      setSavedNewsIds((prev) => prev.filter((id) => id !== newsItem.url));
    } else {
      saveNewsItem(newsItem); // Save the news
      setSavedNewsIds((prev) => [...prev, newsItem.url]);
    }
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
    // You can add logic to filter news based on category
  };

  const categories = [
    "My Feed",
    "abcsv",
    "wrberb",
    "aerbear",
    "aeb",
    "aeber",
    "aetrbe",
    "aetbea",
    "aetbe",
    "aetbaet",
  ];

  if (loading && localNews.length === 0) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.navContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.pill,
                item === selectedCategory && styles.selectedPill,
              ]}
              onPress={() => handleCategoryPress(item)}
            >
              <Text
                style={[
                  styles.pillText,
                  item === selectedCategory && styles.selectedPillText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {localNews && localNews.length > 0 ? (
        <Swiper
          cards={localNews}
          renderCard={(item) =>
            item ? ( // Check if the item is defined
              <NewsCard
                title={item.title}
                description={item.description}
                urlToImage={item.urlToImage}
                url={item.url}
                author={item.author}
                isSaved={savedNewsIds.includes(item.url)} // Check if the news is saved
                onTitlePress={() => handleSaveToggle(item)} // Toggle save on title press
              />
            ) : (
              <View style={styles.cardFallback}>
                <Text style={styles.fallbackText}>No more news available.</Text>
              </View>
            )
          }
          cardIndex={0}
          backgroundColor={"#4FD0E9"}
          stackSize={3} // Number of cards shown in the stack
          infinite={true} // Keeps the swiper running indefinitely
          onSwiped={(cardIndex) => {
            console.log(`Swiped card index: ${cardIndex}`);
          }}
          onSwipedAll={() => {
            console.log("All news swiped");
          }}
          disableTopSwipe={true}
          disableBottomSwipe={true}
          verticalSwipe={false} // Allow horizontal swipe only
          horizontalSwipe={true}
        />
      ) : (
        <Text style={styles.fallbackText}>No news available to display</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  cardFallback: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 20,
  },
  fallbackText: {
    fontSize: 16,
    color: "#333",
  },
  navContainer: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 10,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedPill: {
    backgroundColor: "#007bff",
  },
  pillText: {
    color: "#333",
    fontSize: 16,
  },
  selectedPillText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
