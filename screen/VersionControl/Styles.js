import { StyleSheet} from "react-native";
import colors from "../../config/colors";
const styles = StyleSheet.create({
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderWidth: 0.6,
        borderRadius: 2,
        borderColor: colors.primary,
        marginRight: 5,
      },
      name: {
        fontSize: 14,
        color: colors.white,
      },
})
export default styles;