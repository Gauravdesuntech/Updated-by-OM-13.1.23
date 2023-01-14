import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

import Home from "../screen/Home";
import Logout from "../screen/Logout";
import Location from "../screen/Location";
import AddLocation from "../screen/AddLocation";
import SectionRelations from "../screen/SectionRelations";
import AddSectionRelation from "../screen/AddSectionRelation";
import AnimalGroups from "../screen/AnimalGroups";
import AddGroup from "../screen/AddGroup";
import Category from "../screen/Category";
import AddCategory from "../screen/AddCategory";
import SubCategory from "../screen/SubCategory";
import AddSubCategory from "../screen/AddSubCategory";
import CommonNames from "../screen/CommonNames";
import AddCommonName from "../screen/AddCommonName";
import CommonNameDetails from "../screen/CommonNameDetails";
import CommonNameTabDetails from "../screen/CommonNameTabDetails";
import CommonNameSections from "../screen/CommonNameSections";
import CommonNameEnclosures from "../screen/CommonNameEnclosures";
import GenerateExcel from "../screen/GenerateExcel";
import UploadExcel from "../screen/UploadExcel";
import AnimalsList from "../screen/AnimalsList";
import AnimalInfo from "../screen/AnimalInfo";
import Animals from "../screen/Animals";
import Enclosure from "../screen/enclosure-mgmt/Enclosure";

import {
  VaccineRecordEntry,
  VaccinationSchedule,
  VaccinationRecordEntry,
  MedicalRecordEntry,
  EnclosureRecordEntry,
  IncidentRecordEntry,
  MeasurementRecordEntry,
  FeedingAssignmentRecordEntry,
  FeedingRecordEntry,
} from "../screen/AnimalDetails";
import NutritionalValues from "../screen/NutritionalValues";
import Vitamin from "../screen/Vitamin";
import Minerals from "../screen/Minerals";

// Inventory Management Screens //
import InventoryHome from "../screen/inventory/InventoryHome";
import InventoryMasterHome from "../screen/inventory/InventoryMasterHome";
import ItemCategories from "../screen/inventory/ItemCategories";
import AddItemCategory from "../screen/inventory/AddItemCategory";
import StoreNames from "../screen/inventory/StoreNames";
import AddStoreName from "../screen/inventory/AddStoreName";
import Items from "../screen/inventory/Items";
import AddItem from "../screen/inventory/AddItem";
import ItemDetails from "../screen/inventory/ItemDetails";
import EditItem from "../screen/inventory/EditItem";
import LowInventoryList from "../screen/inventory/LowInventoryList";
import Recipes from "../screen/inventory/Recipes";
import AddRecipe from "../screen/inventory/AddRecipe";
import Parties from "../screen/inventory/Parties";
import AddParty from "../screen/inventory/AddParty";
import PurchaseOrders from "../screen/inventory/PurchaseOrders";
import AddPurchaseOrder from "../screen/inventory/AddPurchaseOrder";
import EditPurchaseOrder from "../screen/inventory/EditPurchaseOrder";
import PurchaseOrderDetails from "../screen/inventory/PurchaseOrderDetails";
import Purchase from "../screen/inventory/Purchase";
import Consumption from "../screen/inventory/Consumtion";
import AddConsumption from "../screen/inventory/AddConsumption";
import ConsumptionDetails from "../screen/inventory/ConsumptionDetails";
import StockTransfer from "../screen/inventory/StockTransfer";
import addUp from "../screen/inventory/Addup";
import AddRequestingItems from "../screen/inventory/AddRequestingItems";
import RequestItemDetails from "../screen/inventory/RequestItemDetails";
import StocksType from "../screen/inventory/StocksType";
import StockItems from "../screen/inventory/StockItems";
import LowStockTypes from "../screen/inventory/LowStockTypes";

// Staff Management Screens //
import StaffHome from "../screen/staff/StaffHome";
import StaffMaster from "../screen/staff/StaffMaster";
import Departments from "../screen/staff/Departments";
import AddDepartment from "../screen/staff/AddDepartment";
import Designations from "../screen/staff/Designations";
import AddDesignation from "../screen/staff/AddDesignation";
import UserTypes from "../screen/staff/UserTypes";
import AddUserType from "../screen/staff/AddUserType";
import Users from "../screen/staff/Users";
import UsersProfileList from "../screen/staff/UsersProfileList";
import UserProfileNewList from "../screen/staff/UserProfileNewList";
import AddUser from "../screen/staff/AddUser";
import EditUserProfile from "../screen/staff/EditUserProfile";
import Employeer from "../screen/staff/Employeer";
import AddEmployeer from "../screen/staff/AddEmployeer";
import UserDepartments from "../screen/staff/UserDepartments";
import UserProfileDetailsview from "../screen/staff/UserProfileDetailsview";

