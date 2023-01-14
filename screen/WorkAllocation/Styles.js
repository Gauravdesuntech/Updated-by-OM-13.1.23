import { StyleSheet, Dimensions } from "react-native";
import Colors from "../../config/colors";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const tabHeight = 50;
const galleryGridWidth = Math.floor((windowWidth - 20) / 4);
const galleryGridHeight = Math.floor((windowWidth - 20) / 4);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 5,
      },
      view: {
        flexDirection: "row",
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        paddingHorizontal: 5,
        paddingVertical: 3,
      },
      image: {
        width: 50,
        height: 50,
      },
      name: {
        fontSize: 18,
        color: Colors.textColor,
      },
      qtyContainer: {
        height: 35,
        width: 35,
        borderRadius: 100,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
      },
      qty: {
        fontSize: 14,
        color: "#FFF",
      },
      angelIconContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
      },
      iconStyle: {
        fontSize: 18,
        color: "#cecece",
      },
      searchModalOverlay: {
        justifyContent: "center",
        alignItems: "center",
        width: windowWidth,
        height: windowHeight,
      },
      seacrhModalContainer: {
        flex: 1,
        width: windowWidth,
        height: windowHeight,
        backgroundColor: Colors.white,
      },
      searchModalHeader: {
        height: 55,
        width: "100%",
        elevation: 5,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: Colors.primary,
      },
      backBtnContainer: {
        width: "10%",
        height: 55,
        alignItems: "flex-start",
        justifyContent: "center",
      },
      searchContainer: {
        width: "90%",
        height: 55,
        alignItems: "flex-start",
        justifyContent: "center",
      },
      searchFieldBox: {
        width: "100%",
        height: 40,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(0,0,0, 0.1)",
        borderRadius: 50,
      },
      searchField: {
        padding: 5,
        width: "90%",
        color: Colors.white,
        fontSize: 15,
      },
      searchModalBody: {
        flex: 1,
        height: windowHeight - 55,
      },
      searchingText: {
        fontSize: 12,
        color: Colors.textColor,
        opacity: 0.8,
        alignSelf: "center",
        marginTop: 20,
      },
      searchContainer: {
            width: "90%",
            height: 55,
            alignItems: "flex-start",
            justifyContent: "center",
          },
          searchFieldBox: {
            width: "100%",
            height: 40,
            paddingHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "rgba(0,0,0, 0.1)",
            borderRadius: 50,
          },
          searchField: {
            padding: 5,
            width: "90%",
            color: Colors.white,
            fontSize: 15,
          },
          searchModalBody: {
            flex: 1,
            height: windowHeight - 55,
          },
          searchingText: {
            fontSize: 12,
            color: Colors.textColor,
            opacity: 0.8,
            alignSelf: "center",
            marginTop: 20,
          },
          dateField: {
            // 		backgroundColor: "#fff",
            		height: 'auto',
            		flexWrap: 'wrap',
            		fontSize: 19,
            		color: Colors.textColor,
            		textAlign: "left",
            		width: '22%',
            		padding: 5,
            	},
            	buttonsContainer: {
            		flexDirection: "row",
            		alignItems: "center",
            		justifyContent: "space-evenly",
            		marginVertical: 30,
            	},
            	buttonText: {
            		fontSize: 18,
            		fontWeight: "bold",
            	},
            	saveBtnText: {
            		color: Colors.primary,
            	},
            	exitBtnText: {
            		color: Colors.activeTab,
            	},
              fieldBox: {
                		alignItems: 'center',
                		width: "100%",
                		overflow: "hidden",
                		flexDirection: "row",
                		padding: 5,
                		paddingHorizontal: 10,
                		borderRadius: 3,
                		borderColor: "#ddd",
                		borderWidth: 1,
                		backgroundColor: "#fff",
                		height: 'auto',
                		justifyContent: "space-between",
                		marginBottom: 5,
                		marginTop: 5,
                		// shadowColor: "#999",
                		// shadowOffset: {
                		// 	width: 0,
                		// 	height: 1,
                		// },
                		// shadowOpacity: 0.22,
                		// shadowRadius: 2.22,
                		// elevation: 3,
                	},
                
                	labelName: {
                		color: Colors.labelColor,
                		// lineHeight: 40,
                		fontSize: 19,
                		paddingLeft: 4,
                		height: 'auto',
                		paddingVertical: 10
                	},
                  body: {
                    		flex: 9,
                    		padding: 5
                    	},
                    	row: {
                    		flexDirection: "row",
                    		paddingHorizontal: 5,
                    		paddingVertical: 10,
                    	},
                    	leftPart: {
                    		width: '22%',
                    		justifyContent: "center",
                    	},
                    	rightPart: {
                    		width: "25%",
                    		flexDirection: "row",
                    		justifyContent: "flex-end",
                    		alignItems: "center",
                    	},
                    	name: {
                    		color: Colors.labelColor,
                    		// lineHeight: 40,
                    		fontSize: 19,
                    		paddingLeft: 4,
                    		height: 'auto',
                    		paddingVertical: 5
                    	},
                    	tabContainer: {
                    		width: "100%",
                    		height: tabHeight,
                    		flexDirection: "row",
                    		borderBottomWidth: 1,
                    		borderBottomColor: "#d1d1d1",
                    		borderTopWidth: 1,
                    		borderTopColor: Colors.primary,
                    		elevation: 1,
                    	},
                    	downloadBtn: {
                    		flexDirection: "row",
                    		paddingHorizontal: 5,
                    		paddingVertical: 3,
                    		borderWidth: StyleSheet.hairlineWidth,
                    		borderRadius: 3,
                    		marginLeft: 20,
                    	},
                    	tab: {
                    		flex: 1,
                    		alignItems: "center",
                    		justifyContent: "center",
                    		height: tabHeight,
                    	},
                    	underlineStyle: {
                    		backgroundColor: Colors.primary,
                    		height: 3,
                    	},
                    	activeTab: {
                    		height: tabHeight - 1,
                    		borderBottomWidth: 2,
                    		borderBottomColor: Colors.primary,
                    	},
                    	activeText: {
                    		fontSize: 14,
                    		fontWeight: "bold",
                    		color: Colors.primary,
                    	},
                    	inActiveText: {
                    		fontSize: 14,
                    		color: Colors.textColor,
                    		opacity: 0.8,
                    	},
                      errorFieldBox: {
                                borderWidth: 1,
                                borderColor: Colors.tomato,
                            },
                            // multiSelectContainer: {
                            //     height: 'auto',
                            //     width: '100%',
                            //     borderRadius: 3,
                            //     borderColor: "#ddd",
                            //     borderWidth: 1,
                            //     backgroundColor: "#fff",
                            //     marginBottom: 5,
                            //     marginTop: 5,
                            //     shadowColor: "#999",
                            //     shadowOffset: {
                            //         width: 0,
                            //         height: 1,
                            //     },
                            //     shadowOpacity: 0.22,
                            //     shadowRadius: 2.22,
                            //     elevation: 3,
                            //     padding: 5,
                            // },
                            placeholderStyle: {
                                fontSize: 18,
                                color: Colors.textColor,
                                opacity: 0.8,
                            },
                            selectedItemsContainer: {
                                width: '60%',
                                height: "auto",
                                paddingVertical: 15,
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "center",
                            },
                            placeHolderContainer: {
                                borderWidth: 0
                            },
                            errorText: {
                                textAlign: "right",
                                color: Colors.tomato,
                                fontWeight: "bold",
                                fontStyle: "italic",
                            },
                            errorFieldBox: {
                                borderWidth: 1,
                                borderColor: Colors.tomato,
                            },
                            labelName: {
                                      color: Colors.labelColor,
                                     lineHeight: 40,
                                      fontSize: 19,
                                      paddingLeft: 4,
                                      height: 'auto',
                                      paddingVertical: 10
                                  },
                                  textfield: {
                                      backgroundColor: "#fff",
                                      height: 'auto',
                                      
                                      fontSize: 12,
                                      color: Colors.textColor,
                                      textAlign: "right",
                                      padding: 5,
                                      width: '60%'
                                  },
                                  button: {
                                      alignItems: "center",
                                      backgroundColor: Colors.primary,
                                      padding: 10,
                                      shadowColor: "#000",
                                      shadowOffset: {
                                          width: 0,
                                          height: 2,
                                      },
                                      shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        borderRadius: 20,
        color: "#fff",
        marginVertical: 10,
        zIndex: 0,
    },
                            

                            

})
export default styles;