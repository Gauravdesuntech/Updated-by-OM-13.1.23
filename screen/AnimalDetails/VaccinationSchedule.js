import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView
} from "react-native";
import { Container } from "native-base";
import { Header, DatePicker } from "../../component";
import Colors from "../../config/colors";
import ModalMenu from "../../component/ModalMenu";
import styles from "../../config/Styles";

export default class VaccinationSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: [
        {
          id: 1,
          name: "Orally / Pareneteral"
        },
        {
          id: 2,
          name: "Route 2"
        },
        {
          id: 3,
          name: "Route 3"
        }
      ],
      show: false,
      date: new Date(),
      vaccineName: '',
      frequency: '',
      dosage: '',
      routeID: undefined,
      routeName: undefined,
      description: '',
      isRouteMenuOpen: false,
      isVaccineNameValidationFailed: undefined,
      isFrequencyValidationFailed: undefined,
      isDosageValidationFailed: undefined,
      isRouteValidationFailed: undefined,
      isDescriptionValidationFailed: undefined,
    };
    this.scrollViewRef = React.createRef();
  }

  onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.date;
    this.setState({
      show: Platform.OS === "ios",
      date: currentDate
    })
  };

  showDatepicker = () => {
    this.setState({show: true});
  };

  gotoBack = () => this.props.navigation.goBack();

  toggleRouteMenu = () => this.setState({isRouteMenuOpen : !this.state.isRouteMenuOpen});

  setRouteData = (v) => {
    this.setState({
      routeID: v.id,
      routeName: v.name,
      isRouteMenuOpen: false
    });
  };

  scrollViewScrollTop = () => {
    this.scrollViewRef.current.scrollTo({x: 0, y: 0, animated: true});
  };

  saveVaccineSchedule = () => {
    this.setState({
      isVaccineNameValidationFailed: undefined,
      isFrequencyValidationFailed: undefined,
      isDosageValidationFailed: undefined,
      isRouteValidationFailed: undefined,
      isDescriptionValidationFailed: undefined
    }, () => {
      let { vaccineName, frequency, dosage, routeID, description } = this.state;
      if(vaccineName.trim().length === 0){
        this.setState({isVaccineNameValidationFailed: true});
        this.scrollViewScrollTop();
      }
      else if(frequency.trim().length === 0){
        this.setState({isFrequencyValidationFailed: true});
        this.scrollViewScrollTop();
      }
      else if(dosage.trim().length === 0){
        this.setState({isDosageValidationFailed: true});
        this.scrollViewScrollTop();
      }
      else if(typeof routeID === "undefined"){
        this.setState({isRouteValidationFailed: true});
        this.scrollViewScrollTop();
      }
      else if(description.trim().length === 0){
        this.setState({isDescriptionValidationFailed: true});
      }
      else{
        alert('OK');
      }
    });
  }

  render = () => (
    <Container>
      <Header
        leftIconName={"arrow-back"}
        title={"Vaccine Schedule"}
        leftIconShow={true}
        rightIconShow={false}
        leftButtonFunc={this.gotoBack}
      />
      <View style={styles.container}>
        <ScrollView ref={this.scrollViewRef}>
          <View
            style={[
              styles.fieldBox,
              this.state.isVaccineNameValidationFailed ? styles.errorFieldBox : null
            ]}
          >
            <Text style={styles.labelName}>Vaccine Name: </Text>
            <TextInput
              value={this.state.vaccineName}
              onChangeText={(vaccineName) => this.setState({vaccineName})}
              style={styles.textfield}
              placeholder=""
            />
          </View>

          <View
            style={[
              styles.fieldBox,
              this.state.isFrequencyValidationFailed ? styles.errorFieldBox : null
            ]}
          >
            <Text style={styles.labelName}>Frequency: </Text>
            <TextInput
              value={this.state.frequency}
              onChangeText={(frequency) => this.setState({frequency})}
              style={styles.textfield}
              placeholder=""
            />
          </View>

          <View
            style={[
              styles.fieldBox,
              this.state.isDosageValidationFailed ? styles.errorFieldBox : null
            ]}
          >
            <Text style={styles.labelName}>Dosage: </Text>
            <TextInput
              value={this.state.dosage}
              onChangeText={(dosage) => this.setState({dosage})}
              style={styles.textfield}
              placeholder=""
            />
          </View>

          <TouchableOpacity
            activeOpacity={1}
            onPress={this.toggleRouteMenu}
            style={[
              styles.fieldBox,
              this.state.isRouteValidationFailed ? styles.errorFieldBox : null
            ]}
          >
            <Text style={styles.labelName}>Select Route:</Text>
            <TextInput
              value={this.state.routeName}
              editable={false}
              style={styles.textfield}
            />
          </TouchableOpacity>

          <DatePicker
            onPress={this.showDatepicker}
            show={this.state.show}
            onChange={this.onChangeDate}
            date={this.state.date}
            mode={"date"}
            label={'Starting From:'}
          />

          <View
            style={[
              styles.fieldBox,
              this.state.isDescriptionValidationFailed ? styles.errorFieldBox : null
            ]}
          >
            <Text style={styles.labelName}>Description: </Text>
            <TextInput
              value={this.state.description}
              onChangeText={(description) => this.setState({description})}
              style={styles.textfield}
              placeholder=""
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={this.saveVaccineSchedule}
          >
            <Text style={styles.textWhite}>Save Details</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ModalMenu
        visible={this.state.isRouteMenuOpen}
        closeAction={this.toggleRouteMenu}
      >
        {
          this.state.routes.map((v, i) =>  (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.item}
              onPress={this.setRouteData.bind(this, v)}
              key={v.id.toString()}
            >
              <Text style={styles.itemtitle}>{v.name}</Text>
            </TouchableOpacity>
          ))
        }
      </ModalMenu>
    </Container>
  );
}

