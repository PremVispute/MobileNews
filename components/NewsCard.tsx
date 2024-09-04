// app/components/NewsCard.tsx
import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

interface NewsCardProps {
  title: string;
  description: string;
  urlToImage: string;
}

const { height } = Dimensions.get("window");

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  urlToImage,
}) => {
  return (
    <View style={[styles.card, { height }]}>
      <Image source={{ uri: urlToImage }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 0,
    borderRadius: 0,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "60%",
  },
  textContainer: {
    padding: 10,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
  },
});

export default NewsCard;
