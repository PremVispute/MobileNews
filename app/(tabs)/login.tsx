// app/(tabs)/login.tsx
import React, { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/hooks/firebase";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [user, setUser] = useState<string | null>();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "505620936802-rvr6pg15n44p5jl1h2mi60cv5o2otft5.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          setUser(userCredential.user.displayName);
        })
        .catch((error) => {
          console.log("Error signing in:", error);
        });
    }
  }, [response]);

  const handleLogin = () => {
    promptAsync();
  };

  return (
    <View style={styles.container}>
      {user ? (
        <Text>Welcome, {user}</Text>
      ) : (
        <Button
          title="Login with Google"
          onPress={handleLogin}
          disabled={!request}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
