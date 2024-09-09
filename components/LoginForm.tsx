import { useNewsContext } from "@/hooks/NewsContext";
import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View, StyleSheet } from "react-native";

export default function LoginForm() {
  const { login, signup, resetPassword } = useNewsContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleSubmit = async () => {
    if (isLoginMode) {
      try {
        await login(email, password);
        Alert.alert("Login Successful", "You are now logged in!");
      } catch (error) {
        Alert.alert("Login Error");
      }
    } else {
      try {
        if (password !== passwordConfirm) {
          return Alert.alert("Passwords do not match");
        }
        await signup(email, password, displayName);
        Alert.alert("Signup Successful", "Your account has been created!");
      } catch (error) {
        Alert.alert("Signup Error");
      }
    }
  };

  const handlePasswordReset = async () => {
    try {
      if (email === "") {
        return Alert.alert("Please enter your email");
      }
      await resetPassword(email);
      Alert.alert(
        "Password Reset",
        "A password reset link has been sent to your email."
      );
    } catch (error) {
      Alert.alert("Password Reset Error");
    }
  };

  return (
    <View style={styles.formContainer}>
      {!isLoginMode && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={displayName}
          onChangeText={setDisplayName}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {!isLoginMode && (
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          secureTextEntry
        />
      )}
      <Button
        title={isLoginMode ? "Login" : "Sign Up"}
        onPress={handleSubmit}
      />
      <View style={styles.toggleContainer}>
        <Text>
          {isLoginMode ? "New here? " : "Already have an account? "}
          <Text
            style={styles.toggleText}
            onPress={() => setIsLoginMode(!isLoginMode)}
          >
            {isLoginMode ? "Sign Up" : "Login"}
          </Text>
        </Text>
      </View>

      {isLoginMode && (
        <Text style={styles.forgotPassword} onPress={handlePasswordReset}>
          Forgot Password?
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  toggleContainer: {
    marginTop: 12,
    alignItems: "center",
  },
  toggleText: {
    color: "blue",
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "blue",
    marginTop: 12,
    textAlign: "center",
  },
});
