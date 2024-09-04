// app/components/NewsCard.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Linking,
} from "react-native";

interface NewsCardProps {
  title: string;
  description: string;
  urlToImage: string;
  url: string;
  author: string;
}

const { height, width } = Dimensions.get("window");

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  urlToImage,
  url,
  author,
}) => {
  return (
    <View
      style={{
        height: height,
        width: width,
      }}
    >
      <Image
        source={{ uri: urlToImage }}
        style={{ height: "45%", resizeMode: "cover", width: width }}
      />
      <View
        style={{
          ...styles.description,
        }}
      >
        <Text style={{ ...styles.title }}>{title}</Text>
        <Text style={{ ...styles.content }}>{description}</Text>
        <Text>
          Short by
          <Text style={{ fontWeight: "bold" }}> {author ?? "unknown"}</Text>
        </Text>
      </View>
      <ImageBackground
        blurRadius={30}
        style={styles.footer}
        source={{ uri: urlToImage }}
      >
        <TouchableOpacity onPress={() => Linking.openURL(url)}>
          <Text style={{ fontSize: 15, color: "white" }}>
            '{description?.slice(0, 45)}...'
          </Text>
          <Text style={{ fontSize: 17, fontWeight: "bold", color: "white" }}>
            Read More
          </Text>
        </TouchableOpacity>
      </ImageBackground>
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
  description: {
    padding: 15,
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  content: { fontSize: 18, paddingBottom: 10 },
  footer: {
    height: 80,
    width: width,
    position: "absolute",
    bottom: 80,
    backgroundColor: "#d7be69",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});

export default NewsCard;
