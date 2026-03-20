import { StyleSheet } from "react-native";

// We pass 'theme' as an argument so the function returns the correct colors
export const getStyles = (theme) =>
  StyleSheet.create({
    scrollContainer: {
      flex: 1,
      backgroundColor: theme.background,
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
      backgroundColor: "transparent",
      color: theme.text,
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
      backgroundColor: theme.card,
      width: "100%",
      minHeight: 40,
      height: "auto",
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
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
      backgroundColor: theme.card,
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
      alignItems: "center",
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
      backgroundColor: theme.background,
      width: "100%",
      minHeight: 40,
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    },
    input: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: theme.background,
      borderColor: theme.primary,
      color: theme.text,
      borderWidth: 2,
      width: "100%",
      minHeight: 50,
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
      textAlignVertical: "top",
      alignContent: "flex-start",
      justifyContent: "flex-start",
    },

    floatingBttnsCont: {
      position: "absolute",
      flex: 1,
      width: "100%",
      flexDirection: "row-reverse",
      bottom: 20,
      paddingHorizontal: 20,
      gap: 10,
    },
    addBttn: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    addBttnText: {
      color: theme.primaryText,
      fontSize: 24,
      fontWeight: "bold",
    },

    recentlyDeletedBttnCont: {
      flex: 1,
      alignItems: "center",
    },

    recentlyDeletedBttn: {
      width: "75%",
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.background,
      borderWidth: 2,
      borderColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    recentlyDeletedBttnText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: "bold",
    },

    themeBttn: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    themeBttnText: {
      color: theme.primaryText,
      fontSize: 24,
      fontWeight: "bold",
    },

    // Entries Page Grid Styles
    profileHeader: {
      paddingBottom: 4,
      paddingHorizontal: 20,
      backgroundColor: theme.background,
      flexDirection: "row",
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    stat: {
      alignItems: "center",
    },
    statNumber: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.primary,
      textAlign: "center",
    },
    statLabel: {
      fontSize: 12,
      marginTop: 4,
      color: theme.text,
      opacity: 0.7,
      textAlign: "center",
    },
    gridContainer: {
      paddingTop: 10,
      paddingBottom: 80,
    },
    gridItem: {
      backgroundColor: theme.card,
      borderRadius: 8,
      overflow: "hidden",
      position: "relative",
    },
    gridImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    gridPlaceholder: {
      width: "100%",
      height: "100%",
      backgroundColor: theme.primary + "20",
      justifyContent: "center",
      alignItems: "center",
    },
    gridPlaceholderText: {
      fontSize: 60,
      fontWeight: "bold",
      color: theme.primary,
    },
    gridRating: {
      position: "absolute",
      top: 5,
      right: 5,
      backgroundColor: "rgba(0,0,0,0.6)",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 10,
    },
    gridRatingText: {
      color: "white",
      fontSize: 10,
      fontWeight: "bold",
    },
    photoCountBadge: {
      position: "absolute",
      top: 5,
      left: 5,
      backgroundColor: "rgba(0,0,0,0.6)",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 10,
    },
    photoCountText: {
      color: "white",
      fontSize: 10,
      fontWeight: "bold",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 100,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      color: theme.text,
    },
    emptySubtext: {
      fontSize: 14,
      textAlign: "center",
      lineHeight: 20,
      color: theme.text,
      opacity: 0.5,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    // Add to your getStyles function return object

    // Photo Grid Specific
    screenTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 4,
    },
    photoCount: {
      fontSize: 14,
      color: theme.textSecondary,
    },

    // Image Viewer for Detail Screen
    imageViewerContainer: {
      width: "100%",
      height: "auto",
      position: "relative",
      backgroundColor: theme.card,
    },
    detailMainImage: {
      width: "100%",
      height: "auto",
      aspectRatio: 1,
      resizeMode: "cover",
    },
    imageNavButton: {
      position: "absolute",
      top: "50%",
      transform: [{ translateY: -20 }],
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary + "CC",
      justifyContent: "center",
      alignItems: "center",
    },
    imageNavLeft: {
      left: 10,
    },
    imageNavRight: {
      right: 10,
    },
    imageNavText: {
      color: theme.primaryText,
      fontSize: 24,
      fontWeight: "bold",
    },
    photoCounter: {
      position: "absolute",
      bottom: 10,
      right: 10,
      backgroundColor: theme.primary + "CC",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 16,
    },
    photoCounterText: {
      color: theme.primaryText,
      fontSize: 12,
      fontWeight: "bold",
    },
    noImageContainer: {
      width: "100%",
      height: 400,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.mute,
    },
    noImageText: {
      fontSize: 128,
      color: theme.muteText,
    },

    // Detail Action Buttons
    detailActionButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 30,
      marginBottom: 20,
    },
    detailButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginHorizontal: 5,
    },
    editButton: {
      backgroundColor: theme.background,
      borderWidth: 2,
      borderColor: theme.primary,
      flex: 3,
    },
    editButtonText: {
      color: theme.primary,
    },
    deleteButton: {
      backgroundColor: theme.background,
      borderWidth: 2,
      borderColor: theme.error,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
    },
    deleteButtonText: {
      color: theme.error,
      fontWeight: 500,
    },
    detailButtonText: {
      color: theme.primaryText,
      fontSize: 16,
      fontWeight: "bold",
    },

    // Add to your getStyles function return object

    // Add Entry Screen Specific Styles
    addEntryContainer: {
      flex: 1,
    },
    addEntryForm: {
      padding: 20,
      paddingBottom: 40,
    },
    inputField: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
      color: theme.text,
    },
    textArea: {
      minHeight: 120,
      textAlignVertical: "top",
    },

    // Image Picker Styles
    imagePickerRow: {
      flexDirection: "row",
      marginBottom: 20,
    },
    imagePickerButton: {
      backgroundColor: theme.background,
      paddingVertical: 8,
      paddingHorizontal: 16,
      height: 50,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: theme.primary,
    },
    imagePickerIcon: {
      fontSize: 20,
      marginRight: 8,
    },
    imagePickerText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: "500",
    },
    imageGallery: {
      marginBottom: 15,
    },
    imageList: {
      paddingVertical: 10,
    },
    imageContainer: {
      position: "relative",
      marginRight: 10,
    },
    imagePreview: {
      width: 100,
      height: 100,
      borderRadius: 8,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.primary + "30",
    },
    removeImageButton: {
      position: "absolute",
      top: -5,
      right: -5,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.accent,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.background,
    },
    removeImageText: {
      color: theme.primaryText,
      fontSize: 16,
      fontWeight: "bold",
    },

    // Tags Styles
    tagHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    addTagText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: "600",
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    tag: {
      backgroundColor: theme.primary + "20",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    tagText: {
      color: theme.primary,
      fontSize: 14,
      marginRight: 4,
    },
    removeTagText: {
      color: theme.accent,
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 4,
    },

    // Cancel Button
    cancelButton: {
      backgroundColor: "transparent",
      height: 50,
      justifyContent: "center",
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10,
      borderWidth: 2,
      flex: 1,
      borderColor: theme.primary,
    },
    cancelButtonText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: "600",
    },

    locationButton: {
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      height: 50,
      width: 50,
      padding: 10,
      borderRadius: 10,
      marginBottom: 10,
    },

    locationIcon: {
      margin: 0,
      color: theme.primaryText,
      fontWeight: 500,
    },

    // Add to your getStyles function return object

    // Date Picker Styles
    datePickerButton: {
      backgroundColor: theme.background,
      borderRadius: 8,
      padding: 12,
      borderWidth: 2,
      borderColor: theme.primary,
    },
    datePickerButtonText: {
      color: theme.text,
      fontSize: 16,
    },

    // Location Input Specific
    locationInput: {
      flex: 1,
    },
    locationButtonText: {
      fontSize: 20,
    },

    ratingContainer: {
      flexDirection: "row",
      height: 50,
      flex: 1,
      gap: 4,
    },

    star: {
      color: theme.primary,
      fontSize: 36,
      textAlign: "center",
    },

    starPressable: {
      flex: 1,
      borderRadius: 10,
      borderColor: theme.primary,
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
    },

    starFilled: {
      borderRadius: 10,
      color: theme.primaryText,
      backgroundColor: theme.primary,
    },

    saveButton: {
      backgroundColor: theme.primary,
      height: 50,
      justifyContent: "center",
      paddingVertical: 10,
      borderRadius: 10,
      flex: 2,
    },

    saveButtonText: {
      color: theme.primaryText,
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 16,
    },

    entryDetailContent: {
      padding: 10,
      gap: 10,
    },

    entryDetailTitle: {
      fontSize: 24,
      fontWeight: 500,
      color: theme.text,
    },

    entryDetailLocation: {
      color: theme.text,
    },

    entryDetailNotes: {
      color: theme.text,
    },

    entryDetailRatingCont: {
      flexDirection: "row",
      borderWidth: 2,
    },

    buttonRed: {
      backgroundColor: theme.error,
    },

    errorText: {
      color: theme.textSecondary,
    },

    entryDetailTags: {
      gap: 4,
    },

    entryDetailTag: {
      backgroundColor: theme.mute,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      marginRight: 4,
    },

    entryDetailTagText: {
      color: theme.muteText,
    },

    editModeBttn: {
      backgroundColor: theme.background,
      borderWidth: 2,
      borderColor: theme.primary,
      paddingVertical: 4,
      paddingHorizontal: 16,
      borderRadius: 30,
      width: 80,
      alignContent: "center",
      justifyContent: "center",
    },

    editModeBttnText: {
      margin: 0,
      fontWeight: 500,
      fontSize: 14,
      textAlign: "center",
      color: theme.text,
    },

    statCont: {
      flex: 1,
      alignItems: "flex-start",
    },

    editModeBanner: {
      backgroundColor: theme.error,
      paddingVertical: 8,
    },

    editModeText: {
      color: theme.errorText,
      textAlign: "center",
      fontWeight: 500,
    },

    emojiPreviewContainer: {
      alignItems: "center",
      paddingBottom: 20,
    },

    emojiInput: {
      fontSize: 100,
    },

    emojiPreviewText: {
      fontSize: 100,
      color: theme.text,
    },

    emojiHelperText: {
      color: theme.textSecondary,
    },
  });
