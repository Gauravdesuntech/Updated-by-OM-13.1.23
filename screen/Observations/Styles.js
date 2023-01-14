import { StyleSheet, Dimensions } from "react-native";
import Colors from "../../config/colors";

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const tabHeight = 50;
const galleryGridWidth = Math.floor((windowWidth - 20) / 4);
const galleryGridHeight = Math.floor((windowWidth - 20) / 4);
const styles = StyleSheet.create({
  BGWhite: { backgroundColor: Colors.white },
  w80: { width: 80 },
  p10: { padding: 10 },
  mt40: { marginTop: 40 },
  mt5: { marginTop: 5 },
  mh8: { marginHorizontal: 8 },
  mh80: { marginHorizontal: 80 },
  formPaddingHorizontal: { padding: Colors.formPaddingHorizontal },
  textAlignCenter: { textAlign: "center" },
  // formBorder: {
  //   borderWidth: 1,
  //   borderColor: "#ddd",
  //   borderRadius: Colors.formBorderRedius,
  // },
  imageContainer: {
    borderWidth: 0.5,
    borderColor: "#444",
    width: "100%",
    height: 110,
    justifyContent: "center",
  },
  attachedImage: {
    height: 100,
    width: 100,
    marginHorizontal: 3,
    borderWidth: 0.6,
    borderColor: "rgba(68,68,68,0.4)",
  },
  imageRemoveBtn: { position: "absolute", right: -2, top: -3 },
  btnContainer: { width: "50%", paddingLeft: 20, paddingRight: 20 },
  priorityImage: { height: 15, width: 15, resizeMode: "contain" },
  sectionListHeaderDay: { fontSize: 26, color: Colors.white },
  sectionListHeaderWeekDay: { fontSize: 16, color: Colors.white },
  sectionListHeaderMonthYear: { fontSize: 14, color: Colors.white },
  viewIncidentAndObservationAttachment: { marginBottom: 10, height: 250 },
  scrollViewImageContainer: { paddingTop: 2, padingHorizontal: 10 },
  incidentAndObservationImage: {
    height: 200,
    width: 200,
    marginHorizontal: 5,
  },
  viewMedicalRecordImage: {
    height: 200,
    width: 200,
    marginHorizontal: 5,
  },
});

export default styles;
