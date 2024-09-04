// app/(tabs)/Explore.tsx
import React from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import NewsCard from "@/components/NewsCard";
import useNews from "@/hooks/useNews";

const Explore: React.FC = () => {
  const { news, loading } = useNews();

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <FlatList
      data={news}
      renderItem={({ item }) => (
        <NewsCard
          title={item.title}
          description={item.description}
          imageUrl={item.imageUrl}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default Explore;
