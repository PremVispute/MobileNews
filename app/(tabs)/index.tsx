// app/(tabs)/index.tsx
import React from "react";
import {
  FlatList,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from "react-native";
import NewsCard from "@/components/NewsCard";
import useNews from "@/hooks/useNews";

const { height } = Dimensions.get("window");

export default function HomeScreen() {
  const { news, loading } = useNews();

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  return (
    <FlatList
      data={news}
      renderItem={({ item }) => (
        <NewsCard
          title={item.title}
          description={item.description}
          urlToImage={item.urlToImage}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
      pagingEnabled
      snapToAlignment="start"
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      snapToInterval={height}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    paddingVertical: 0,
  },
});
