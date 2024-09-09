import React, { useCallback } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { categories, sources } from "@/components/api";
import { useNewsContext } from "@/hooks/NewsContext";
import { useNavigation } from "@react-navigation/native";

export default function Explore() {
  const { width } = Dimensions.get("window");
  const SLIDE_WIDTH = Math.round(width / 3.5);
  const { setCategory, setSource, category } = useNewsContext();
  const navigation = useNavigation();

  const handleCategorySelect = useCallback(
    async (category: string) => {
      await setCategory(category);
      navigation.navigate("index");
    },
    [navigation, setCategory]
  );

  const handleSourceSelect = useCallback(
    async (sourceId: string) => {
      await setSource(sourceId);
      navigation.navigate("index");
    },
    [navigation, setSource]
  );

  return (
    <View style={styles.discover}>
      <Text style={styles.subtitle}>Categories</Text>
      <Carousel
        layout={"default"}
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleCategorySelect(item.name)}
            style={styles.category}
          >
            <Image source={{ uri: item.pic }} style={styles.categoryImage} />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
        sliderWidth={width}
        itemWidth={SLIDE_WIDTH}
        activeSlideAlignment={"start"}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
      />
      <Text style={styles.subtitle}>Sources</Text>
      <View style={styles.sources}>
        {sources.map((s) => (
          <TouchableOpacity
            onPress={() => handleSourceSelect(s.id)}
            key={s.id}
            style={styles.sourceContainer}
          >
            <Image source={{ uri: s.pic }} style={styles.sourceImage} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  discover: {
    padding: 10,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 8,
    marginHorizontal: 5,
    borderBottomColor: "#007FFF",
    borderBottomWidth: 5,
    alignSelf: "flex-start",
    borderRadius: 10,
  },
  category: {
    height: 130,
    margin: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  categoryImage: {
    height: "60%",
    width: "100%",
    resizeMode: "contain",
  },
  name: {
    fontSize: 14,
    textTransform: "capitalize",
  },
  sources: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingVertical: 15,
  },
  sourceContainer: {
    height: 150,
    width: "40%",
    borderRadius: 10,
    margin: 15,
    backgroundColor: "#cc313d",
  },
  sourceImage: {
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
});
