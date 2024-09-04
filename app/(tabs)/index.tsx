import React, { useRef } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import NewsCard from "@/components/NewsCard";
import useNews from "@/hooks/useNews";

const { height, width } = Dimensions.get("window");

export default function HomeScreen() {
  const { news, loading, loadMore } = useNews();
  const carouselRef = useRef<Carousel<any>>(null);

  const handleSnapToItem = (index: number) => {
    const threshold = Math.floor(news.length * 0.8); // 80% of the current data
    if (index >= threshold) {
      loadMore(); // Load more data when the user reaches near the end
    }
  };

  if (loading && news.length === 0) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={news}
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
      {loading && news.length > 0 && (
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
