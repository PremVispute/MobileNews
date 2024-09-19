import React, { useEffect, useRef, useState } from "react";
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
    saveNewsItem,
    removeSavedNewsItem,
  } = useNewsContext();
  const carouselRef = useRef<Carousel<any>>(null);
  const [savedNewsIds, setSavedNewsIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("My Feed");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [action, setAction] = useState("Play");
  const [highlightedText, setHighlightedText] = useState<string[]>([]);
  const [typewriterText, setTypewriterText] = useState<string>("");
  const [isHighlighting, setIsHighlighting] = useState(true); // Toggle between highlight and typewriter

  const handleSnapToItem = (index: number) => {
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

  // Handle button press to toggle between highlighting and typewriter
  const handleActionPress = () => {
    if (isHighlighting) {
      highlightText();
      setAction("Read");
    } else {
      typewriterEffect();
      setAction("Play");
    }
    setIsHighlighting(!isHighlighting);
  };

  // Function to highlight words one by one
  const highlightText = () => {
    if (activeIndex !== null) {
      const selectedNews = news[activeIndex].title.split(" ");
      let i = 0;
      setHighlightedText([]);
      const interval = setInterval(() => {
        if (i >= selectedNews.length) {
          clearInterval(interval);
        } else {
          setHighlightedText((prev) => [...prev, selectedNews[i]]);
          i++;
        }
      }, 500); // Adjust timing as per requirement
    }
  };

  // Function to simulate typewriter effect
  const typewriterEffect = () => {
    if (activeIndex !== null) {
      const selectedNews = news[activeIndex].title;
      let i = 0;
      setTypewriterText("");
      const interval = setInterval(() => {
        if (i >= selectedNews.length) {
          clearInterval(interval);
        } else {
          setTypewriterText((prev) => prev + selectedNews[i]);
          i++;
        }
      }, 100); // Adjust speed of typewriter effect
    }
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
      <View style={styles.navContainer2}>
        <TouchableOpacity style={styles.pill} onPress={handleActionPress}>
          <Text style={styles.pillText}>{action}</Text>
        </TouchableOpacity>
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

      {/* Render Highlighted Text or Typewriter Text */}
      <View style={styles.textContainer}>
        {isHighlighting ? (
          <Text style={styles.highlightedText}>
            {highlightedText.join(" ")}
          </Text>
        ) : (
          <Text style={styles.typewriterText}>{typewriterText}</Text>
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
  textContainer: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  highlightedText: {
    color: "yellow",
    fontSize: 24,
  },
  typewriterText: {
    color: "white",
    fontSize: 24,
  },
});
