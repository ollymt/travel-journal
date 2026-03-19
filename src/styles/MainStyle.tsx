import { StyleSheet } from "react-native";

// We pass 'theme' as an argument so the function returns the correct colors
export const getStyles = (theme) =>
  StyleSheet.create({
    scrollContainer: {
      flex: 1,
      backgroundColor: theme.background, // Use theme background
    },
    button: {
      borderRadius: 6,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    buttonPrimary: {
      backgroundColor: theme.primary,
    },
    buttonPrimaryText: {
      color: theme.primaryText,
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    textSecondary: {
      color: theme.text,
      opacity: 0.5,
    },
    buttonSecondaryText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    buttonSecondary: {
      backgroundColor: "transparent", // Fixed "none" to "transparent"
      color: theme.text, // Text color changes with theme
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      borderWidth: 2,
      borderColor: theme.text,
    },
    buttonFullWidth: {
      width: "100%",
      flex: 1,
      bottom: 0,
      marginBottom: 16,
      paddingVertical: 10,
      left: 10,
      right: 10,
    },
    card: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: theme.card, // Dynamic card background
      width: "100%",
      minHeight: 40,
      height: "auto",
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
      // Adjust shadow for dark mode
      /*shadowColor: theme.isDarkMode ? "#000" : "#999",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDarkMode ? 0.5 : 0.2,
      shadowRadius: 4,
      elevation: 3, // Required for Android shadows */
    },
    homeScreen: {
      flex: 1,
      backgroundColor: theme.background,
    },
    cardItemName: {
      fontSize: 20,
      paddingVertical: 6,
      fontWeight: "bold",
      color: theme.text,
    },
    cardItemPrice: {
      fontSize: 20,
      fontWeight: "600",
      marginTop: 4,
      marginBottom: 4,
      color: theme.text,
    },
    cardItemStats: {
      flexDirection: "column",
      paddingTop: 10,
    },
    detailCont: {
      padding: 10,
      marginBottom: 60,
      backgroundColor: theme.background,
    },
    detailsName: {
      fontSize: 20,
      fontWeight: "500",
      color: theme.text,
    },
    detailsPrice: {
      fontSize: 32,
      paddingTop: 12,
      color: theme.text,
    },
    detailsStats: {
      fontSize: 16,
      color: theme.text,
    },
    detailsDescHeader: {
      marginTop: 32,
      fontSize: 16,
      color: theme.text,
    },
    detailsDesc: {
      fontSize: 16,
      color: theme.text,
    },
    tabBarBadge: {
      backgroundColor: theme.accent,
      color: theme.primaryText,
    },
    cartItemRow: {
      flexDirection: "row",
      padding: 10,
      marginBottom: 10,
      backgroundColor: theme.card, // Subtle row contrast
      borderRadius: 8,
      alignItems: "center",
    },
    cartImage: {
      width: 60,
      height: 60,
      borderRadius: 4,
    },
    cartInfo: {
      marginLeft: 15,
      flex: 1,
    },
    cartItemName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    cartItemPrice: {
      color: theme.text,
      marginTop: 4,
    },
    totalSection: {
      padding: 20,
      borderTopWidth: 1,
      borderColor: theme.isDarkMode ? "#333" : "#eee",
      backgroundColor: theme.background,
      alignItems: "center", // Fixed alignment
      flexDirection: "row",
    },
    totalText: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
    },
    emptyCartMsg: {
      textAlign: "center",
      opacity: 0.5,
      color: theme.text,
    },

    topbar: {
      height: 90,
      width: "100%",
      justifyContent: "flex-end",
      alignItems: "center",
      alignSelf: "stretch",

      // ios shadow
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,

      opacity: 0.9,
    },
    topbarheader: {
      color: theme.background,
      fontWeight: "bold",
      padding: 10,
      fontSize: 18,
    },

    inputContainer: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: theme.background, // Dynamic card background
      width: "100%",
      minHeight: 40,
      // height: "auto",
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    },

    input: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: theme.background, // Dynamic card background
      width: "100%",
      minHeight: 40,
      // height: "auto",
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
      textAlignVertical: "top",
      alignContent: "flex-start",
      justifyContent: "flex-start",
    },

    floatingBttn: {
      position: "absolute",
      bottom: 60,
      right: 20,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: theme.primary,
      alignSelf: "flex-start",
      borderRadius: 30,
    },

    floatingBttnText: {
      color: theme.primaryText,
      fontWeight: "bold",
      fontSize: 20,
      textAlign: "center",
    },

    gridItem: {

    },

    gridImage: {

    },

    gridPlaceholder: {

    },

    gridPlaceholderText: {
      
    }
  });
