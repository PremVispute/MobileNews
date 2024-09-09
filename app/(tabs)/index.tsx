import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
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
  const [localNews, setLocalNews] = useState(news);
  const [savedNewsIds, setSavedNewsIds] = useState<string[]>([]);

  const handleSnapToItem = (index: number) => {
    const threshold = Math.floor(localNews.length * 0.8);
    if (index >= threshold) {
      loadMore();
    }
  };

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

  // Update local state when the news changes
  useEffect(() => {
    setLocalNews(news);
  }, [news]);

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

  if (loading && localNews.length === 0) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={localNews}
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
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
        snapToAlignment={"start"}
        onSnapToItem={handleSnapToItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      />
      {loading && localNews.length > 0 && (
        <ActivityIndicator
          size="small"
          color="#0000ff"
          style={styles.footerLoader}
        />
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
  footerLoader: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
});
