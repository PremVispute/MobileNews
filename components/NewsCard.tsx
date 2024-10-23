import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

interface NewsCardProps {
  title: string;
  description: string;
  isSaved: boolean;
  onTitlePress: () => void;
}

const { height, width } = Dimensions.get("window");

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  isSaved,
  onTitlePress,
}) => {
  const [action, setAction] = useState("Play");
  const [highlightedText, setHighlightedText] = useState<string[]>([]);
  const [typedText, setTypedText] = useState("");
  const [displayMode, setDisplayMode] = useState<
    "normal" | "highlight" | "typewriter"
  >("normal");

  const intervalRef = useRef<any>(null);
  const typewriterIntervalRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(typewriterIntervalRef.current);
    };
  }, []);

  const handleActionPress = () => {
    if (action === "Play") {
      setDisplayMode("highlight");
      highlightText();
      setAction("Read");
    } else if (action === "Read") {
      setDisplayMode("typewriter");
      typewriterEffect();
      setAction("Play");
    }
  };

  const highlightText = () => {
    const words = description.split(" ");
    setHighlightedText(words); // Set the entire text initially
    clearInterval(intervalRef.current); // Clear previous intervals
    let index = 0;

    intervalRef.current = setInterval(() => {
      if (index < words.length) {
        setHighlightedText((prev) =>
          prev.map((word, i) => (i === index ? `<highlight>${word}` : word))
        );
        index++;
      } else {
        clearInterval(intervalRef.current);
      }
    }, 200); // Adjust the speed of highlighting
  };

  const typewriterEffect = () => {
    clearInterval(typewriterIntervalRef.current); // Clear previous intervals
    setTypedText(""); // Reset typed text
    let index = 0;

    typewriterIntervalRef.current = setInterval(() => {
      if (index < description.length) {
        setTypedText((prev) => prev + description[index]);
        index++;
      } else {
        clearInterval(typewriterIntervalRef.current);
      }
    }, 100); // Adjust the speed of typing
  };

  return (
    <View style={styles.card}>
      <View style={styles.description}>
        <TouchableOpacity onPress={onTitlePress}>
          <Text style={[styles.title, { color: isSaved ? "blue" : "black" }]}>
            {title}
          </Text>
        </TouchableOpacity>

        {/* Conditionally render the description based on the current display mode */}
        {displayMode === "normal" ? (
          <Text style={styles.content}>{description}</Text> // Initially show normal content
        ) : displayMode === "highlight" ? (
          <Text style={styles.content}>
            {highlightedText.map((word, index) => (
              <Text
                key={index}
                style={
                  word.includes("<highlight>") ? styles.highlight : undefined
                }
              >
                {word.replace("<highlight>", "")}{" "}
              </Text>
            ))}
          </Text> // Show highlighted text
        ) : (
          <Text style={styles.content}>{typedText}</Text> // Show typewriter text
        )}
      </View>
      <TouchableOpacity>
        <Text style={{ fontSize: 15, color: "white" }}>
          '{description?.slice(0, 45)}...'
        </Text>
        <Text style={{ fontSize: 17, fontWeight: "bold", color: "white" }}>
          Read More
        </Text>
      </TouchableOpacity>
      <View style={styles.navContainer2}>
        <TouchableOpacity style={styles.pill} onPress={handleActionPress}>
          <Text style={styles.pillText}>{action}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: height,
    margin: 0,
    borderRadius: 0,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: width,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    transform: [{ scaleY: -1 }],
  },
  description: {
    padding: 15,
    flex: 1,
    justifyContent: "center", // Center text vertically within the description container
    alignItems: "center", // Center text horizontally
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    paddingBottom: 10,
    textAlign: "center", // Ensure title is centered
  },
  content: {
    fontSize: 40,
    paddingBottom: 10,
    textAlign: "center", // Ensure description is centered
  },
  highlight: {
    backgroundColor: "yellow",
  },
  footer: {
    height: 80,
    width: width,
    position: "absolute",
    bottom: 80,
    backgroundColor: "#d7be69",
    justifyContent: "center",
    paddingHorizontal: 20,
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
  pillText: {
    color: "#333",
    fontSize: 16,
  },
});

export default NewsCard;
