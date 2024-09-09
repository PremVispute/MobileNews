// app/(tabs)/login.tsx
import LoginForm from "@/components/LoginForm";
import User from "@/components/User";
import { useNewsContext } from "@/hooks/NewsContext";
import { View, StyleSheet } from "react-native";

export default function LoginScreen() {
  const { currentUser } = useNewsContext();
  return (
    <View style={styles.container}>
      {currentUser ? <User /> : <LoginForm />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});
