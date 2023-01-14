import React, { Component } from 'react'
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Header, MultiSelectDropdown } from '../../component';
import Header2 from '../../component/Header2';
import { Colors } from '../../config';
import AppContext from '../../context/AppContext';
import { getAnimalSections } from '../../services/APIServices';
import { ListUsers } from '../../utils/api';
import { DateTimePickerModal } from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { createFeedConfig } from '../../services/AllocationServices';
import CustomCheckbox from '../../component/tasks/AddTodo/CustomCheckBox';
import styles from './Styles'
import globalStyles from '../../config/Styles'


export default class FeedDetails extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            time: new Date(),
            show: false,
            mode:'',
            today: new Date(),
            status:false,

        }
    }

    showDatePicker = (mode) => {
        this.setState({ show: true , mode:mode })
      };
    
      handleConfirm = (selectDate) => {
        if(this.state.mode=='date'){
          this.setState({
            today: moment(selectDate).format()
          })
        }else{
          this.setState({
            time: selectDate
          })
        }
        this.hideDatePicker();
      }
    
      hideDatePicker = () => {
        this.setState({ show: false })
      }

      handleSubmit = () => {
        this.setState({isLoading: true})
        let {feed_id,feed_name,subCat_id,inChargeData}=this.props.route.params;
        let user_id= this.context.userDetails.id
        let users_data= JSON.stringify(inChargeData.users)
        let users_ids= inChargeData.users.map((user)=>{
          return user.id
        })
        users_ids=users_ids.join(',')
        let obj={
            allocated_to: users_data,
            approval: 0,
            approve_anyone: 1,
            assign_level_1: users_data,
            category_id: feed_id,
            created_by: user_id,
            description: inChargeData.name+ '-' +feed_name+ '('+inChargeData.id+'_'+feed_id+')',
            instructions: "",
            is_photo_proof: 1,
            name: inChargeData.name+ '-' +feed_name,
            notification_after_task:  users_data,
            notofication: undefined,
            point: "0",
            priority: "Medium",
            reminder: "No Reminder",
            schedule_end: moment(this.state.today).add(1,'days').format('YYYY-MM-DD'),
            schedule_start: moment(this.state.today).format('YYYY-MM-DD'),
            schedule_time: moment(this.state.time).format('HH:mm'),
            schedule_type: "daily",
            status: "pending",
            sub_tasks: undefined,
            task_related_to: "Section",
            task_related_to_id: inChargeData.id,
            task_related_to_name: inChargeData.name,
            task_type: "Individual",
            users: users_ids,
            task_status: Number(this.state.status)
          }
          console.log("./.................................",obj)
          return
          createFeedConfig(obj).then((res)=>{
            if(res.is_success){
              this.setState({isLoading: false})
              alert("Created Successfully !!")
              this.props.navigation.navigate('WorkAllocation');
            }else{
              this.setState({isLoading: false})
              alert("Something went wrong !!")
            }
          }).catch((err)=>{
            this.setState({isLoading: false})
            console.log(err)
          })
      }
 
      gotoBack = () => {
        this.props.navigation.goBack();
      };

      calculateDate = (type) => {
        let today= this.state.today;
        if(type=='add'){
            this.setState({today:moment(today).add(1,'days').format()})
        }else{
            this.setState({today:moment(today).subtract(1,'days').format()})
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Header
                  title={"Create Feed Config"}
                />
                <View style={styles.body}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={globalStyles.width80}
                    >
                        <View style={[styles.fieldBox]}>
                            <Text style={styles.labelName}>Select Time : </Text>
                            <TouchableOpacity onPress={() => { this.showDatePicker("time") }} style={[styles.textfield]}>
                                <Text style={[styles.dateField]}>{moment(this.state.time).format("LT")}</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                        <CustomCheckbox
                            handler={() => { this.setState({ status: !this.state.status }) }}
                            value={this.state.status}
                            label={"Task Status"}
                            leftTextStyle={styles.dateField}
                        />
                        </View>

                <View style={styles.buttonsContainer}>
                {this.state.isLoading ? <ActivityIndicator size={25} color={Colors.primary}/> :
                  <TouchableOpacity activeOpacity={1} onPress={this.handleSubmit}>
                    <Text style={[styles.buttonText, styles.saveBtnText]}>SAVE</Text>
                  </TouchableOpacity>
                }
                  <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
                    <Text style={[styles.buttonText, styles.exitBtnText]}>EXIT</Text>
                  </TouchableOpacity>
                </View>
                    </ScrollView>
                </View>
                <DateTimePickerModal
                    mode={this.state.mode}
                    display={Platform.OS == 'ios' ? 'inline' : 'default'}
                    isVisible={this.state.show}
                    onConfirm={this.handleConfirm}
                    onCancel={this.hideDatePicker}
                />
            </SafeAreaView>
        )
    }
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff'
//     },
//     body: {
//         flex: 9,
//         padding: 10
//     },
//     fieldBox: {
//         alignItems: 'center',
//         width: "100%",
//         overflow: "hidden",
//         flexDirection: "row",
//         padding: 5,
//         borderRadius: 3,
//         borderColor: "#ddd",
//         borderWidth: 1,
//         backgroundColor: "#fff",
//         height: 'auto',
//         justifyContent: "space-between",
//         marginBottom: 5,
//         marginTop: 5,
//         // shadowColor: "#999",
//         // shadowOffset: {
//         // 	width: 0,
//         // 	height: 1,
//         // },
//         // shadowOpacity: 0.22,
//         // shadowRadius: 2.22,
//         // elevation: 3,
//     },
//     labelName: {
//         color: Colors.textColor,
//         lineHeight: 40,
//         fontSize: 14,
//         paddingLeft: 4,
//         height: 'auto',
//       },
//     dateField:{
//         backgroundColor: "#fff",
//         height: 'auto',
        
//         fontSize: 12,
//         color: Colors.textColor,
//         textAlign: "right",
//         padding: 5,
//       },
//       buttonsContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-evenly",
//         marginVertical: 30,
//       },
//       buttonText: {
//         fontSize: 18,
//         fontWeight: "bold",
//       },
//       saveBtnText: {
//         color: Colors.primary,
//       },
//       exitBtnText: {
//         color: Colors.activeTab,
//       },
// });
