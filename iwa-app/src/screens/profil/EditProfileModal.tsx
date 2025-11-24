// src/components/EditProfileModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { X, Camera } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import type { User } from "../../shared/types";
import * as ImagePicker from "expo-image-picker";


interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: Partial<User>) => void;
}

export function EditProfileModal({
  user,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const { t } = useTranslation();

  const [fullName, setFullName] = useState(user.fullName);
  const [location, setLocation] = useState(user.location);
  const [nationality, setNationality] = useState(user.nationality);
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar);

  const handleSubmit = () => {
    onSave({
      fullName,
      location,
      nationality,
      bio,
      avatar,
    });
    onClose();
  };

  const pickAvatarFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("edit_profile_change_photo_permission_title"),
        t("edit_profile_change_photo_permission_message")
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const takeAvatarPhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("edit_profile_change_photo_permission_title"),
        t("edit_profile_change_photo_permission_message")
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleChangeAvatar = () => {
    pickAvatarFromLibrary();
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t("edit_profile_title")}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#1f2933" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentInner}
            showsVerticalScrollIndicator={false}
          >
            {/* Avatar */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                {avatar ? (
                  <Image source={{ uri: avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarPlaceholderText}>
                      {user.username?.charAt(0).toUpperCase() ?? "?"}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  onPress={handleChangeAvatar}
                  style={styles.cameraButton}
                >
                  <Camera size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.changePhotoText}>
                {t("edit_profile_change_photo")}
              </Text>
            </View>

            {/* Username (read-only) */}
            <View style={styles.field}>
              <Text style={styles.label}>{t("edit_profile_username_label")}</Text>
              <TextInput
                value={user.username}
                editable={false}
                style={[styles.input, styles.inputDisabled]}
              />
            </View>

            {/* Full Name */}
            <View style={styles.field}>
              <Text style={styles.label}>{t("edit_profile_fullname_label")}</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
                placeholder={t("edit_profile_fullname_placeholder")}
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Location */}
            <View style={styles.field}>
              <Text style={styles.label}>{t("edit_profile_location_label")}</Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                style={styles.input}
                placeholder={t("edit_profile_location_placeholder")}
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Nationality */}
            <View style={styles.field}>
              <Text style={styles.label}>
                {t("edit_profile_nationality_label")}
              </Text>
              <TextInput
                value={nationality}
                onChangeText={setNationality}
                style={styles.input}
                placeholder={t("edit_profile_nationality_placeholder")}
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Bio */}
            <View style={styles.field}>
              <Text style={styles.label}>{t("edit_profile_bio_label")}</Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder={t("edit_profile_bio_placeholder")}
                placeholderTextColor="#9ca3af"
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
              />
            </View>
          </ScrollView>

          {/* Save button */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>
                {t("edit_profile_save")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    flex: 1,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {},
  contentInner: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderText: {
    fontSize: 32,
    fontWeight: "600",
    color: "#6b7280",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#7BCCEB",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  changePhotoText: {
    marginTop: 8,
    fontSize: 12,
    color: "#6b7280",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: "#111827",
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f9fafb",
    fontSize: 14,
    color: "#111827",
  },
  inputDisabled: {
    backgroundColor: "#f3f4f6",
    color: "#9ca3af",
  },
  textArea: {
    height: 110,
    textAlignVertical: "top",
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e7eb",
  },
  saveButton: {
    backgroundColor: "#7BCCEB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
