import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";
import Colors from "../../config/colors";
import ModalMenu from "../../component/ModalMenu";

export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            animalID: '',
            incidentType: '',
            incidentDescription: '',
            priority: undefined,
            reportedBy: '',
            solution: '',
            toBeClosedBy: '',
            currentStatus: '',
            animalIDValidationFailed: undefined,
            incidentTypeValidationFailed: undefined,
            incidentDescriptionValidationFailed: undefined,
            priorityValidationFailed: undefined,
            reportedByValidationFailed: undefined,
            solutionValidationFailed: undefined,
            toBeClosedByValidationFailed: undefined,
            currentStatusValidationFailed: undefined,
            isPriorityMenuOpen: false,
        };

        this.scrollViewRef = React.createRef();
    }

    togglePriorityMenuVisible = () => {
        this.setState({isPriorityMenuOpen: !this.state.isPriorityMenuOpen});
    };

    setPriority = (v) => {
        this.setState({priority: v.toString(), isPriorityMenuOpen: false})
    };

    scrollViewScrollTop = () => {
        this.scrollViewRef.current.scrollTo({x: 0, y: 0, animated: true});
    };

    saveIncidentProfileData = () => {
        let { animalID, incidentType, incidentDescription, priority, reportedBy, solution, toBeClosedBy, currentStatus } = this.state;
        this.setState({
            animalIDValidationFailed: undefined,
            incidentTypeValidationFailed: undefined,
            incidentDescriptionValidationFailed: undefined,
            priorityValidationFailed: undefined,
            reportedByValidationFailed: undefined,
            solutionValidationFailed: undefined,
            toBeClosedByValidationFailed: undefined,
            currentStatusValidationFailed: undefined
        }, () => {
            if(animalID.trim().length === 0){
                this.setState({animalIDValidationFailed: true});
                this.scrollViewScrollTop();
            }
            else if(incidentType.trim().length === 0){
                this.setState({incidentTypeValidationFailed: true});
                this.scrollViewScrollTop();
            }
            else if(incidentDescription.trim().length === 0){
                this.setState({incidentDescriptionValidationFailed: true});
                this.scrollViewScrollTop();
            }
            else if(typeof priority === "undefined"){
                this.setState({priorityValidationFailed: true});
                this.scrollViewScrollTop();
            }
            else if(reportedBy.trim().length === 0){
                this.setState({reportedByValidationFailed: true});
            }
            else if(solution.trim().length === 0){
                this.setState({solutionValidationFailed: true});
            }
            else if(toBeClosedBy.trim().length === 0){
                this.setState({toBeClosedByValidationFailed: true});
            }
            else if(currentStatus.trim().length === 0){
                this.setState({currentStatusValidationFailed: true});
            }
            else{
                alert('OK');
            }
        });
    };

    render = () => (
        <ScrollView ref={this.scrollViewRef}>
            <View style={styles.container}>
                <View
                    style={[
                        styles.fieldBox,
                        this.state.animalIDValidationFailed ? styles.errorFieldBox : null
                    ]}
                >
                    <Text style={styles.labelName}>Animal ID :</Text>
                    <TextInput
                        value={this.state.animalID}
                        onChangeText={(animalID) => this.setState({animalID})}
                        style={styles.textfield}
                        placeholder=""
                    />
                </View>

                <View
                    style={[
                        styles.fieldBox,
                        this.state.incidentTypeValidationFailed ? styles.errorFieldBox : null
                    ]}
                >
                    <Text style={styles.labelName}>Incident Type :</Text>
                    <TextInput
                        value={this.state.incidentType}
                        onChangeText={(incidentType) => this.setState({incidentType})}
                        style={styles.textfield}
                        placeholder=""
                    />
                </View>

                <View
                    style={[
                        styles.fieldBox,
                        {flexDirection: "column", height: 130},
                        this.state.incidentDescriptionValidationFailed ? styles.errorFieldBox : null
                    ]}
                >
                    <Text style={styles.labelName}>Incident Description :</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={10}
                        value={this.state.incidentDescription}
                        onChangeText={(incidentDescription) => this.setState({incidentDescription})}
                        style={{
                            height: 130,
                            textAlignVertical: "top",
                        }}
                    />
                </View>

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={this.togglePriorityMenuVisible}
                    style={[
                        styles.fieldBox,
                        this.state.priorityValidationFailed ? styles.errorFieldBox : null
                    ]}
                >
                    <Text style={styles.labelName}>Priority :</Text>
                    <TextInput
                        editable={false}
                        value={this.state.priority}
                        style={styles.textfield}
                    />
                </TouchableOpacity>

                <View
                    style={[
                        styles.fieldBox,
                        this.state.reportedByValidationFailed ? styles.errorFieldBox : null
                    ]}
                >
                    <Text style={styles.labelName}>Reported By :</Text>
                    <TextInput
                        value={this.state.reportedBy}
                        onChangeText={(reportedBy) => this.setState({reportedBy})}
                        style={styles.textfield}
                        placeholder=""
                    />
                </View>

                <View
                    style={[
                        styles.fieldBox,
                        this.state.solutionValidationFailed ? styles.errorFieldBox : null
                    ]}
                >
                    <Text style={styles.labelName}>Solution :</Text>
                    <TextInput
                        value={this.state.solution}
                        onChangeText={(solution) => this.setState({solution})}
                        style={styles.textfield}
                        placeholder=""
                    />
                </View>

                <View
                    style={[
                        styles.fieldBox,
                        this.state.toBeClosedByValidationFailed ? styles.errorFieldBox : null
                    ]}
                >
                    <Text style={styles.labelName}>To be closed by :</Text>
                    <TextInput
                        value={this.state.toBeClosedBy}
                        onChangeText={(toBeClosedBy) => this.setState({toBeClosedBy})}
                        style={styles.textfield}
                        placeholder=""
                    />
                </View>

                <View
                    style={[
                        styles.fieldBox,
                        this.state.currentStatusValidationFailed ? styles.errorFieldBox : null
                    ]}
                >
                    <Text style={styles.labelName}>Current Status :</Text>
                    <TextInput
                        value={this.state.currentStatus}
                        onChangeText={(currentStatus) => this.setState({currentStatus})}
                        style={styles.textfield}
                        placeholder=""
                    />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={this.saveIncidentProfileData}
                >
                    <Text style={styles.textWhite}>Save Details</Text>
                </TouchableOpacity>

                <ModalMenu
                    visible={this.state.isPriorityMenuOpen}
                    closeAction={this.togglePriorityMenuVisible}
                >
                    {
                    [1, 2, 3, 4, 5].map((v, i) =>  (
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.item}
                            onPress={this.setPriority.bind(this, v)}
                            key={i}
                        >
                            <Text style={styles.itemtitle}>{v}</Text>
                        </TouchableOpacity>
                    ))
                    }
                </ModalMenu>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 8,
    },
    fieldBox: {
      width: "100%",
      overflow: "hidden",
      flexDirection: "row",
      padding: 5,
      borderRadius: 3,
      backgroundColor: "#fff",
      height: 50,
      justifyContent: "space-between",
      marginBottom: 5,
      marginTop: 5,
      shadowColor: "#999",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    textfield: {
      backgroundColor: "#fff",
      height: 40,
      
      fontSize: 14,
      color: "#444",
      textAlign: "right",
      width: "50%",
      padding: 5,
    },
    labelName: {
      color: "#333",
      lineHeight: 40,
      fontSize: 14,
      paddingLeft: 4,
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
      marginTop: 10,
    },
    textWhite: {
      color: "#fff",
      fontWeight: "bold",
    },
    item:{
        height: 35,
        backgroundColor: '#00b386',
        alignItems: "center",
        justifyContent: "center"
    },
    itemtitle:{
        color: '#fff',
        textAlign: "center",
        fontSize: 18,
    },
    errorFieldBox: {
      borderWidth: 1,
      borderColor: Colors.tomato
    }
  });