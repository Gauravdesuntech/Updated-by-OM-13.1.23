import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ToastAndroid,
  SafeAreaView,
  Pressable,
  RefreshControl,
} from "react-native";
import { Modal as Modal2 } from "react-native";

import { Container } from "native-base";
import { MaterialCommunityIcons, Entypo, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Header, Dropdown, OverlayLoader } from "../../component";
import ModalMenu from "../../component/ModalMenu";
import InputDropdown from "../../component/InputDropdown";
import { DatePicker } from "../../component";
import { Configs, Colors } from "../../config";
import { getFormattedDate, getFileData, capitalize } from "../../utils/Util";
import {
  getDiagnosis,
  addMedicalRecord,
  getMedicine,
  getAffectedParts,
  getRouteLists,
} from "../../services/MedicalAndIncidenTServices";
import {
  getAnimalSections,
  getAllEnclosures,
  getAllAnimals,
  getAnimalGroups,
} from "../../services/APIServices";
import {
  assignTags,
  getAllTags,
  getCategories,
  getSubCategories,
  getCommonNames,
  getAllTagsbyGroup,
} from "../../services/TagServices";
import Modal from "react-native-modal";
import AppContext from "../../context/AppContext";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
//import globalStyles from "../../config/Styles";
import globalStyles from "../../config/Styles"
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import MultiSelectDropdown from "./../../component/MultiSelectDropdown";
import Category from "../../component/category";
import GlobalStyle1 from '../../screen/Tags/Styles';
import styles from "../../config/Styles";

export default class TagAssign extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      diagnosis: [],
      sections: [],
      enclosures: [],
      animals: [],

      refreshing: false,
      selectionTypes: [
        {
          id: 1,
          name: "Section",
          value: "section",
        },
        {
          id: 2,
          name: "Enclosure",
          value: "enclosure",
        },
        {
          id: 3,
          name: "Animal",
          value: "animal",
        },
        {
          id: 4,
          name: "Category",
          value: "category",
        },
        {
          id: 5,
          name: "Subcategory",
          value: "sub_category",
        },
        {
          id: 6,
          name: "Common Name",
          value: "common_name",
        },
      ],

      id: props.route.params?.item?.id ?? 0,
      tagName: props.route.params?.item?.diagnosed_by_name ?? "",
      tagId: props.route.params?.item?.tagId ?? undefined,
      selectedTags: [],

      selectionTypeName: props.route.params?.item?.ref
        ? capitalize(props.route.params.item.ref)
        : props.route.params.selectionType
          ? capitalize(props.route.params.selectionType)
          : "",
      selectionTypeId: props.route.params?.item?.ref
        ? props.route.params.item.ref
        : props.route.params.selectionType
          ? props.route.params.selectionType
          : undefined,
      selectedRef : props.route.params?.item?.selectedRef
        ? props.route.params.item.selectedRef
        : props.route.params.selectedRef
          ? props.route.params.selectedRef
          : [],
      ref_name: props.route.params?.item?.ref_value
        ? props.route.params.item.ref_value
        : props.route.params.ref_name
          ? props.route.params.ref_name
          : undefined,

      section_id: props.route.params?.grand_parent_id
        ? props.route.params?.grand_parent_id
        : props.route.params?.parent_id
          ? props.route.params?.parent_id
          : "",
      section_name: props.route.params?.grand_parent_name
        ? props.route.params?.grand_parent_name
        : props.route.params?.parent_name
          ? props.route.params?.parent_name
          : "",
      enclosure_id: props.route.params?.grand_parent_id
        ? props.route.params?.parent_id
        : "",
      enclosure_name: props.route.params?.grand_parent_name
        ? props.route.params?.parent_name
        : "",

      category_id: "",
      category_name: "",
      subcategory_id: "",
      subcategory_name: "",
      class_id: "",
      class_name: "",

      sections: [],
      enclosuress: [],
      categories: [],
      subcategories: [],
      commonNames: [],
      tags: [],
      class : [],

      show: false,
      isrefMenuOpen: false,
      isClosedByMenuOpen: false,
      isTagsMenuOpen: false,
      isClassMenuOpen: false,
      isSelectionTypeMenuOpen: false,
      showLoader: false,
      modalVisible: false,

      isSectionMenuOpen: false,
      isEnclosureMenuOpen: false,
      isCategoryMenuOpen: false,
      isSubcategoryMenuOpen: false,

      isScanModal: false,

      hasTagSelectionError: false,
    };

    this.formScrollViewRef = React.createRef();
  }

  componentDidMount = () => {
    this.focusListener = this.props.navigation.addListener(
      "focus",
      this.onScreenFocus
    );
  };

  onScreenFocus = () => {
    this.setState(
      {
        showLoader: true,
      },
      () => {
        this.getAllData();
      }
    );
  };

  componentWillUnmount = () => {
    this.focusListener();
  };

  onRefresh = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this.getAllData();
      }
    );
  };

  getAllData = () => {
    this.setState({
      reported_by_name: this.context.userDetails.full_name,
      reported_by: this.context.userDetails.id,
    });
    let cid = this.context.userDetails.cid;
    Promise.all([
      getAnimalSections(cid),
      getAllEnclosures(cid),
      // getCategories(cid),
      getAnimalGroups(cid),
    ])
      .then((data) => {
        this.setState({
          sections: data[0].map((v, i) => ({
            id: v.id,
            name: v.name,
            value: v.id,
          })),
          enclosures: data[1].map((v, i) => ({
            id: v.id,
            name: v.enclosure_id,
            value: v.id,
          })),
          // tags: data[2]?.data,
          // categories: data[3].map((v, i) => ({
          //   id: v.id,
          //   name: v.name,
          //   value: v.id,
          // })),
          class: data[2].map((v, i) => ({
            id: v.id,
            name: v.group_name,
            value: v.id,
          })),
          showLoader: false,
          refreshing: false,
        });
      })
      .catch((error) => console.log(error));
  };

  toggleSelectionTypeMenu = () =>
    this.setState({
      isSelectionTypeMenuOpen: !this.state.isSelectionTypeMenuOpen,
    });

  togglerefMenu = () =>
    this.setState({ isrefMenuOpen: !this.state.isrefMenuOpen });

  toggleClassMenu = () =>
    this.setState({ isClassMenuOpen: !this.state.isClassMenuOpen });

  toggleSectionMenu = () =>
    this.setState({ isSectionMenuOpen: !this.state.isSectionMenuOpen });

  toggleEnclosureMenu = () =>
    this.setState({ isEnclosureMenuOpen: !this.state.isEnclosureMenuOpen });

  toggleCategoryMenu = () =>
    this.setState({ isCategoryMenuOpen: !this.state.isCategoryMenuOpen });

  toggleSubcategoryMenu = () =>
    this.setState({ isSubcategoryMenuOpen: !this.state.isSubcategoryMenuOpen });

  // toggleTagsMenu = () =>
  //   this.setState({ isTagsMenuOpen: !this.state.isTagsMenuOpen });

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  getEnclosureBySection = (section_id) => {
    let cid = this.context.userDetails.cid;
    getAllEnclosures(cid, section_id)
      .then((res) => {
        this.setState({
          enclosures: res.map((v, i) => ({
            id: v.id,
            name: v.enclosure_id,
            value: v.id,
          })),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getAnimalByEnclosure = (enclosure_id) => {
    let cid = this.context.userDetails.cid;
    getAllAnimals(cid, enclosure_id)
      .then((res) => {
        this.setState({
          animals: res.map((v, i) => ({
            id: v.id,
            name: `${v.animal_id} | ${v.animal_name} `,
            value: v.id,
          })),
          // | ${v.enclosure_name} | ${v.section_name}
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getSubcategoryByCategory = (category_id) => {
    let cid = this.context.userDetails.cid;
    getSubCategories(cid, category_id)
      .then((res) => {
        this.setState({
          subcategories: res.map((v, i) => ({
            id: v.id,
            name: v.name,
            value: v.id,
          })),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getCommonNamesBySubcategory = (subcategory_id) => {
    let cid = this.context.userDetails.cid;
    getCommonNames(cid, subcategory_id)
      .then((res) => {
        this.setState({
          commonNames: res.map((v, i) => ({
            id: v.id,
            name: v.name,
            value: v.id,
          })),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  setSelectionTypeData = (v) =>
    this.setState({
      selectionTypeId: v.value,
      selectionTypeName: v.name,
      selectedRef: [],
      ref_name: "",
      isSelectionTypeMenuOpen: false,
    },()=>
      this.getTags(v.value)
      )


  getTags = (v) =>{
    if(v == undefined){
      alert("Choose Assign by First!!")
    }else{
    this.setState({
      tags:[],
      selectedTags:[],
      isTagsMenuOpen : true
    },()=>{
      getAllTagsbyGroup(this.context.userDetails.cid,v).then((res)=>{
        let dataArr = [];
            for (let key in res.data) {
              dataArr.push({ title: key, data: res.data[key] });
            }
        this.setState({
          tags : dataArr
        })
      }).catch((err)=>console.log(err))
    });
  }
}


  setref = (v) => {
    this.setState({
      selectedRef: v,
      isrefMenuOpen: false,
    });
  };


  setClass = (v) => {
    let cid = this.context.userDetails.cid;
    this.setState({
      class_id: v.id,
      class_name: v.name,
      section_id: "",
      section_name: "",
      enclosure_id: "",
      enclosure_name: "",
      category_id:"",
      category_name: "",
      subcategory_id: "",
      subcategory_name: "",
      selectedRef: [],
      ref_name: "",
      isClassMenuOpen: false,
    },()=>{
      getCategories(cid,v.id)
      .then((res) => {
        this.setState({
          categories: res.map((v, i) => ({
            id: v.id,
            name: v.name,
            value: v.id,
          })),
        });
      })
      .catch((err) => {
        console.log(err);
      });
    });
  };

  setSection = (v) => {
    this.setState(
      {
        section_id: v.id,
        section_name: v.name,
        enclosure_id: "",
        enclosure_name: "",
        selectedRef: [],
        ref_name: "",
        isSectionMenuOpen: false,
      },
      () => {
        this.getEnclosureBySection(v.id);
      }
    );
  };

  catPressed = (item) => {
    let id = item.id;
    let arr = this.state.selectedTags;
    let index = arr.findIndex((element) => element.id === id);

        if (index > -1) {
            arr = arr.filter((element) => element.id !== id);
        } else {
            arr.push(item);
        }
    this.setState({
      selectedTags: arr,
    });
  };

  setEnclosure = (v) => {
    this.setState(
      {
        enclosure_id: v.id,
        enclosure_name: v.name,
        selectedRef: [],
        ref_name: "",
        isEnclosureMenuOpen: false,
      },
      () => {
        this.getAnimalByEnclosure(v.id);
      }
    );
  };

  setCategory = (v) => {
    this.setState(
      {
        category_id: v.id,
        category_name: v.name,
        subcategory_id: "",
        subcategory_name: "",
        selectedRef: [],
        ref_name: "",
        isCategoryMenuOpen: false,
      },
      () => {
        this.getSubcategoryByCategory(v.id);
      }
    );
  };

  setSubcategory = (v) => {
    this.setState(
      {
        subcategory_id: v.id,
        subcategory_name: v.name,
        selectedRef: [],
        ref_name: "",
        isSubcategoryMenuOpen: false,
      },
      () => {
        this.getCommonNamesBySubcategory(v.id);
      }
    );
  };

  setSelectectTags = (item) => {
    this.setState({
      selectedTags: item,
    });
  };

  scrollToScrollViewTop = () => {
    this.formScrollViewRef.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });
  };

  saveAssignTag = () => {
    let cid = this.context.userDetails.cid;

    this.setState(
      {
        hasTypeValidationError: false,
        hasTagSelectionError: false,
      },
      () => {
        if (typeof this.state.selectionTypeId === "undefined") {
          this.setState({ hasTypeValidationError: true });
          return false;
        } else if (this.state.selectedTags?.length === 0) {
          this.setState({
            hasTagSelectionError: true,
          });
          return;
        } else {
          this.setState(
            {
              isLoading: true,
            },
            () => {
              let obj = {
                tag_id: this.state.selectedTags
                  ?.map((item) => item.id)
                  .join(","),
                ref_id: this.state.selectedRef
                ?.map((item) => item.id)
                .join(","),
                type: this.state.selectionTypeId,
                cid,
              };

              assignTags(obj)
                .then((response) => {
                  this.setState({
                    isLoading: false,
                  });
                  Alert.alert("Successfully Assigned");
                  this.setState({ showLoader: false });
                  this.gotoBack();
                })
                .catch((error) => console.log(error));
            }
          );
        }
      }
    );
  };

  openRelatedScaner = () => {
    Camera.requestCameraPermissionsAsync()
      .then((result) => {
        if (result.status === "granted") {
          this.setState({ isScanModal: !this.state.isScanModal });
        } else {
          Alert.alert("Please give the permission");
        }
      })
      .catch((error) => console.log(error));
  };

  closeScanModal = () => {
    this.setState({ isScanModal: !this.state.isScanModal });
  };

  handleBarCodeScanned = (data) => {
    try {
      let scanData = JSON.parse(data.data);
      let type = scanData.type ? scanData.type : scanData.qr_code_type;
      if (type == "Group") {
        this.setState({
          isScanModal: !this.state.isScanModal,

          selectionTypeName: "Animal",

          selectionTypeId: "animal",

          selectedRef: scanData.id,

          ref_name: scanData?.common_name,

          section_id: scanData.section_id,

          section_name: scanData.section_name,

          enclosure_id: scanData.enclosure_id,

          enclosure_name: scanData.enclosure_name,
        });
      } else {
        let arr = type == this.state.selectionTypeId ? this.state.selectedRef : [];
        let id = scanData.enclosure_db_id
        ? scanData.enclosure_db_id
        : scanData.id
          ? scanData.id
          : scanData.section_id;
        let name = scanData.animal_code
        ? scanData?.common_name
        : scanData.enclosure_id
          ? scanData.enclosure_id
          : scanData.section;
        arr.push(
          {
            id : id ,
            name : name
          }
        )
        this.setState({
          isScanModal: !this.state.isScanModal,

          selectionTypeName: capitalize(type),

          selectionTypeId: type,

          selectedRef: arr,

          ref_name: scanData.animal_code
            ? scanData?.common_name
            : scanData.enclosure_id
              ? scanData.enclosure_id
              : scanData.section,

          section_id: scanData.section_id,

          section_name: scanData.section,

          enclosure_id: scanData.enclosure_db_id,

          enclosure_name: scanData.enclosure_id,
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({ isScanModal: !this.state.isScanModal });
      alert("Wrong QR code scan !!");
    }
  };

  render = () => (
    <SafeAreaView style={globalStyles.container}>
      <OverlayLoader visible={this.state.showLoader} />
      <Header
        // title={parseInt(this.state.id) > 0 ? "Edit Record" : "Medical Record"}
        title={"Tag Assign"}
        showRelatedScanButton={true}
        openRelatedScaner={this.openRelatedScaner}
      />
      <View>
        <KeyboardAwareScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          ref={this.formScrollViewRef}
          // 
          
          // style={{
          //   paddingHorizontal: Colors.formPaddingHorizontal,
          //   paddingBottom: 20,
          //   paddingTop: 5,
          //   marginBottom: 20,
          // }}
        >
          <View style={globalStyles.boxBorder}>
            <>
              <InputDropdown
                label={"Assign By"}
                value={this.state.selectionTypeName}
                isOpen={this.state.isSelectionTypeMenuOpen}
                items={this.state.selectionTypes}
                openAction={this.toggleSelectionTypeMenu}
                closeAction={this.toggleSelectionTypeMenu}
                setValue={this.setSelectionTypeData}
                // placeholder="Select Incident Related To"
                labelStyle={globalStyles.labelName}
                textFieldStyle={globalStyles.textfield}
                style={[
                  globalStyles.fieldBox,
                  this.state.hasTypeValidationError
                    ? globalStyles.errorFieldBox
                    : null,
                ]}
              />

              {this.state.selectionTypeId == "section" ? (
                <MultiSelectDropdown
                  label={"Sections"}
                  style={globalStyles.fieldBox}
                  selectedItems={this.state.selectedRef}
                  // isOpen={this.state.isrefMenuOpen}
                  items={this.state.sections}
                  // openAction={this.togglerefMenu}
                  // closeAction={this.togglerefMenu}
                  onSave={this.setref}
                  placeHolderContainer={globalStyles.textfield}
                placeholderStyle={globalStyles.placeholderStyle}
                  // placeholder="Select Sections"
                  labelStyle={globalStyles.labelName}
                  textFieldStyle={globalStyles.textfield}
                  // style={[globalStyles.fieldBox]}
                  selectedItemsContainer={[
                    globalStyles.selectedItemsContainer,
                    globalStyles.width60,
                  ]}
                />
              ) : null}

              {this.state.selectionTypeId == "enclosure" ? (
                this.state.id == 0 ? (
                  <>
                    <InputDropdown
                      label={"Section"}
                      value={this.state.section_name}
                      isOpen={this.state.isSectionMenuOpen}
                      items={this.state.sections}
                      openAction={this.toggleSectionMenu}
                      closeAction={this.toggleSectionMenu}
                      setValue={this.setSection}
                      // placeholder="Select Sections"
                      labelStyle={globalStyles.labelName}
                      textFieldStyle={globalStyles.textfield}
                      style={[globalStyles.fieldBox]}
                    />
                    <MultiSelectDropdown
                      label={"Enclosures"}
                      style={globalStyles.fieldBox}
                      selectedItems={this.state.selectedRef}
                  // isOpen={this.state.isrefMenuOpen}
                  items={this.state.enclosures}
                  // openAction={this.togglerefMenu}
                  // closeAction={this.togglerefMenu}
                  onSave={this.setref}
                  placeHolderContainer={globalStyles.textfield}
                placeholderStyle={globalStyles.placeholderStyle}
                  // placeholder="Select Sections"
                  labelStyle={globalStyles.labelName}
                  textFieldStyle={globalStyles.textfield}
                  // style={[globalStyles.fieldBox]}
                  selectedItemsContainer={[
                    globalStyles.selectedItemsContainer,
                    globalStyles.width60,
                  ]}
                    />
                  </>
                ) : null
              ) : null}

              {this.state.selectionTypeId == "animal" ? (
                this.state.id == 0 ? (
                  <>
                    {/* <View style={globalStyles.inputContainer}> */}
                    <InputDropdown
                      label={"Section"}
                      value={this.state.section_name}
                      isOpen={this.state.isSectionMenuOpen}
                      items={this.state.sections}
                      openAction={this.toggleSectionMenu}
                      closeAction={this.toggleSectionMenu}
                      setValue={this.setSection}
                      // placeholder="Select Sections"
                      labelStyle={globalStyles.labelName}
                      textFieldStyle={globalStyles.textfield}
                      style={[globalStyles.fieldBox]}
                    />
                    {/* </View> */}
                    {/* <View style={globalStyles.inputContainer}> */}
                    <InputDropdown
                      label={"Enclosures"}
                      value={this.state.enclosure_name}
                      isOpen={this.state.isEnclosureMenuOpen}
                      items={this.state.enclosures}
                      openAction={this.toggleEnclosureMenu}
                      closeAction={this.toggleEnclosureMenu}
                      setValue={this.setEnclosure}
                      // placeholder="Select Enclosures"
                      labelStyle={globalStyles.labelName}
                      textFieldStyle={globalStyles.textfield}
                      style={[globalStyles.fieldBox]}
                    />
                    {/* </View> */}
                  </>
                ) : null
              ) : null}

              {this.state.selectionTypeId == "animal" ? (
                <MultiSelectDropdown
                  label={"Animals"}
                  style={globalStyles.fieldBox}
                  selectedItems={this.state.selectedRef}
                  // isOpen={this.state.isrefMenuOpen}
                  items={this.state.animals}
                  // openAction={this.togglerefMenu}
                  // closeAction={this.togglerefMenu}
                  onSave={this.setref}
                  placeHolderContainer={globalStyles.textfield}
                placeholderStyle={globalStyles.placeholderStyle}
                  // placeholder="Select Sections"
                  labelStyle={globalStyles.labelName}
                  textFieldStyle={globalStyles.textfield}
                  // style={[globalStyles.fieldBox]}
                  selectedItemsContainer={[
                    globalStyles.selectedItemsContainer,
                    globalStyles.width60,
                  ]}
                />
              ) : null}
            </>

            <>
              {this.state.selectionTypeId == "category" ? (
                <>
                  <InputDropdown
                    label={"Class"}
                    value={this.state.class_name}
                    isOpen={this.state.isClassMenuOpen}
                    items={this.state.class}
                    openAction={this.toggleClassMenu}
                    closeAction={this.toggleClassMenu}
                    setValue={this.setClass}
                    // placeholder="Select Sections"
                    labelStyle={globalStyles.labelName}
                    textFieldStyle={globalStyles.textfield}
                    style={[globalStyles.fieldBox]}
                  />
                  <MultiSelectDropdown
                    label={"Category"}
                    style={globalStyles.fieldBox}
                    selectedItems={this.state.selectedRef}
                  // isOpen={this.state.isrefMenuOpen}
                  items={this.state.categories}
                  // openAction={this.togglerefMenu}
                  // closeAction={this.togglerefMenu}
                  onSave={this.setref}
                  placeHolderContainer={globalStyles.textfield}
                placeholderStyle={globalStyles.placeholderStyle}
                  // placeholder="Select Sections"
                  labelStyle={globalStyles.labelName}
                  textFieldStyle={globalStyles.textfield}
                  // style={[globalStyles.fieldBox]}
                  selectedItemsContainer={[
                    globalStyles.selectedItemsContainer,
                    globalStyles.width60,
                  ]}
                  />
                </>
              ) : null}
              {this.state.selectionTypeId == "sub_category" ? (
                this.state.id == 0 ? (
                  <>
                    <InputDropdown
                      label={"Class"}
                      value={this.state.class_name}
                      isOpen={this.state.isClassMenuOpen}
                      items={this.state.class}
                      openAction={this.toggleClassMenu}
                      closeAction={this.toggleClassMenu}
                      setValue={this.setClass}
                      // placeholder="Select Sections"
                      labelStyle={globalStyles.labelName}
                      textFieldStyle={globalStyles.textfield}
                      style={[globalStyles.fieldBox]}
                    />
                    <InputDropdown
                      label={"Category"}
                      value={this.state.category_name}
                      isOpen={this.state.isCategoryMenuOpen}
                      items={this.state.categories}
                      openAction={this.toggleCategoryMenu}
                      closeAction={this.toggleCategoryMenu}
                      setValue={this.setCategory}
                      // placeholder="Select Sections"
                      labelStyle={globalStyles.labelName}
                      textFieldStyle={globalStyles.textfield}
                      style={[globalStyles.fieldBox]}
                    />
                    <MultiSelectDropdown
                      label={"Subcategory"}
                      style={globalStyles.fieldBox}
                      selectedItems={this.state.selectedRef}
                  // isOpen={this.state.isrefMenuOpen}
                  items={this.state.subcategories}
                  // openAction={this.togglerefMenu}
                  // closeAction={this.togglerefMenu}
                  onSave={this.setref}
                  placeHolderContainer={globalStyles.textfield}
                placeholderStyle={globalStyles.placeholderStyle}
                  // placeholder="Select Sections"
                  labelStyle={globalStyles.labelName}
                  textFieldStyle={globalStyles.textfield}
                  // style={[globalStyles.fieldBox]}
                  selectedItemsContainer={[
                    globalStyles.selectedItemsContainer,
                    globalStyles.width60,
                  ]}
                    />
                  </>
                ) : null
              ) : null}

              {this.state.selectionTypeId == "common_name" ? (
                this.state.id == 0 ? (
                  <>
                    <InputDropdown
                      label={"Class"}
                      value={this.state.class_name}
                      isOpen={this.state.isClassMenuOpen}
                      items={this.state.class}
                      openAction={this.toggleClassMenu}
                      closeAction={this.toggleClassMenu}
                      setValue={this.setClass}
                      // placeholder="Select Sections"
                      labelStyle={globalStyles.labelName}
                      textFieldStyle={globalStyles.textfield}
                      style={[globalStyles.fieldBox]}
                    />
                    <InputDropdown
                      label={"Category"}
                      value={this.state.category_name}
                      isOpen={this.state.isCategoryMenuOpen}
                      items={this.state.categories}
                      openAction={this.toggleCategoryMenu}
                      closeAction={this.toggleCategoryMenu}
                      setValue={this.setCategory}
                      // placeholder="Select Sections"
                      labelStyle={globalStyles.labelName}
                      textFieldStyle={globalStyles.textfield}
                      style={[globalStyles.fieldBox]}
                    />

                    <InputDropdown
                      label={"Subcategory"}
                      value={this.state.subcategory_name}
                      isOpen={this.state.isSubcategoryMenuOpen}
                      items={this.state.subcategories}
                      openAction={this.toggleSubcategoryMenu}
                      closeAction={this.toggleSubcategoryMenu}
                      setValue={this.setSubcategory}
                      // placeholder="Select Enclosures"
                      labelStyle={globalStyles.labelName}
                      textFieldStyle={globalStyles.textfield}
                      style={[globalStyles.fieldBox]}
                    />
                  </>
                ) : null
              ) : null}

              {this.state.selectionTypeId == "common_name" ? (
                <MultiSelectDropdown
                  label={"Common Name"}
                  selectedItems={this.state.selectedRef}
                  // isOpen={this.state.isrefMenuOpen}
                  items={this.state.commonNames}
                  // openAction={this.togglerefMenu}
                  // closeAction={this.togglerefMenu}
                  onSave={this.setref}
                  placeHolderContainer={globalStyles.textfield}
                  placeholderStyle={globalStyles.placeholderStyle}
                  labelStyle={globalStyles.labelName}
                  textFieldStyle={globalStyles.textfield}
                  // style={[globalStyles.fieldBox]}
                  selectedItemsContainer={[
                    globalStyles.selectedItemsContainer,
                    globalStyles.width60,
                  ]}
                  style={globalStyles.fieldBox}
                  listView={true}
                />
              ) : null}
            </>

          <TouchableOpacity style={[globalStyles.fieldBox,globalStyles.bbw0]}
          onPress={()=>this.getTags(this.state.selectionTypeId)}
          >
          <Text style={[globalStyles.labelName]}>
            Tags
          </Text>
            <View
              style={[
                globalStyles.selectedItemsContainer,globalStyles.width60,
              ]}
            >
              {this.state.selectedTags.map((element) => (
                <View
                key={element.id.toString()}
                style={{
                  height: 25,
                  justifyContent: "center",
                  paddingHorizontal: 5,
                  marginHorizontal: 3,
                  marginVertical: 5,
                  borderRadius: 2,
                  backgroundColor: Colors.white,
                  borderColor : Colors.primary,
                  borderWidth : 1,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <Image
                  style={styles.images}
                  source={{ uri: element.tag_icon }}
                />
                <Text style={{ fontSize: 12, color: Colors.primary }}>
                  {element.name}
                </Text>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={this.catPressed.bind(this, element)}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={18}
                    color={Colors.textColor}
                  />
                </TouchableOpacity>
              </View>
              ))}
            </View>
        </TouchableOpacity>
          </View>
          <View style={globalStyles.buttonsContainer}>
            <TouchableOpacity activeOpacity={1} onPress={this.saveAssignTag}>
              <Text style={[globalStyles.buttonText, globalStyles.saveBtnText]}>
                Assign
              </Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} onPress={this.gotoBack}>
              <Text style={[globalStyles.buttonText, globalStyles.exitBtnText]}>EXIT</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
      {/*Scan Modal*/}
      <Modal2
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={this.state.isScanModal}
        onRequestClose={this.closeScanModal}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
          <View style={globalStyles.scanModalOverlay}>
            <View style={globalStyles.qrCodeSacnBox}>
              <Camera
                onBarCodeScanned={this.handleBarCodeScanned}
                barCodeScannerSettings={{
                  barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                }}
                style={StyleSheet.absoluteFill}
              />
            </View>
            <TouchableOpacity
              style={globalStyles.cancelButton}
              onPress={this.closeScanModal}
            >
              <Ionicons name="close-outline" style={globalStyles.cancelButtonText} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal2>
      {/* <View style={{ flex: 0.8, backgroundColor: "red" }}> */}
      {this.state.isTagsMenuOpen ? 
            <Category
              categoryData={this.state.tags}
              onCatPress={this.catPressed}
              heading={"Choose Tags"}
              // userType={}
              navigation={this.props.navigation}
              permission={"Yes"}
              screen={"AddTag"}
            />
            : null}
          {/* </View> */}
    </SafeAreaView>
  );
}
