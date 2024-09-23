import React, { useRef, useState } from "react";
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
  const { news, loading, saveNewsItem, removeSavedNewsItem } = useNewsContext();
  const carouselRef = useRef<Carousel<any>>(null);
  const [savedNewsIds, setSavedNewsIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("My Feed");
  const [activeIndex, setActiveIndex] = useState();

  const handleSnapToItem = (index: any) => {
    setActiveIndex(index);
  };

  const handleSaveToggle = (newsItem: any) => {
    const isAlreadySaved = savedNewsIds.includes(newsItem.url);

    if (isAlreadySaved) {
      removeSavedNewsItem(newsItem.url);
      setSavedNewsIds((prev) => prev.filter((id) => id !== newsItem.url));
    } else {
      saveNewsItem(newsItem);
      setSavedNewsIds((prev) => [...prev, newsItem.url]);
    }
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const handleActionPress = () => {};

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
              isSaved={savedNewsIds.includes(item.url)}
              onTitlePress={() => handleSaveToggle(item)}
            />
          )}
          sliderHeight={height}
          itemHeight={height}
          vertical={true}
          sliderWidth={width}
          itemWidth={width}
          snapToAlignment={"start"}
          onSnapToItem={handleSnapToItem}
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
  navContainer2: {
    position: "absolute",
    bottom: 30,
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
