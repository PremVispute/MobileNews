import React, { useContext } from "react";
import InshortTabs from "@/components/InshortTabs";
import Context, { NewsContext } from "@/hooks/Context";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Text, View } from "react-native";
import { Stack } from "expo-router";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { darkTheme } = useContext(NewsContext);
  return (
    <Context>
      {" "}
      {/* Wrapping the layout with your Context */}
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <View
            style={{
              flex: 1,
              backgroundColor: darkTheme ? "#282C35" : "white",
            }}
          >
            <Text>aergb</Text>
            {/* <InshortTabs />  */}
          </View>
        </Stack>
      </ThemeProvider>
    </Context>
  );
}
