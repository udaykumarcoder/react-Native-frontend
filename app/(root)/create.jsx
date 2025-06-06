import { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../lib/api";
import { styles } from "@/assets/auth.styles.js";
import { COLORS } from "../../constants/colors.js";

const CATEGORIES = [
  { id: "food", name: "Food & Drinks", icon: "fast-food" },
  { id: "shopping", name: "Shopping", icon: "cart" },
  { id: "transportation", name: "Transportation", icon: "car" },
  { id: "entertainment", name: "Entertainment", icon: "film" },
  { id: "bills", name: "Bills", icon: "receipt" },
  { id: "income", name: "Income", icon: "cash" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];

const CreateScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isExpense, setIsExpense] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    // validations
    if (!title.trim()) return Alert.alert("Error", "Please enter a transaction title");
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    if (!selectedCategory) return Alert.alert("Error", "Please select a category");
    if (!user?.id) return Alert.alert("Error", "User not found");

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          title,
          amount: isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount)),
          category: CATEGORIES.find(c => c.id === selectedCategory)?.name || selectedCategory,
        }),
      });
      if (!response.ok) throw new Error("Failed to add transaction");
      setTitle("");
      setAmount("");
      setSelectedCategory("");
      setIsExpense(true);
      Alert.alert("Success", "Transaction added successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to add transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Transaction</Text>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholderTextColor="#9A8478"
      />
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#9A8478"
      />
      <View style={{ flexDirection: "row", marginBottom: 12, gap: 10 }}>
        <TouchableOpacity
          style={[
            styles.button,
            isExpense && { backgroundColor: COLORS.expense },
            !isExpense && { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
            { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" },
          ]}
          onPress={() => setIsExpense(true)}
        >
          <Ionicons name="remove-circle" size={20} color={isExpense ? "#fff" : COLORS.expense} style={{ marginRight: 8 }} />
          <Text style={[styles.buttonText, isExpense && { color: COLORS.white }, !isExpense && { color: COLORS.expense }]}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            !isExpense && { backgroundColor: COLORS.income },
            isExpense && { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
            { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" },
          ]}
          onPress={() => setIsExpense(false)}
        >
          <Ionicons name="add-circle" size={20} color={!isExpense ? "#fff" : COLORS.income} style={{ marginRight: 8 }} />
          <Text style={[styles.buttonText, !isExpense && { color: COLORS.white }, isExpense && { color: COLORS.income }]}>Income</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Category:</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 20, gap: 10 }}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.button,
              selectedCategory === cat.id
                ? { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                : { backgroundColor: COLORS.white, borderColor: COLORS.border },
              { borderRadius: 20, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, margin: 4 },
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Ionicons
              name={cat.icon}
              size={16}
              color={selectedCategory === cat.id ? COLORS.white : COLORS.primary}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.buttonText, selectedCategory === cat.id ? { color: COLORS.white } : { color: COLORS.primary }, { fontSize: 14 }]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        onPress={handleCreate}
        style={[styles.button, { marginTop: 10, backgroundColor: COLORS.primary, borderRadius: 12, alignItems: "center" }, isLoading && { opacity: 0.6 }]}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.button, { marginTop: 16, backgroundColor: COLORS.white, borderColor: COLORS.primary, borderWidth: 1, borderRadius: 12, alignItems: "center" }]}
      >
        <Text style={[styles.buttonText, { color: COLORS.primary }]}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateScreen;