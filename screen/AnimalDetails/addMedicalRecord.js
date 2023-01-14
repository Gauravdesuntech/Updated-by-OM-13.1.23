import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Container } from "native-base";
import { Header, DatePicker } from "../../component";
import Colors from "../../config/colors";
import ModalMenu from "../../component/ModalMenu";
import OverlayLoader from "../../component/OverlayLoader";
import {
  getDiagnosis,
  getAnimalDiagnosisRecord,
  saveAnimalDiagnosisRecord,
} from "../../services/APIServices";
import { getFormattedDate } from "../../utils/Util";
import AppContext from "../../context/AppContext";
import styles from "../../config/Styles";

export default class AddMedicalRecord extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      showLoader: true,
      diagnosisArr: [],
      isTreatmentDatepickerOpen: false,
      isNextTreatmentDatePickerOpen: false,
      isDiagnosisMenuOpen: false,
      id:
        typeof this.props.route.params !== "undefined"
          ? this.props.route.params.id
          : 0,
      diagnosisCode: undefined,
      diagnosisName: undefined,
      treatmentDate: new Date(),
      affectedParts: "",
      problems: "",
      instruction: "",
      nextTreatmentDate: new Date(),
      diagnosedBy: "",
      isDiagnosisNameValidateionFailed: false,
      isAffectedPartsValidateionFailed: false,
      isProblemsValidateionFailed: false,
      isInstructionValidateionFailed: false,
      isDiagnosedByValidateionFailed: undefined,
    };
    this.scrollViewRef = React.createRef();
  }

  componentDidMount = () => {
    getDiagnosis()
      .then((data) => {
        this.setState({
          diagnosisArr: data,
          showLoader: parseInt(this.state.id) > 0 ? true : false,
        });

        if (parseInt(this.state.id) > 0) {
          getAnimalDiagnosisRecord(this.state.id)
            .then((data) => {
              this.setState({
                diagnosisCode: data.diagnosis_code,
                diagnosisName: data.diagnosis_name,
                treatmentDate: new Date(data.treatment_date),
                affectedParts: data.affected_parts,
                problems: data.problems,
                instruction: data.instruction,
                nextTreatmentDate: new Date(data.next_treatment_date),
                diagnosedBy: data.diagnosed_by,
                showLoader: false,
              });
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  };

  onTreatmentDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.treatmentDate;
    this.setState({
      isTreatmentDatepickerOpen: false,
      treatmentDate: currentDate,
    });
  };

  showTreatmentDatepicker = () =>
    this.setState({ isTreatmentDatepickerOpen: true });

  onNextTreatmentDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.nextTreatmentDate;
    this.setState({
      isNextTreatmentDatePickerOpen: false,
      nextTreatmentDate: currentDate,
    });
  };

  showNextTreatmentDatepicker = () =>
    this.setState({ isNextTreatmentDatePickerOpen: true });

  gotoBack = () => this.props.navigation.goBack();

  toggleDiagnosisMenu = () =>
    this.setState({ isDiagnosisMenuOpen: !this.state.isDiagnosisMenuOpen });

  setDiagnosisData = (v) => {
    this.setState({
      diagnosisCode: v.code,
      diagnosisName: v.name,
      isDiagnosisMenuOpen: false,
    });
  };

  scrollViewScrollTop = () => {
    this.scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

  saveMedicalRecord = () => {
    this.setState(
      {
        isDiagnosisNameValidateionFailed: false,
        isAffectedPartsValidateionFailed: false,
        isProblemsValidateionFailed: false,
        isInstructionValidateionFailed: false,
        isDiagnosedByValidateionFailed: undefined,
      },
      () => {
        let {
          diagnosisCode,
          affectedParts,
          problems,
          instruction,
          diagnosedBy,
        } = this.state;
        if (typeof diagnosisCode === "undefined") {
          this.setState({ isDiagnosisNameValidateionFailed: true });
          this.scrollViewScrollTop();
        } else if (affectedParts.trim().length === 0) {
          this.setState({ isAffectedPartsValidateionFailed: true });
          this.scrollViewScrollTop();
        } else if (problems.trim().length === 0) {
          this.setState({ isProblemsValidateionFailed: true });
          this.scrollViewScrollTop();
        } else if (instruction.trim().length === 0) {
          this.setState({ isInstructionValidateionFailed: true });
          this.scrollViewScrollTop();
        } else if (diagnosedBy.trim().length === 0) {
          this.setState({ isDiagnosedByValidateionFailed: true });
        } else {
          this.setState({ showLoader: true });

          let obj = {
            id: this.state.id,
            animal_code: this.context.selectedAnimalID,
            diagnosis_code: diagnosisCode,
            treatment_date: getFormattedDate(this.state.treatmentDate),
            affected_parts: affectedParts,
            problems: problems,
            diagnosed_by: diagnosedBy,
            instruction: instruction,
            next_treatment_date: getFormattedDate(this.state.nextTreatmentDate),
          };

          saveAnimalDiagnosisRecord(obj)
            .then((response) => {
              let id = response.data.id;
              let animalDiagnosis = this.context.animalDiagnosis;
              let index = animalDiagnosis.findIndex(
                (element) => element.id === id
              );

              let dataObj = {
                id: id,
                diagnosis_code: this.state.diagnosisCode,
                diagnosis_name: this.state.diagnosisName,
                treatment_date: getFormattedDate(this.state.treatmentDate),
                next_treatment_date: getFormattedDate(
                  this.state.nextTreatmentDate
                ),
              };

              if (index > -1) {
                animalDiagnosis[index] = dataObj;
              } else {
                animalDiagnosis.unshift(dataObj);
              }

              this.context.setAnimalDiagnosis(animalDiagnosis);
              this.setState({ showLoader: false });
              this.gotoBack();
            })
            .catch((error) => console.log(error));
        }
      }
    );
  };

  render = () => (
    <Container>
      <Header
        leftIconName={"arrow-back"}
        title={"Medical Record"}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
      <View style={styles.container}>
        <ScrollView ref={this.scrollViewRef}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.toggleDiagnosisMenu}
            style={[
              styles.fieldBox,
              this.state.isDiagnosisNameValidateionFailed
                ? styles.errorFieldBox
                : null,
            ]}
          >
            <Text style={styles.labelName}>Diagnosis:</Text>
            <TextInput
              value={this.state.diagnosisName}
              editable={false}
              style={styles.textfield}
              placeholder="Select Diagnosis Name"
            />
          </TouchableOpacity>

          <DatePicker
            onPress={this.showTreatmentDatepicker}
            show={this.state.isTreatmentDatepickerOpen}
            onChange={this.onTreatmentDateChange}
            date={this.state.treatmentDate}
            mode={"date"}
            label={"Treatment Date:"}
          />

          <View
            style={[
              styles.fieldBox,
              this.state.isAffectedPartsValidateionFailed
                ? styles.errorFieldBox
                : null,
            ]}
          >
            <Text style={styles.labelName}>Affected Parts:</Text>
            <TextInput
              value={this.state.affectedParts}
              onChangeText={(affectedParts) => this.setState({ affectedParts })}
              style={styles.textfield}
              autoCompleteType="off"
              autoCapitalize="words"
            />
          </View>

          <View
            style={[
              styles.fieldBox,
              this.state.isProblemsValidateionFailed
                ? styles.errorFieldBox
                : null,
            ]}
          >
            <Text style={styles.labelName}>Problems:</Text>
            <TextInput
              value={this.state.problems}
              onChangeText={(problems) => this.setState({ problems })}
              style={styles.textfield}
              autoCompleteType="off"
              autoCapitalize="words"
            />
          </View>

          <View
            style={[
              styles.fieldBox,
              this.state.isInstructionValidateionFailed
                ? styles.errorFieldBox
                : null,
            ]}
          >
            <Text style={styles.labelName}>Instruction:</Text>
            <TextInput
              value={this.state.instruction}
              onChangeText={(instruction) => this.setState({ instruction })}
              style={styles.textfield}
              autoCompleteType="off"
              autoCapitalize="words"
            />
          </View>

          <View
            style={[
              styles.fieldBox,
              this.state.isDiagnosedByValidateionFailed
                ? styles.errorFieldBox
                : null,
            ]}
          >
            <Text style={styles.labelName}>Diagnosed By:</Text>
            <TextInput
              value={this.state.diagnosedBy}
              onChangeText={(diagnosedBy) => this.setState({ diagnosedBy })}
              style={styles.textfield}
              autoCompleteType="off"
              autoCapitalize="words"
            />
          </View>

          <DatePicker
            onPress={this.showNextTreatmentDatepicker}
            show={this.state.isNextTreatmentDatePickerOpen}
            onChange={this.onNextTreatmentDateChange}
            date={this.state.nextTreatmentDate}
            mode={"date"}
            label={"Next Treatment Date:"}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={this.saveMedicalRecord}
          >
            <Text style={styles.textWhite}>Save Details</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ModalMenu
        visible={this.state.isDiagnosisMenuOpen}
        closeAction={this.toggleDiagnosisMenu}
      >
        {this.state.diagnosisArr.map((v, i) => (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.item}
            onPress={this.setDiagnosisData.bind(this, v)}
            key={v.id.toString()}
          >
            <Text style={styles.itemtitle}>{v.name}</Text>
          </TouchableOpacity>
        ))}
      </ModalMenu>

      <OverlayLoader visible={this.state.showLoader} />
    </Container>
  );
}

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		padding: 8,
// 	},
// 	fieldBox: {
// 		width: "100%",
// 		overflow: "hidden",
// 		flexDirection: "row",
// 		padding: 5,
// 		borderRadius: 3,
// 		borderColor: "#ddd",
// 		borderWidth: 1,
// 		backgroundColor: "#fff",
// 		height: 50,
// 		justifyContent: "space-between",
// 		marginBottom: 5,
// 		marginTop: 5,
// 		shadowColor: "#999",
// 		shadowOffset: {
// 			width: 0,
// 			height: 1,
// 		},
// 		shadowOpacity: 0.22,
// 		shadowRadius: 2.22,
// 		elevation: 3,
// 	},
// 	textfield: {
// 		backgroundColor: "#fff",
// 		height: 40,

// 		fontSize: 12,
// 		color: Colors.textColor,
// 		textAlign: "right",
// 		width: "60%",
// 		padding: 5,
// 	},
// 	button: {
// 		alignItems: "center",
// 		backgroundColor: Colors.primary,
// 		padding: 10,
// 		shadowColor: "#000",
// 		shadowOffset: {
// 			width: 0,
// 			height: 2,
// 		},
// 		shadowOpacity: 0.23,
// 		shadowRadius: 2.62,
// 		elevation: 4,
// 		borderRadius: 20,
// 		color: "#fff",
// 		marginVertical: 10,
// 	},
// 	textWhite: {
// 		color: "#fff",
// 		fontWeight: "bold",
// 	},
// 	labelName: {
// 		color: Colors.textColor,
// 		lineHeight: 40,
// 		fontSize: 14,
// 		paddingLeft: 4,
// 	},
// 	textInputIcon: {
// 		position: "absolute",
// 		bottom: 14,
// 		right: 10,
// 		marginLeft: 8,
// 		color: "#0482ED",
// 		zIndex: 99,
// 	},
// 	item: {
// 		height: 35,
// 		backgroundColor: "#00b386",
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	itemtitle: {
// 		color: "#fff",
// 		textAlign: "center",
// 		fontSize: 18,
// 	},
// 	errorFieldBox: {
// 		borderWidth: 1,
// 		borderColor: Colors.tomato,
// 	},
// });