// Enclosure Management Screens
import EnclosureMgmtHome from "../screen/enclosure-mgmt/EnclosureMgmtHome";
import Sections from "../screen/enclosure-mgmt/Sections";
import AddSection from "../screen/enclosure-mgmt/AddSection";
import EnclosureTypes from "../screen/enclosure-mgmt/EnclosureTypes";
import AddEnclosureType from "../screen/enclosure-mgmt/AddEnclosureType";
import EnclosureIds from "../screen/enclosure-mgmt/EnclosureIds";
import AddEnclosureId from "../screen/enclosure-mgmt/AddEnclosureId";
import ChangeEnclosure from "../screen/enclosure-mgmt/ChangeEnclosure";
import ViewChangeEnclosure from "../screen/enclosure-mgmt/ViewChangeEnclosure";
import EnclosureChangeHistory from "../screen/enclosure-mgmt/EnclosureChangeHistory";
import AnimalsListEnclosure from "../screen/enclosure-mgmt/AnimalListEnclosure";
import CommonNameList from "../screen/enclosure-mgmt/CommonNameList";
import AnimalList from "../screen/enclosure-mgmt/AnimalList";
import EnclosureSection from "../screen/enclosure-mgmt/EnclosureSection";

// Feed Management Screens //
import FeedManagement from "../screen/feed/FeedManagement";

// Medical, Incident and Observations Reporting  //
import MedicalAndIncidentHome from "../screen/medical-incident/Home";
import MedicalRecordsList from "../screen/medical-incident/MedicalRecordsList";
import IncidentReportList from "../screen/medical-incident/IncidentReportList";
import MedIncMaster from "../screen/medical-incident/Master";
import IncidentMaster from "../screen/medical-incident/IncidentMaster";
import IncidentTypes from "../screen/medical-incident/IncidentTypes";
import AddIncidentTypes from "../screen/medical-incident/AddIncidentTypes";
import AddIncident from "../screen/medical-incident/AddIncident";
import ViewIncident from "../screen/medical-incident/ViewIncident";
import MedicalMaster from "../screen/medical-incident/MedicalMaster";
import DiagnosisList from "../screen/medical-incident/DiagnosisList";
import AddDiagnosis from "../screen/medical-incident/AddDiagnosis";
import AddMedicalRecord from "../screen/medical-incident/AddMedicalRecord";
import ViewMedicalRecord from "../screen/medical-incident/ViewMedicalRecords";
import AffectedPartList from "../screen/medical-incident/AffectedPartList";
import ManageAffectedParts from "../screen/medical-incident/ManageAffectedParts";
import RoutesList from "../screen/medical-incident/RoutesList";
import ManageRoute from "../screen/medical-incident/ManageRoute";
import Observations from "../screen/Observations/Observations";
import AddObservation from "../screen/Observations/AddObservation";
import ViewObservation from "../screen/Observations/ViewObservation";
// Todo/Tasks Screens //
import TodoStack from "./tasks";

