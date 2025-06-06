import { View, ActivityIndicator } from "react-native";
import { styles } from "../assets/home.styles.js";
import { COLORS } from "../constants/colors.js";

const PageLoader = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color={COLORS.primary} />
    </View>
  );
};

export default PageLoader;
