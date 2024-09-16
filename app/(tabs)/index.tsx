import React, { SetStateAction, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import NewsCard from "@/components/NewsCard";
import { useNewsContext } from "@/hooks/NewsContext";

const { height, width } = Dimensions.get("window");

export default function HomeScreen() {
  const {
    news,
    loading,
    loadMore,
    saveNewsItem,
    removeSavedNewsItem,
    fetchSavedNews,
    currentUser,
  } = useNewsContext();
  const carouselRef = useRef<Carousel<any>>(null);
  // const [localNews, setLocalNews] = useState(news);
  const [savedNewsIds, setSavedNewsIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("My Feed");
  const [activeIndex, setActiveIndex] = useState();

  const handleSnapToItem = (index: any) => {
    setActiveIndex(index);
    // const threshold = Math.floor(localNews.length * 0.8);
    // if (index >= threshold) {
    //   loadMore();
    // }
  };

  // Fetch saved news on load and when currentUser changes
  // useEffect(() => {
  //   const loadSavedNews = async () => {
  //     if (currentUser?.uid) {
  //       const savedNewsItems = await fetchSavedNews(currentUser.uid);
  //       const savedIds = savedNewsItems.map((item) => item.url); // Assuming 'url' is unique
  //       setSavedNewsIds(savedIds);
  //     }
  //   };

  //   loadSavedNews();
  // }, [currentUser]);

  // Update local state when the news changes
  // useEffect(() => {
  //   setLocalNews(news);
  // }, [news]);

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

  if (loading) {
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
      <View style={styles.carousel}>
        <Carousel
          ref={carouselRef}
          data={news}
          layout="stack"
          firstItem={news.slice(0, 10).length - 1}
          renderItem={({ item }) => (
            <NewsCard
              title={item.title}
              description={item.description}
              urlToImage={item.urlToImage}
              url={item.url}
              author={item.author}
              isSaved={savedNewsIds.includes(item.url)} // Check if the news is saved
              onTitlePress={() => handleSaveToggle(item)} // Toggle save on title press
            />
          )}
          sliderHeight={height}
          itemHeight={height}
          vertical={true}
          sliderWidth={width}
          itemWidth={width}
          // inactiveSlideOpacity={1}
          // inactiveSlideScale={1}
          snapToAlignment={"start"}
          onSnapToItem={handleSnapToItem}
          // showsVerticalScrollIndicator={false}
          // contentContainerStyle={styles.container}
        />
        {loading && (
          <ActivityIndicator
            size="small"
            color="#0000ff"
            style={styles.footerLoader}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: {
    flex: 1,
    transform: [{ scaleY: -1 }],
    backgroundColor: "black",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  footerLoader: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
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
