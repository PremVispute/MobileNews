import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import NewsCard from "@/components/NewsCard";
import { useNewsContext } from "@/hooks/NewsContext";

const { height, width } = Dimensions.get("window");

export default function HomeScreen() {
  const { news, loading, loadMore, category, source } = useNewsContext(); // Access category and source
  const carouselRef = useRef<Carousel<any>>(null);
  const [localNews, setLocalNews] = useState(news);

  const handleSnapToItem = (index: number) => {
    const threshold = Math.floor(localNews.length * 0.8);
    if (index >= threshold) {
      loadMore();
    }
  };

  // Update local state when the news changes
  useEffect(() => {
    setLocalNews(news);
  }, [news]);

  // Trigger re-render whenever category or source changes
  useEffect(() => {
    console.log("Category or Source changed:", category, source);
  }, [category, source]); // Listen for changes in category and source

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