/*export default function VaccineSchedule() {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <Content>
      <View style={styles.container}>
        <View style={styles.fieldBox}>
          <Text style={styles.labelName}>Vaccine Name: </Text>
          <TextInput style={styles.textfield} />
        </View>

        <View style={styles.fieldBox}>
          <Text style={styles.labelName}>Frequency: </Text>
          <TextInput style={styles.textfield} />
        </View>

        <View style={styles.fieldBox}>
          <Text style={styles.labelName}>Dosage: </Text>
          <TextInput style={styles.textfield} />
        </View>

        <View style={styles.fieldBox}>
          <Text style={styles.labelName}>Select Route: </Text>
          <TextInput style={styles.textfield} />
        </View>

        <DatePicker
          onPress={showDatepicker}
          show={show}
          onChange={onChange}
          date={date}
          mode={"date"}
          label={'Starting From:'}
        />

        <View style={styles.fieldBox}>
          <Text style={styles.labelName}>Description: </Text>
          <TextInput style={styles.textfield} />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            alert("hi");
          }}
        >
          <Text style={styles.textWhite}>Save Details</Text>
        </TouchableOpacity>
      </View>
    </Content>
  );
}*/

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 8,
//   },
//   fieldBox: {
//     width: "100%",
//     overflow: "hidden",
//     flexDirection: "row",
//     padding: 5,
//     borderRadius: 3,
//     borderColor: "#ddd",
//     borderWidth: 1,
//     backgroundColor: "#fff",
//     height: 50,
//     justifyContent: "space-between",
//     marginBottom: 5,
//     marginTop: 5,
//     shadowColor: "#999",
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//   },
//   textfield: {
//     backgroundColor: "#fff",
//     height: 40,
    
//     fontSize: 12,
//     color: "#000",
//     textAlign: "right",
//     width: "60%",
//     padding: 5,
//     fontWeight: "bold",
//   },
//   textfielddate: {
//     backgroundColor: "#fff",
//     height: 40,
//     lineHeight: 30,
//     fontSize: 12,
//     color: "#333",
//     textAlign: "left",
//     width: "50%",
//     padding: 5,
//     fontWeight: "bold",
//   },

//   button: {
//     alignItems: "center",
//     backgroundColor: Colors.primary,
//     padding: 10,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.23,
//     shadowRadius: 2.62,
//     elevation: 4,
//     borderRadius: 20,
//     color: "#fff",
//     marginVertical: 10,
//   },
//   textWhite: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   labelName: {
//     color: "#333",
//     lineHeight: 40,
//     fontSize: 14,
//     paddingLeft: 4,
//   },
//   textInputIcon: {
//     position: "absolute",
//     bottom: 14,
//     right: 10,
//     marginLeft: 8,
//     color: "#0482ED",
//     zIndex: 99,
//   },
//   item:{
//     height: 35,
//     backgroundColor: '#00b386',
//     alignItems: "center",
//     justifyContent: "center"
//   },
//   itemtitle:{
//     color: '#fff',
//     textAlign: "center",
//     fontSize: 18,
//   },
//   errorFieldBox: {
//     borderWidth: 1,
//     borderColor: Colors.tomato
//   },
// });