//Reports Screens
import ReportsHome from "../screen/Reports/ReportsHome";
import DeathReport from "../screen/Reports/DeathReport";
import TransferReport from "../screen/Reports/TransferReport";
import TaskReport from "../screen/Reports/TaskReport";
import IncidentReport from "../screen/Reports/IncidentReport";
import MedicalReport from "../screen/Reports/MedicalReport";
import ObservationsReport from "../screen/Reports/ObservationsReport";
import JournalRecord from "../screen/JournalRecords/JornalRecord";
import Attendence from "./../screen/Attendence";
import Attendence2 from "./../screen/Attendence2";
import AnimalEnclosureSection from "../screen/enclosure-mgmt/AnimalEnclosureSection";
import ItemsMenu from "../screen/inventory/ItemsMenu";
import WorkAllocation from "../screen/WorkAllocation/WorkAllocationHome";
import FeedMenu from "../screen/WorkAllocation/FeedMenu";
import AddAllocation from "../screen/WorkAllocation/AddAllocation";
import FeedDetails from "../screen/WorkAllocation/FeedDetails";
import FeedingSectionMenu from "../screen/tasks/FeedingTask/FeedingSectionMenu";
import FeedBySection from "../screen/tasks/FeedingTask/FeedBySection";
import FeedingTask from "../screen/tasks/FeedingTask/FeedingTask";
import UpdateFeedingTask from "../screen/tasks/FeedingTask/UpdateFeedingTask";
import CleaningTasks from "./../screen/tasks/CleaningTask/CleaningTasks";
import ApprovalTask from "../screen/Approval/ApprovalTask";
import Task_mngt from "../screen/medical-incident/Task_mngt";
import Enclosure_Master from "../screen/medical-incident/Enclosure_Master";
import AddCategoryItem from "../screen/tasks/AddCategoryItem";
import Announcement from "./../screen/Announcement/Announcement";
import AddAnnouncement from "./../screen/Announcement/AddAnnouncement";
import OptionsAfterScan from "../screen/OptionsAfterScan";
import FeedingSchedule from "./../screen/FeedingSchedule";
import FeedingAllocation from "./../screen/FeedingAllocation";
import FeedAssign from "./../screen/FeedAssign";
import FeedingMaster from "./../screen/medical-incident/FeedingMaster";
import GetPrintLabelMaster from "./../screen/medical-incident/GetPrintLabelMaster";
import GetPrintLabel from "./../screen/medical-incident/GetPrintLabel";
import AddCompleteTasks from "./../screen/tasks/AddCompleteTasks";

// Location screens
import LocationMaster from "../screen/medical-incident/LocationMaster";
import LocationPermission from "../screen/medical-incident/LocationPermission";
import LocationRange from "../screen/medical-incident/LocationRange";

// Tag screens
import TagMaster from "../screen/Tags/TagMaster";
import AddTag from "../screen/Tags/AddTag";
import TagList from "../screen/Tags/TagList";
import AddTagGroup from "../screen/Tags/AddTagGroup";
import TagGroupList from "../screen/Tags/TagGroupList";
import TagAssign from "../screen/Tags/TagAssign";
import KitchenMaster from "../screen/Kitchen/KitchenMaster";
import Foods from "../screen/Kitchen/ManageFoods/Foods";
import FeedTypes from "../screen/Kitchen/ManageFeedTypes/FeedTypes";
import AddFoods from "../screen/Kitchen/ManageFoods/AddFoods";
import AddFeedingFactors from "../screen/Kitchen/Manage Feeding Factors/AddFeedingFactors";
import AddFeedTypes from "../screen/Kitchen/ManageFeedTypes/AddFeedTypes";
import FeedingFactors from "../screen/Kitchen/Manage Feeding Factors/FeedingFactors";
import MealSlots from "../screen/Kitchen/Manage Meal Slots/MealSlots";
import AddMealSlots from "../screen/Kitchen/Manage Meal Slots/AddMealSlots";
import FeedingPlaters from "../screen/Kitchen/Manage Feeding Platers/FeedingPlaters";
import AddFeedingPlaters from "../screen/Kitchen/Manage Feeding Platers/AddFeedingPlaters";

// Settings
import Settings from "../screen/Settings";
import { LanguageSettings } from "../screen/Settings/LanguageSettigs/LanguageSettings";
import AddUserPermission from "../screen/staff/AddUserPermission";

//Chat
import Chat from "../screen/Chat-section/Chat";
import VersionCheck from "../screen/VersionControl/VersionCheck";

const Stack = createStackNavigator();

const MainStackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#00B386",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Location" component={Location} />
      <Stack.Screen name="AddLocation" component={AddLocation} />
      <Stack.Screen name="Logout" component={Logout} />
      <Stack.Screen name="SectionRelations" component={SectionRelations} />
      <Stack.Screen name="AddSectionRelation" component={AddSectionRelation} />
      <Stack.Screen name="AnimalGroups" component={AnimalGroups} />
      <Stack.Screen name="AddGroup" component={AddGroup} />
      <Stack.Screen name="Category" component={Category} />
      <Stack.Screen name="Add Category" component={AddCategory} />
      <Stack.Screen name="SubCategory" component={SubCategory} />
      <Stack.Screen name="AddSubCategory" component={AddSubCategory} />
      <Stack.Screen name="CommonNames" component={CommonNames} />
      <Stack.Screen name="AddCommonName" component={AddCommonName} />
      <Stack.Screen name="CommonNameDetails" component={CommonNameDetails} />
      <Stack.Screen
        name="CommonNameTabDetails"
        component={CommonNameTabDetails}
      />
      <Stack.Screen name="GenerateExcel" component={GenerateExcel} />
      <Stack.Screen name="UploadExcel" component={UploadExcel} />
      <Stack.Screen name="AnimalsList" component={AnimalsList} />
      <Stack.Screen name="CommonNameSections" component={CommonNameSections} />
      <Stack.Screen
        name="CommonNameEnclosures"
        component={CommonNameEnclosures}
      />
      <Stack.Screen name="Animals" component={Animals} />
      <Stack.Screen name="AnimalInfo" component={AnimalInfo} />
      <Stack.Screen name="VaccineRecordEntry" component={VaccineRecordEntry} />
      <Stack.Screen
        name="VaccinationSchedule"
        component={VaccinationSchedule}
      />
      <Stack.Screen
        name="VaccinationRecordEntry"
        component={VaccinationRecordEntry}
      />
      <Stack.Screen name="MedicalRecordEntry" component={MedicalRecordEntry} />
      <Stack.Screen
        name="MeasurementRecordEntry"
        component={MeasurementRecordEntry}
      />
      <Stack.Screen
        name="EnclosureRecordEntry"
        component={EnclosureRecordEntry}
      />
      <Stack.Screen
        name="IncidentRecordEntry"
        component={IncidentRecordEntry}
      />
      <Stack.Screen
        name="FeedingAssignmentRecordEntry"
        component={FeedingAssignmentRecordEntry}
      />
      <Stack.Screen name="FeedingRecordEntry" component={FeedingRecordEntry} />
      <Stack.Screen name="NutritionalValues" component={NutritionalValues} />
      <Stack.Screen name="Vitamin" component={Vitamin} />
      <Stack.Screen name="Minerals" component={Minerals} />
      <Stack.Screen name="OptionsAfterScan" component={OptionsAfterScan} />
      {/* For add Task from scan */}
      <Stack.Screen name="AddCategoryItem" component={AddCategoryItem} />
      {/* Approval Screens */}
      <Stack.Screen name="Approval" component={ApprovalTask} />
      {/* Inventory Management Screens */}
      <Stack.Screen name="InventoryHome" component={InventoryHome} />
      <Stack.Screen
        name="InventoryMasterHome"
        component={InventoryMasterHome}
      />
      <Stack.Screen name="ItemCategories" component={ItemCategories} />
      <Stack.Screen name="AddItemCategory" component={AddItemCategory} />
      <Stack.Screen name="StoreNames" component={StoreNames} />
      <Stack.Screen name="AddStoreName" component={AddStoreName} />
      <Stack.Screen name="ItemsMenu" component={ItemsMenu} />
      <Stack.Screen name="Items" component={Items} />
      <Stack.Screen name="AddItem" component={AddItem} />
      <Stack.Screen name="ItemDetails" component={ItemDetails} />
      <Stack.Screen name="EditItem" component={EditItem} />
      <Stack.Screen name="LowInventoryList" component={LowInventoryList} />
      <Stack.Screen name="Recipes" component={Recipes} />
      <Stack.Screen name="AddRecipe" component={AddRecipe} />
      <Stack.Screen name="Parties" component={Parties} />
      <Stack.Screen name="AddParty" component={AddParty} />
      <Stack.Screen name="PurchaseOrders" component={PurchaseOrders} />
      <Stack.Screen name="AddPurchaseOrder" component={AddPurchaseOrder} />
      <Stack.Screen name="EditPurchaseOrder" component={EditPurchaseOrder} />
      <Stack.Screen name="addUp" component={addUp} />
      <Stack.Screen name="AddRequestingItems" component={AddRequestingItems} />
      <Stack.Screen name="RequestItemDetails" component={RequestItemDetails} />
      <Stack.Screen
        name="PurchaseOrderDetails"
        component={PurchaseOrderDetails}
      />
      <Stack.Screen name="Purchase" component={Purchase} />
      <Stack.Screen name="Consumption" component={Consumption} />
      <Stack.Screen name="AddConsumption" component={AddConsumption} />
      <Stack.Screen name="ConsumptionDetails" component={ConsumptionDetails} />
      <Stack.Screen name="StockTransfer" component={StockTransfer} />
      <Stack.Screen name="StocksType" component={StocksType} />
      <Stack.Screen name="StockItems" component={StockItems} />
      <Stack.Screen name="LowStockTypes" component={LowStockTypes} />
      {/* Staff Management Screens */}
      <Stack.Screen name="StaffHome" component={StaffHome} />
      <Stack.Screen name="StaffMaster" component={StaffMaster} />
      <Stack.Screen name="Designations" component={Designations} />
      <Stack.Screen name="AddDesignation" component={AddDesignation} />
      <Stack.Screen name="Departments" component={Departments} />
      <Stack.Screen name="AddDepartment" component={AddDepartment} />
      <Stack.Screen name="UserTypes" component={UserTypes} />
      <Stack.Screen name="AddUserType" component={AddUserType} />
      <Stack.Screen name="Users" component={Users} />
      <Stack.Screen name="UsersProfileList" component={UsersProfileList} />
      <Stack.Screen name="UserProfileNewList" component={UserProfileNewList} />
      <Stack.Screen name="AddUser" component={AddUser} />
      <Stack.Screen name="AddUserPermission" component={AddUserPermission} />
      <Stack.Screen name="EditUserProfile" component={EditUserProfile} />
      <Stack.Screen name="Employeer" component={Employeer} />
      <Stack.Screen name="AddEmployeer" component={AddEmployeer} />
      <Stack.Screen name="UserDepartments" component={UserDepartments} />
      <Stack.Screen
        name="UserProfileDetailsview"
        component={UserProfileDetailsview}
      />
      {/* Enclosure Management Screens */}
      <Stack.Screen name="EnclosureMgmtHome" component={EnclosureMgmtHome} />
      <Stack.Screen name="Sections" component={Sections} />
      <Stack.Screen name="AddSection" component={AddSection} />
      <Stack.Screen name="EnclosureTypes" component={EnclosureTypes} />
      <Stack.Screen name="AddEnclosureType" component={AddEnclosureType} />
      <Stack.Screen
        name="AnimalEnclosureSection"
        component={AnimalEnclosureSection}
      />
      <Stack.Screen name="EnclosureIds" component={EnclosureIds} />
      <Stack.Screen name="AddEnclosureId" component={AddEnclosureId} />
      <Stack.Screen name="ChangeEnclosure" component={ChangeEnclosure} />
      <Stack.Screen name="Enclosure" component={Enclosure} />
      <Stack.Screen
        name="ViewChangeEnclosure"
        component={ViewChangeEnclosure}
      />
      <Stack.Screen
        name="EnclosureChangeHistory"
        component={EnclosureChangeHistory}
      />
      <Stack.Screen
        name="AnimalsListEnclosure"
        component={AnimalsListEnclosure}
      />
      <Stack.Screen name="CommonNameList" component={CommonNameList} />
      <Stack.Screen name="AnimalList" component={AnimalList} />
      <Stack.Screen name="EnclosureSection" component={EnclosureSection} />
      {/* Feed Management Screens */}
      <Stack.Screen name="FeedManagement" component={FeedManagement} />
      {/* Medical and Incident Reporting */}
      <Stack.Screen
        name="MedicalAndIncidentHome"
        component={MedicalAndIncidentHome}
      />
      <Stack.Screen name="MedicalRecordsList" component={MedicalRecordsList} />
      <Stack.Screen name="IncidentReportList" component={IncidentReportList} />
      <Stack.Screen name="Observations" component={Observations} />
      <Stack.Screen name="MedIncMaster" component={MedIncMaster} />
      <Stack.Screen name="IncidentMaster" component={IncidentMaster} />
      <Stack.Screen name="IncidentTypes" component={IncidentTypes} />
      <Stack.Screen name="AddIncidentTypes" component={AddIncidentTypes} />
      <Stack.Screen name="AddIncident" component={AddIncident} />
      <Stack.Screen name="AddObservation" component={AddObservation} />
      <Stack.Screen name="ViewObservation" component={ViewObservation} />
      <Stack.Screen name="ViewIncident" component={ViewIncident} />
      <Stack.Screen name="MedicalMaster" component={MedicalMaster} />
      <Stack.Screen name="DiagnosisList" component={DiagnosisList} />
      <Stack.Screen name="AddDiagnosis" component={AddDiagnosis} />
      <Stack.Screen name="AddMedicalRecord" component={AddMedicalRecord} />
      <Stack.Screen name="ViewMedicalRecord" component={ViewMedicalRecord} />
      <Stack.Screen name="AffectedPartList" component={AffectedPartList} />
      <Stack.Screen
        name="ManageAffectedParts"
        component={ManageAffectedParts}
      />
      <Stack.Screen name="RoutesList" component={RoutesList} />
      <Stack.Screen name="ManageRoute" component={ManageRoute} />
      <Stack.Screen name="Task_mngt" component={Task_mngt} />
      <Stack.Screen name="Enclosure_Master" component={Enclosure_Master} />
      {/** Task Management Screens */}
      <Stack.Screen name="Todo" component={TodoStack} />
      <Stack.Screen name="AddCompleteTasks" component={AddCompleteTasks} />
      {/** Reports Management Screens */}
      <Stack.Screen name="ReportsHome" component={ReportsHome} />
      <Stack.Screen name="DeathReport" component={DeathReport} />
      <Stack.Screen name="TransferReport" component={TransferReport} />
      <Stack.Screen name="TaskReport" component={TaskReport} />
      <Stack.Screen name="IncidentReport" component={IncidentReport} />
      <Stack.Screen name="MedicalReport" component={MedicalReport} />
      <Stack.Screen name="ObservationsReport" component={ObservationsReport} />
      {/** Journal Management Screens */}
      <Stack.Screen name="JornalRecord" component={JournalRecord} />
      {/** Work Allocation Screens */}
      <Stack.Screen name="WorkAllocation" component={WorkAllocation} />
      <Stack.Screen name="FeedMenu" component={FeedMenu} />
      <Stack.Screen name="AddAllocation" component={AddAllocation} />
      <Stack.Screen name="FeedDetails" component={FeedDetails} />
      <Stack.Screen name="FeedingSectionMenu" component={FeedingSectionMenu} />
      <Stack.Screen name="FeedBySection" component={FeedBySection} />
      <Stack.Screen name="FeedingTask" component={FeedingTask} />
      <Stack.Screen name="UpdateFeedingTask" component={UpdateFeedingTask} />
      <Stack.Screen name="CleaningTasks" component={CleaningTasks} />
      {/** Attendance Management Screens */}
      <Stack.Screen name="Attendance" component={Attendence} />
      <Stack.Screen name="Attendence2" component={Attendence2} />
      {/** Announcement Screens */}
      <Stack.Screen name="Announcement" component={Announcement} />
      <Stack.Screen name="AddAnnouncement" component={AddAnnouncement} />
      {/* Feeding Allocation */}
      <Stack.Screen name="FeedAssign" component={FeedAssign} />
      <Stack.Screen name="FeedingSchedule" component={FeedingSchedule} />
      <Stack.Screen name="FeedingAllocation" component={FeedingAllocation} />
      <Stack.Screen name="FeedingMaster" component={FeedingMaster} />
      {/* Get Print Label*/}
      <Stack.Screen
        name="GetPrintLabelMaster"
        component={GetPrintLabelMaster}
      />
      <Stack.Screen name="GetPrintLabel" component={GetPrintLabel} />

      {/* Location screens */}
      <Stack.Screen name="LocationMaster" component={LocationMaster} />
      <Stack.Screen name="LocationPermission" component={LocationPermission} />
      <Stack.Screen name="LocationRange" component={LocationRange} />

      {/* Tag screens */}
      <Stack.Screen name="TagMaster" component={TagMaster} />
      <Stack.Screen name="AddTag" component={AddTag} />
      <Stack.Screen name="TagList" component={TagList} />
      <Stack.Screen name="AddTagGroup" component={AddTagGroup} />
      <Stack.Screen name="TagGroupList" component={TagGroupList} />
      <Stack.Screen name="TagAssign" component={TagAssign} />

      {/* Kitchen screens */}
      <Stack.Screen name="KitchenMaster" component={KitchenMaster} />
      <Stack.Screen name="Foods" component={Foods} />
      <Stack.Screen name="AddFoods" component={AddFoods} />
      <Stack.Screen name="FeedTypes" component={FeedTypes} />
      <Stack.Screen name="AddFeedTypes" component={AddFeedTypes} />
      <Stack.Screen name="FeedingFactors" component={FeedingFactors} />
      <Stack.Screen name="AddFeedingFactors" component={AddFeedingFactors} />
      <Stack.Screen name="MealSlots" component={MealSlots} />
      <Stack.Screen name="AddMealSlots" component={AddMealSlots} />
      <Stack.Screen name="FeedingPlaters" component={FeedingPlaters} />
      <Stack.Screen name="AddFeedingPlaters" component={AddFeedingPlaters} />
      {/*Chat Section */}
      <Stack.Screen name="Chat" component={Chat} />
      {/* Settings */}
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="LanguageSettings" component={LanguageSettings} />
      <Stack.Screen name="VersionCheck" component={VersionCheck} />
    </Stack.Navigator>
  );
};

export default MainStackNavigation;
