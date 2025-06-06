import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Text, TouchableOpacity, View, Image, FlatList, Alert } from 'react-native'
import { useTransactions } from '../../hooks/useTransactions'
import { SignOutButton } from '@/components/SignOutButton'
import { useEffect, useState } from "react";
import PageLoader from '@/components/PageLoader'
import {styles} from "@/assets/home.styles.js"
import {Ionicons} from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { BalanceCard } from '@/components/BalanceCard'
import {TransactionItem} from '../../components/TransactionItem'



export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const {
    transactions,
    summary,
    isLoading,
    loadData,
    deleteTransaction
  } = useTransactions(user?.id);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  if (isLoading && !refreshing) return <PageLoader/>;

  const handleDelete = (id) => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) }
    ])
  }




 return (
  <View style={styles.container}>
    <View style={[styles.content, { flex: 1 }]}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* LEFT */}
        <View style={styles.headerLeft}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.usernameText}>
              {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
            </Text>
          </View>
        </View>

         {/* RIGHT */}
         <View style={styles.headerRight}>
           <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
             <Ionicons name="add" size={20} color="#FFF" />
             <Text style={styles.addButtonText}>Add</Text>
           </TouchableOpacity>
           <SignOutButton />
         </View>
      </View>

      <BalanceCard summary={summary} />

      <View style={styles.transactionsHeaderContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity
          style={{ marginLeft: 10, padding: 6, borderRadius: 16, backgroundColor: styles.addButton.backgroundColor || '#8B593E' }}
          onPress={onRefresh}
        >
          <Ionicons name="refresh" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Debug: Show number of transactions */}
      {/* <Text style={{ color: 'red', marginBottom: 10 }}>
        Debug: {transactions.length} transaction(s)
      </Text> */}

      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No transactions found</Text>
          <Text style={styles.emptyStateText}>Add a transaction to get started!</Text>
        </View>
      ) : (
        <FlatList
          style={[styles.transactionsList, { flex: 1 }]}
          contentContainerStyle={styles.transactionsListContent}
          data={transactions}
          renderItem={({ item }) => (
            <TransactionItem item={item} onDelete={handleDelete} />
          )}
          keyExtractor={item => item.id?.toString()}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

    </View>

    
  </View>
);

}