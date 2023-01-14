import React from "react";
import {
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableOpacity,
	ScrollView,
	Image
} from "react-native";
import { Container } from "native-base";
import {
	Header,
	OverlayLoader,
    DatePicker,
	InputDropdown,
} from "../../component";


import {
    getUserProfile,
    saveUserProfile,
} from "../../services/UserManagementServices";
import Colors from "../../config/colors";
import Configs from "../../config/Configs";
import AppContext from "../../context/AppContext";
import { getFormattedDate, convertDate } from "../../utils/Util";
import { Ionicons } from "@expo/vector-icons";

export default class EditUserProfile extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            user_id: props.route.params.hasOwnProperty("id")
                ? props.route.params.id
                : 0,
            dob: "",
            sex: "",
            height: "",
            weight: "",
            blood_group: "",
            martial_status: "",
            aadhaar_card: "",
            pan_number: "",
            address: "",
            state: "",
            city: "",
            pincode: "",
            personal_email_id: "",
            mobile_number: "",
            family_number: "",
            family_name: "",
            family_relation: "",
            friends_number: "",
            friends_name: "",
            nominee_details_for_insurance: "",
            father_name: "",
            father_dob: "",
            mother_name: "",
            mother_dob: "",
            school_institute_name: "",
            school_city: "",
            school_passout_year: "",
            school_percentage: "",
            college_institute_name: "",
            college_city: "",
            college_passout_year: "",
            college_percentage: "",
            degree_institute_name: "",
            degree_city: "",
            degree_passout_year: "",
            degree_percentage: "",
            pg_institute_name: "",
            pg_city: "",
            pg_passout_year: "",
            pg_percentage: "",
            work_exp_company: "",
            work_exp_total_years: "",
            work_exp_designation: "",
            work_exp_industry: "",
            uan_number: "",
            ref_by_to_lset: "",
            last_drawn_salary_proof: "",
            health_issue_or_disability: "",
            bank_name: "",
            bank_ac_number: "",
            bank_branch_name: "",
            bank_ifsc_code: "",
            bank_address: "",

            showLoader: true,
            isDobDatepickerOpen: false,
            isFatherDobDatepickerOpen: false,
            isMotherDobDatepickerOpen: false,
            fullNameValidationFailed: false,
            mobileValidationFailed: false,
            emailValidationFailed: false,
            usernameValidationFailed: false,
            passwordValidationFailed: false,
            actionTypesValidationFailed: false,
            animalClassValidationFailed: false,
            animalCategoryValidationFailed: false,
            animalSubCategoryValidationFailed: false,
            animalCommonNameValidationFailed: false,
            selectedDesignationValidationFailed: false,
            selectedDepartmentValidationFailed: false,
            isDeptMenuOpen: false,
            isDesgMenuOpen: false,
            imageData: undefined,
            isGenderMenuOpen: false,
            isBloodGroupMenuOpen: false
        };

        this.formScrollViewRef = React.createRef();
    }

    componentDidMount = () => {
        if (parseInt(this.state.user_id) > 0) {
            getUserProfile(this.state.user_id)
            .then( userData => {
                if (userData) {
                    // set state here
                    let stateObj = {
                        showLoader: false,
                        dob: convertDate(userData.dob),
                        sex: userData.sex,
                        height: userData.height,
                        weight: userData.weight,
                        blood_group: userData.blood_group,
                        martial_status: userData.martial_status,
                        aadhaar_card: userData.aadhaar_card,
                        pan_number: userData.pan_number,
                        address: userData.address,
                        state: userData.state,
                        city: userData.city,
                        pincode: userData.pincode,
                        personal_email_id: userData.personal_email_id,
                        mobile_number: userData.mobile_number,
                        family_number: userData.family_number,
                        family_name: userData.family_name,
                        family_relation: userData.family_relation,
                        friends_number: userData.friends_number,
                        friends_name: userData.friends_name,
                        nominee_details_for_insurance: userData.nominee_details_for_insurance,
                        father_name: userData.father_name,
                        father_dob: convertDate(userData.father_dob),
                        mother_name: userData.mother_name,
                        mother_dob: convertDate(userData.mother_dob),
                        school_institute_name: userData.school_institute_name,
                        school_city: userData.school_city,
                        school_passout_year: userData.school_passout_year,
                        school_percentage: userData.school_percentage,
                        college_institute_name: userData.college_institute_name,
                        college_city: userData.college_city,
                        college_passout_year: userData.college_passout_year,
                        college_percentage: userData.college_percentage,
                        degree_institute_name: userData.degree_institute_name,
                        degree_city: userData.degree_city,
                        degree_passout_year: userData.degree_passout_year,
                        degree_percentage: userData.degree_percentage,
                        pg_institute_name: userData.pg_institute_name,
                        pg_city: userData.pg_city,
                        pg_passout_year: userData.pg_passout_year,
                        pg_percentage: userData.pg_percentage,
                        work_exp_company: userData.work_exp_company,
                        work_exp_total_years: userData.work_exp_total_years,
                        work_exp_designation: userData.work_exp_designation,
                        work_exp_industry: userData.work_exp_industry,
                        uan_number: userData.uan_number,
                        ref_by_to_lset: userData.ref_by_to_lset,
                        last_drawn_salary_proof: userData.last_drawn_salary_proof,
                        health_issue_or_disability: userData.health_issue_or_disability,
                        bank_name: userData.bank_name,
                        bank_ac_number: userData.bank_ac_number,
                        bank_branch_name: userData.bank_branch_name,
                        bank_ifsc_code: userData.bank_ifsc_code,
                        bank_address: userData.bank_address
                    }
                    this.setState(stateObj);
                } else {
                    this.setState({showLoader: false});
                }
            })
        }
    };

    gotoBack = () => this.props.navigation.goBack();

    scrollToScrollViewTop = () =>
        this.formScrollViewRef.current.scrollTo({
            x: 0,
            y: 0,
            animated: true,
    });

    setGender = (v) => {
		this.setState({
			sex: v.value,
			isGenderMenuOpen: false,
		});
	};

    toggleGenderMenu = () => this.setState({isGenderMenuOpen: !this.state.isGenderMenuOpen});

    setBloodGroup = (v) => {
        this.setState({
			blood_group: v.value,
			isBloodGroupMenuOpen: false,
		});
    }

    toggleBloodGroupMenu = () => this.setState({isBloodGroupMenuOpen: !this.state.isBloodGroupMenuOpen})

    showDatepicker = () => this.setState({ isDobDatepickerOpen: true });

    onChangeDobDate = (event, selectedDate) => {
		this.setState({
			isDobDatepickerOpen: false,
			dob: selectedDate
		});
	};

    onChangeFatherDobDate = (event, selectedDate) => {
		this.setState({
			isFatherDobDatepickerOpen: false,
			father_dob: selectedDate
		});
	};

    onChangeMotherDobDate = (event, selectedDate) => {
		this.setState({
			isMotherDobDatepickerOpen: false,
			mother_dob: selectedDate
		});
	};

    saveData = () => {
        // faking validation check
        if(true) {
            this.setState({ showLoader: true });
            let userData = {
                user_id: this.state.user_id,
                dob: getFormattedDate(this.state.dob),
                sex: this.state.sex,
                height: this.state.height,
                weight: this.state.weight,
                blood_group: this.state.blood_group,
                martial_status: this.state.martial_status,
                aadhaar_card: this.state.aadhaar_card,
                pan_number: this.state.pan_number,
                address: this.state.address,
                state: this.state.state,
                city: this.state.city,
                pincode: this.state.pincode,
                personal_email_id: this.state.personal_email_id,
                mobile_number: this.state.mobile_number,
                family_number: this.state.family_number,
                family_name: this.state.family_name,
                family_relation: this.state.family_relation,
                friends_number: this.state.friends_number,
                friends_name: this.state.friends_name,
                nominee_details_for_insurance: this.state.nominee_details_for_insurance,
                father_name: this.state.father_name,
                father_dob: getFormattedDate(this.state.father_dob),
                mother_name: this.state.mother_name,
                mother_dob: getFormattedDate(this.state.mother_dob),
                school_institute_name: this.state.school_institute_name,
                school_city: this.state.school_city,
                school_passout_year: this.state.school_passout_year,
                school_percentage: this.state.school_percentage,
                college_institute_name: this.state.college_institute_name,
                college_city: this.state.college_city,
                college_passout_year: this.state.college_passout_year,
                college_percentage: this.state.college_percentage,
                degree_institute_name: this.state.degree_institute_name,
                degree_city: this.state.degree_city,
                degree_passout_year: this.state.degree_passout_year,
                degree_percentage: this.state.degree_percentage,
                pg_institute_name: this.state.pg_institute_name,
                pg_city: this.state.pg_city,
                pg_passout_year: this.state.pg_passout_year,
                pg_percentage: this.state.pg_percentage,
                work_exp_company: this.state.work_exp_company,
                work_exp_total_years: this.state.work_exp_total_years,
                work_exp_designation: this.state.work_exp_designation,
                work_exp_industry: this.state.work_exp_industry,
                uan_number: this.state.uan_number,
                ref_by_to_lset: this.state.ref_by_to_lset,
                last_drawn_salary_proof: this.state.last_drawn_salary_proof,
                health_issue_or_disability: this.state.health_issue_or_disability,
                bank_name: this.state.bank_name,
                bank_ac_number: this.state.bank_ac_number,
                bank_branch_name: this.state.bank_branch_name,
                bank_ifsc_code: this.state.bank_ifsc_code,
                bank_address: this.state.bank_address
            }

            saveUserProfile(userData)
            .then( (response) => {
                if(response.success) {
                    this.setState(
                        {
                            showLoader: false,
                        },
                        () => {
                            this.props.navigation.navigate("UserDepartments", {
                                nextScreen: 'AddUser',
                                editScreen: 'AddUser'
                            })
                        }
                    );
                }
            })
            .catch((error) => {
                this.setState({ showLoader: false });
                console.log(error);
            });
        }
    };

    render = () => (
        <Container>
            <Header title="Update User Profile" />
            <View style={styles.container}>
                <ScrollView ref={this.formScrollViewRef}>
                    <View style={styles.inputContainer}>

                        <DatePicker
                            onPress={this.showDatepicker}
                            show={this.state.isDobDatepickerOpen}
                            onChange={this.onChangeDobDate}
                            date={this.state.dob}
                            mode={"date"}
                            label={"Date Of birth"}
                        />

                    </View>

                    <View style={styles.inputContainer}>
                        <InputDropdown
                            label={"Sex"}
                            isMandatory={false}
                            value={this.state.sex}
                            isOpen={this.state.isGenderMenuOpen}
                            items={Configs.ANIMAL_GENDER}
                            openAction={this.toggleGenderMenu}
                            closeAction={this.toggleGenderMenu}
                            setValue={this.setGender}
                            labelStyle={styles.labelName}
                            textFieldStyle={styles.textfield}
                            style={[styles.fieldBox]}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Height</Text>
                        <TextInput
                            value={this.state.height}
                            onChangeText={(height) => this.setState({ height })}
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Weight</Text>
                        <TextInput
                            value={this.state.weight}
                            onChangeText={(weight) => this.setState({ weight })}
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <InputDropdown
                            label={"Blood group"}
                            isMandatory={false}
                            value={this.state.blood_group}
                            isOpen={this.state.isBloodGroupMenuOpen}
                            items={[ 
                                { id: "A+", name: "A+", value: "A+" },
                                { id: "A-", name: "A-", value: "A-" },
                                { id: "B+", name: "B+", value: "B+" },
                                { id: "B-", name: "B-", value: "B-" },
                                { id: "O+", name: "O+", value: "O+" },
                                { id: "O-", name: "O-", value: "O-" },
                                { id: "AB+", name: "AB+", value: "AB+" },
                                { id: "AB-", name: "AB-", value: "AB-" },
                            ]}
                            openAction={this.toggleBloodGroupMenu}
                            closeAction={this.toggleBloodGroupMenu}
                            setValue={this.setBloodGroup}
                            labelStyle={styles.labelName}
                            textFieldStyle={styles.textfield}
                            style={[styles.fieldBox]}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Martial status</Text>
                        <TextInput
                            value={this.state.martial_status}
                            onChangeText={(martial_status) =>
                                this.setState({ martial_status })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Aadhaar card number</Text>
                        <TextInput
                            value={this.state.aadhaar_card}
                            onChangeText={(aadhaar_card) =>
                                this.setState({ aadhaar_card })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Pan number</Text>
                        <TextInput
                            value={this.state.pan_number}
                            onChangeText={(pan_number) =>
                                this.setState({ pan_number })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Address</Text>
                        <TextInput
                            value={this.state.address}
                            onChangeText={(address) =>
                                this.setState({ address })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>State</Text>
                        <TextInput
                            value={this.state.state}
                            onChangeText={(state) => this.setState({ state })}
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>City</Text>
                        <TextInput
                            value={this.state.city}
                            onChangeText={(city) => this.setState({ city })}
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Pincode</Text>
                        <TextInput
                            value={this.state.pincode}
                            onChangeText={(pincode) =>
                                this.setState({ pincode })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Personal email id</Text>
                        <TextInput
                            value={this.state.personal_email_id}
                            onChangeText={(personal_email_id) =>
                                this.setState({ personal_email_id })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Mobile Number</Text>
                        <TextInput
                            value={this.state.mobile_number}
                            onChangeText={(mobile_number) =>
                                this.setState({ mobile_number })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Family number</Text>
                        <TextInput
                            value={this.state.family_number}
                            onChangeText={(family_number) =>
                                this.setState({ family_number })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Family member name</Text>
                        <TextInput
                            value={this.state.family_name}
                            onChangeText={(family_name) =>
                                this.setState({ family_name })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Family relation</Text>
                        <TextInput
                            value={this.state.family_relation}
                            onChangeText={(family_relation) =>
                                this.setState({ family_relation })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Friends number</Text>
                        <TextInput
                            value={this.state.friends_number}
                            onChangeText={(friends_number) =>
                                this.setState({ friends_number })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Friends name</Text>
                        <TextInput
                            value={this.state.friends_name}
                            onChangeText={(friends_name) =>
                                this.setState({ friends_name })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>
                            Nominee details for insurance
                        </Text>
                        <TextInput
                            value={this.state.nominee_details_for_insurance}
                            onChangeText={(nominee_details_for_insurance) =>
                                this.setState({ nominee_details_for_insurance })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Father name</Text>
                        <TextInput
                            value={this.state.father_name}
                            onChangeText={(father_name) =>
                                this.setState({ father_name })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                    
                        <DatePicker
                            onPress={ () => { this.setState({isFatherDobDatepickerOpen : true}) } }
                            show={this.state.isFatherDobDatepickerOpen}
                            onChange={this.onChangeFatherDobDate}
                            date={this.state.father_dob}
                            mode={"date"}
                            label={"Father date of birth"}
                        />

                    </View>



                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Mother Name</Text>
                        <TextInput
                            value={this.state.mother_name}
                            onChangeText={(mother_name) =>
                                this.setState({ mother_name })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        
                        <DatePicker
                            onPress={ () => { this.setState({isMotherDobDatepickerOpen : true}) } }
                            show={this.state.isMotherDobDatepickerOpen}
                            onChange={this.onChangeMotherDobDate}
                            date={this.state.mother_dob}
                            mode={"date"}
                            label={"Mother date of birth"}
                        />



                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>School Institute Name</Text>
                        <TextInput
                            value={this.state.school_institute_name}
                            onChangeText={(school_institute_name) =>
                                this.setState({ school_institute_name })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>School City</Text>
                        <TextInput
                            value={this.state.school_city}
                            onChangeText={(school_city) =>
                                this.setState({ school_city })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>School Passout Year</Text>
                        <TextInput
                            value={this.state.school_passout_year}
                            onChangeText={(school_passout_year) =>
                                this.setState({ school_passout_year })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>School Percentage</Text>
                        <TextInput
                            value={this.state.school_percentage}
                            onChangeText={(school_percentage) =>
                                this.setState({ school_percentage })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>College Institute Name</Text>
                        <TextInput
                            value={this.state.college_institute_name}
                            onChangeText={(college_institute_name) =>
                                this.setState({ college_institute_name })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>College City</Text>
                        <TextInput
                            value={this.state.college_city}
                            onChangeText={(college_city) =>
                                this.setState({ college_city })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>College Passout Year</Text>
                        <TextInput
                            value={this.state.college_passout_year}
                            onChangeText={(college_passout_year) =>
                                this.setState({ college_passout_year })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>College Percentage</Text>
                        <TextInput
                            value={this.state.college_percentage}
                            onChangeText={(college_percentage) =>
                                this.setState({ college_percentage })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Degree Institute Name</Text>
                        <TextInput
                            value={this.state.degree_institute_name}
                            onChangeText={(degree_institute_name) =>
                                this.setState({ degree_institute_name })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Degree City</Text>
                        <TextInput
                            value={this.state.degree_city}
                            onChangeText={(degree_city) =>
                                this.setState({ degree_city })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Degree Passout Year</Text>
                        <TextInput
                            value={this.state.degree_passout_year}
                            onChangeText={(degree_passout_year) =>
                                this.setState({ degree_passout_year })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Degree Percentage</Text>
                        <TextInput
                            value={this.state.degree_percentage}
                            onChangeText={(degree_percentage) =>
                                this.setState({ degree_percentage })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Pg Institute Name</Text>
                        <TextInput
                            value={this.state.pg_institute_name}
                            onChangeText={(pg_institute_name) =>
                                this.setState({ pg_institute_name })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Pg City</Text>
                        <TextInput
                            value={this.state.pg_city}
                            onChangeText={(pg_city) =>
                                this.setState({ pg_city })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Pg Passout Year</Text>
                        <TextInput
                            value={this.state.pg_passout_year}
                            onChangeText={(pg_passout_year) =>
                                this.setState({ pg_passout_year })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Pg Percentage</Text>
                        <TextInput
                            value={this.state.pg_percentage}
                            onChangeText={(pg_percentage) =>
                                this.setState({ pg_percentage })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Work Exp Company</Text>
                        <TextInput
                            value={this.state.work_exp_company}
                            onChangeText={(work_exp_company) =>
                                this.setState({ work_exp_company })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Work Exp Total Years</Text>
                        <TextInput
                            value={this.state.work_exp_total_years}
                            onChangeText={(work_exp_total_years) =>
                                this.setState({ work_exp_total_years })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Work Exp Designation</Text>
                        <TextInput
                            value={this.state.work_exp_designation}
                            onChangeText={(work_exp_designation) =>
                                this.setState({ work_exp_designation })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Work Exp Industry</Text>
                        <TextInput
                            value={this.state.work_exp_industry}
                            onChangeText={(work_exp_industry) =>
                                this.setState({ work_exp_industry })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Uan Number</Text>
                        <TextInput
                            value={this.state.uan_number}
                            onChangeText={(uan_number) =>
                                this.setState({ uan_number })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Ref By To Lset</Text>
                        <TextInput
                            value={this.state.ref_by_to_lset}
                            onChangeText={(ref_by_to_lset) =>
                                this.setState({ ref_by_to_lset })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Last Drawn Salary Proof</Text>
                        <TextInput
                            value={this.state.last_drawn_salary_proof}
                            onChangeText={(last_drawn_salary_proof) =>
                                this.setState({ last_drawn_salary_proof })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>
                            Health Issue Or Disability
                        </Text>
                        <TextInput
                            value={this.state.health_issue_or_disability}
                            onChangeText={(health_issue_or_disability) =>
                                this.setState({ health_issue_or_disability })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Bank Name</Text>
                        <TextInput
                            value={this.state.bank_name}
                            onChangeText={(bank_name) =>
                                this.setState({ bank_name })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Bank Ac Number</Text>
                        <TextInput
                            value={this.state.bank_ac_number}
                            onChangeText={(bank_ac_number) =>
                                this.setState({ bank_ac_number })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Bank Branch Name</Text>
                        <TextInput
                            value={this.state.bank_branch_name}
                            onChangeText={(bank_branch_name) =>
                                this.setState({ bank_branch_name })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Bank Ifsc Code</Text>
                        <TextInput
                            value={this.state.bank_ifsc_code}
                            onChangeText={(bank_ifsc_code) =>
                                this.setState({ bank_ifsc_code })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.name}>Bank Address</Text>
                        <TextInput
                            value={this.state.bank_address}
                            onChangeText={(bank_address) =>
                                this.setState({ bank_address })
                            }
                            style={styles.inputText}
                            autoCompleteType="off"
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.button}
                            onPress={this.saveData}
                        >
                            <Text style={styles.saveBtnText}>SAVE</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.button}
                            onPress={this.gotoBack}
                        >
                            <Text style={styles.exitBtnText}>BACK</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <OverlayLoader visible={this.state.showLoader} />
        </Container>
    );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	inputContainer: {
		padding: 10,
	},
	pb0: {
		paddingBottom: 0,
	},
	mb0: {
		marginBottom: 0,
	},
	name: {
		fontSize: 18,
		color: Colors.textColor,
		marginBottom: 10,
	},
	inputText: {
		height: 50,
		borderColor: "#ccc",
		borderWidth: 1,
		fontSize: 18,
		backgroundColor: "#f9f6f6",
		paddingHorizontal: 10,
		color: Colors.textColor,
	},
	selectedItemsContainer: {
		width: "100%",
		height: "auto",
		borderColor: "#ccc",
		borderWidth: 1,
		backgroundColor: "#f9f6f6",
		paddingVertical: 8,
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "flex-start",
	},
	placeholderStyle: {
		fontSize: 18,
		color: Colors.textColor,
		opacity: 0.8,
	},
	buttonsContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-evenly",
		marginVertical: 30,
	},
	button: {
		padding: 5,
	},
	saveBtnText: {
		fontSize: 18,
		fontWeight: "bold",
		color: Colors.primary,
	},
	exitBtnText: {
		fontSize: 18,
		fontWeight: "bold",
		color: Colors.activeTab,
	},
	item: {
		height: 35,
		backgroundColor: "#00b386",
		alignItems: "center",
		justifyContent: "center",
	},
	itemtitle: {
		color: "#fff",
		textAlign: "center",
		fontSize: 18,
	},
	errorText: {
		textAlign: "right",
		color: Colors.tomato,
		fontWeight: "bold",
		fontStyle: "italic",
	},
	fieldBox: {
		width: "97%",
		overflow: "hidden",
		flexDirection: "row",
		padding: 5,
		borderColor: "#ccc",
		borderWidth: 1,
		backgroundColor: "#f9f6f6",
		height: 50,
		justifyContent: "space-between",
		marginBottom: 5,
		marginTop: 5,
		marginHorizontal: 2,
	},
	imagePicker: {
		borderColor: "#ccc",
		borderWidth: 1,
		padding: 2,
		backgroundColor: "#fff",
		borderRadius: 3,
		alignItems: "flex-end",
		justifyContent: "center",
	},
});
