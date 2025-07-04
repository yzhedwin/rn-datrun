import { StyleSheet, View } from "react-native";

import { getAuthContext } from "@/contexts/AuthContext";
import { getUserContext } from "@/contexts/UserContext";
import {
  uploadImageAsync,
  uploadProfilePictureToDB,
} from "@/utils/firebase-utils";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  const { logout } = getAuthContext();
  const { user, displayPhoto, setDisplayPhoto } = getUserContext();

  const handleUploadProfilePicture = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      if (user?.uid) {
        const filename = `users/${user.uid}/profile.jpg`; // Or generate a UUID
        const downloadURL = await uploadImageAsync(
          result.assets[0].uri,
          filename,
        );
        if (downloadURL === null) return;
        await uploadProfilePictureToDB("users", user.uid, downloadURL);
        setDisplayPhoto(result.assets[0].uri);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={handleUploadProfilePicture}>
          <Image
            source={
              displayPhoto
                ? { uri: displayPhoto }
                : require("@/assets/images/favicon.png")
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.username}>{user?.displayName}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/edit-profile")}
        >
          <Ionicons name="settings-outline" size={16} color="#fff" />
          <Text style={styles.editButtonText}> Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>Runs</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>128 km</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>9,200</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
      </View>

      {/* Settings Options */}
      <View style={styles.options}>
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="person-outline" size={20} color="#333" />
          <Text style={styles.optionText}>Account Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem}>
          <Ionicons name="lock-closed-outline" size={20} color="#333" />
          <Text style={styles.optionText}>Privacy Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#e11d48" />
          <Text style={[styles.optionText, { color: "#e11d48" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f9fafb",
    flexGrow: 1,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 12,
  },
  username: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 8,
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#059669",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 32,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  options: {
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    paddingTop: 16,
    gap: 16,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
