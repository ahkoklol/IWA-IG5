// src/screens/product/PaymentScreen.tsx

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useStripe } from "@stripe/stripe-react-native";

import type { RootStackParamList } from "../../navigation/RootNavigator";
import { useTranslation } from "react-i18next";

type Props = NativeStackScreenProps<RootStackParamList, "Payment">;

export default function PaymentScreen({ route, navigation }: Props) {
  const { product, total } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const { t } = useTranslation();

  // Backend base URL from env
  const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL as string | undefined;

  const fetchPaymentSheetParams = useCallback(async () => {
    try {
      if (!BACKEND_URL) {
        Alert.alert(
          "Configuration error",
          "EXPO_PUBLIC_API_URL is not defined. Please configure your backend URL."
        );
        return null;
      }

      const amountInCents = Math.round(total * 100);

      const response = await fetch(`${BACKEND_URL}/payment-sheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInCents,
          currency: "eur",
          productId: product.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment parameters");
      }

      const { paymentIntent, ephemeralKey, customer } = await response.json();

      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    } catch (error) {
      console.error("Error fetching payment sheet params:", error);
      Alert.alert(
        "Payment error",
        "Unable to initialize payment. Please try again later."
      );
      return null;
    }
  }, [BACKEND_URL, product.id, total]);

  const initializePaymentSheet = useCallback(async () => {
    setLoading(true);

    const params = await fetchPaymentSheetParams();
    if (!params) {
      setLoading(false);
      return;
    }

    const { paymentIntent, ephemeralKey, customer } = params;

    const { error } = await initPaymentSheet({
      merchantDisplayName: "IWA",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      defaultBillingDetails: {
        name: "Client IWA",
      },
      allowsDelayedPaymentMethods: false,
    });

    if (error) {
      console.error("Error initializing payment sheet:", error);
      Alert.alert(
        "Payment error",
        "Unable to initialize the payment page. Please try again."
      );
      setReady(false);
    } else {
      setReady(true);
    }

    setLoading(false);
  }, [fetchPaymentSheetParams, initPaymentSheet]);

  useEffect(() => {
    initializePaymentSheet();
  }, [initializePaymentSheet]);

  const openPaymentSheet = async () => {
    if (!ready) return;

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(
        "Payment cancelled",
        error.message || "The payment could not be completed."
      );
    } else {
      Alert.alert("Payment successful", "Your purchase has been confirmed.", [
        {
          text: t("common_ok"),
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>{t("purchase_secure_payment")}</Text>
    <Text style={styles.subtitle}>
      {t("purchase_item")} {product.name}
    </Text>
    <Text style={styles.amount}>
      {t("purchase_total")} : {total.toFixed(2).replace(".", ",")} €
    </Text>

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator />
          <Text style={styles.loaderText}>{t("payment_loading_message")}</Text>
        </View>
      )}

      {!loading && (
        <TouchableOpacity
          style={[styles.payButton, !ready && { opacity: 0.5 }]}
          disabled={!ready}
          onPress={openPaymentSheet}
        >
          <Text style={styles.payButtonText}>{t("purchase_pay_now")}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>{t("report_cancel")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 24,
  },
  loaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  loaderText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 8,
  },
  payButton: {
    backgroundColor: "#7BCCEB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 14,
  },
});
