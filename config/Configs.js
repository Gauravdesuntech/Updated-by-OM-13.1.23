const isDev = true
; //False means production live url will work

const END_POINT = isDev
  ? "http://ehostingguru.com/stage/ZooApp/"
  : "https://funworks.in/zoolivetst/";

const Configs = {
  TOKEN_EXPERIENCEID: "@desuntechnology/animalcaremanage",
  ISDEV: isDev,
  PROFILE_URL: END_POINT + "upload/images/",
  ignoreWarnings: true,
  BASE_URL: END_POINT + "api/",
  BASE_URL_APP: END_POINT + "app/",
  TASK_URL: `${END_POINT}app/tasks/`,
  IMAGE_URL: END_POINT,
  DOCUMENT_URL: `${END_POINT}upload/documents/`,
  INVENTORY_MGMT_BASE: END_POINT + "app/inventory/",
  ANNOUNCEMENT_BASE: END_POINT + "app/announcement/",
  USER_MGMT_BASE: END_POINT + "app/user_mgmt/",
  MEDICAL_INCIDENT_BASE: END_POINT + "app/MedicalAndIncidentReport/",
  OBSERVATION_BASE: END_POINT + "app/observation/",
  MEDICAL_RECORD_UPLOAD_DATA_URL: END_POINT + "upload/medical_records/",
  INCIDENT_RECORD_UPLOAD_DATA_URL: END_POINT + "upload/incident_records/",
  WORK_ALLOCATION: END_POINT + "app/workallocation/",
  VERSION_CONTROL: END_POINT + "app/VersionControl/",
  KITCHEN_BASEURL: END_POINT + "app/kitchen/",
  REPORTS_MGMT_BASE: END_POINT + "app/reports/",
  TAG_AND_TAGGROUP_BASE: END_POINT + "app/tag/",
  GOOGLE_PLACE_API_KEY: "AIzaSyAHG9wJDJThFRp7aZdG9O2LMRvSRXjjois",
  SUCCESS_TYPE: "success",
  FAILURE_TYPE: "failure",
  LONG_LAT: isDev
    ? {
        lat: 22.4828966,
        lng: 88.3863171,
      }
    : {
        lat: 13.077023303368748,
        lng: 77.61880928976724,
      }, //For live server
  DISTANCE_REQUIRED: 100000, // 100KM
  ANIMAL_GENDER: [
    { id: "Male", name: "Male", value: "Male" },
    { id: "Female", name: "Female", value: "Female" },
    { id: "Undetermined", name: "Undetermined", value: "Undetermined" },
    { id: "Indeterminate", name: "Indeterminate", value: "Indeterminate" },
  ],
  ANIMAL_BIRTH_TYPE: [
    { id: "Captive Born", name: "Captive Born", value: "Captive Born" },
    { id: "Wild Born", name: "Wild Born", value: "Wild Born" },
    { id: "Undetermined", name: "Undetermined", value: "Undetermined" },
    { id: "Indeterminate", name: "Indeterminate", value: "Indeterminate" },
  ],
  BIRTH_TYPE: [
    { id: "Captive", name: "Captive ", value: "Captive " },
    { id: "Wild ", name: "Wild ", value: "Wild " },
    { id: "Others", name: "Others", value: "Others" },
  ],
  INITIAL_REARING: [
    { id: "Parent", name: "Parent", value: "Parent" },
    { id: "Colony", name: "Colony", value: "Colony" },
    { id: "Group", name: "Group", value: "Group" },
    { id: "Foster", name: "Foster", value: "Foster" },
    { id: "Hand", name: "Hand", value: "Hand" },
    { id: "Peer", name: "Peer", value: "Peer" },
    { id: "Unknown", name: "Unknown", value: "Unknown" },
  ],
  DEATH_TYPE: [
    { id: "Congenital Defect", name: "Congenital Defect", value: "Congenital Defect" },
    { id: "Euthanasia", name: "Euthanasia", value: "Euthanasia" },
    { id: "Murder", name: "Murder", value: "Murder" },
    { id: "Natural", name: "Natural", value: "Natural" },
    { id: "Old Age", name: "Old Age", value: "Old Age" },
    { id: "Poisoned", name: "Poisoned", value: "Poisoned" },
    { id: "Stray Attack", name: "Stray Attack", value: "Stray Attack" },
    {id: "Suspicious", name: "Suspicious", value: "Suspicious" },
    {id: "Foul Play", name: "Foul Play", value: "Foul Play" },
  ],
  CARCASS_CONDITION: [
    { id: "Fresh", name: "Fresh", value: "Fresh" },
    { id: "Moderatel Autolyzed", name: "Moderatel Autolyzed", value: "Moderatel Autolyzed" },
    { id: "Not Available", name: "Not Available", value: "Not Available" },
    { id: "Not Usable", name: "Not Usable", value: "Not Usable" },
    { id: "Severly Autolyzed", name: "Severly Autolyzed", value: "Severly Autolyzed" },
    { id: "Slighty Autolyzed", name: "Slighty Autolyzed", value: "Slighty Autolyzed" },
  ],
  NECROPSY_REQUEST: [
    { id: "Yes", name: "Yes",value:"Yes" },
    { id: "No", name: "No",value:"No" },
  ],
  //===> IdentificationDetails  inuptfiled data==>
  
SEX: [
  { id: "Male", name: "Male", value: "Male" },
  { id: "Female", name: "Female", value: "Female" },
  { id: "Undetermined", name: "Undetermined", value: "Undetermined" },
  { id: "Indeterminate", name: "Indeterminate", value: "Indeterminate" },
  { id: "Asexual", name: "Asexual", value: "Asexual" },
  { id: "Hermaphrodite", name: "Hermaphrodite", value: "Hermaphrodite" },
],

ENTITY_TYPE_TAB_MENU: [
  { id: "Individual", name: "Individual", value:"Individual" },
  { id: "Group", name: "Group", value: "Group" },
],
COLLECTION_TYPE_TAB_MENU:[
  { id: "Exhibition", name: "Exhibition", value:"Exhibition" },
  { id: "Examination", name: "Examination", value:"Examination" },
  { id: "Rehab", name: "Rehab", value:"Rehab" },
  { id: "Rescue", name: "Rescue", value:"Rescue" },
  { id: "Wild Observation", name: "Wild Observation", value:"Wild Observation" },
],
HYBRID_TYPE_TAB_MENU:[
  { id: "Not a Hybrid", name: "Not a Hybrid", value:"Not a Hybrid" },
  { id: "Species Hybrid", name: "Species Hybrid", value:"Species Hybrid" },
  { id: "Sub Species Hybrid", name: "Sub Species Hybrid", value:"Sub Species Hybrid" },
  { id: "Unknown", name: "Unknown", value:"Unknown" },
],
 Select_Section:[ 
  { id: "Ring Number", name :"Ring Number", value:"Ring Number" },
  { id: "DNA", name: "DNA", value:"DNA" },
  { id: "Microchip", name: "Microchip", value:"Microchip" },
],
DATA:[
  { id: "Purchase", name: "Purchase", value:"Purchase" },
  { id: "Wild", name: "Wild", value:"Wild" },
],

//====Necropsy.js inputfiled data :-
Histopathology:[
  { id: "Yes", name: "Yes", value:"Yes" },
  { id: "No", name: "No", value:"No" },
],
LAB_REQUEST:[
  { id: "Yes", name: "Yes", value:"Yes" },
  { id: "No", name: "No", value:"No" },
],
Measurements:[
  { id: "Yes", name: "Yes", value:"Yes" },
  { id: "No", name: "No", value:"No" },
],

//====Case.js inputfileds data=====>
  COLLECTION_REASON:[
    { id: "Diagnostic", name: "Diagnostic", value:"Diagnostic" },
  { id: "Dr Requested", name: "Dr Requested", value:"Dr Requested" },
  { id: "Examination", name: "Examination", value:"Examination" },
  { id: "Necropsy", name: "Necropsy", value:"Necropsy" },
  { id: "Others", name: "Others", value:"Others" },
  { id: "Pre Shipment", name: "Pre Shipment", value:"Pre Shipment" },
  { id: "Quarantine Tests", name: "Quarantine Tests", value:"Quarantine Tests" },
  { id: "Routine", name: "Routine", value:"Routine" },
  ] ,
  RESTRAINT:[
    {id: "Manual", name: "Manual", value:"Manual"},
    {id: "Others", name: "Others", value:"Others"}
  ],
   ACTIVITY_LEVEL:[
    {id: "Alert", name: "Alert", value:"Alert"},
    {id: "Inactive", name: "Inactive", value:"Inactive"},
    {id: "N/A", name: "N/A", value:"N/A"}
   ],
   FASTING:[
    {id: "< 8 Hours", name: "< 8 Hours", value:"< 8 Hours"},
    {id: "> 48 Hours", name: "> 48 Hours", value:"> 48 Hours"},
    {id: "> 24-48 Hours", name: "> 24-48 Hours", value:"> 24-48 Hours"},
    {id: "> 8 to 24 Hours", name: "> 8 to 24 Hours", value:"> 8 to 24 Hours"},
    {id: "N/A", name: "N/A", value:"N/A"}
   ],
   ANIMAL_HEALTH:[
    {id: "Abnormal", name: "Abnormal", value:"Abnormal"},
    {id: "Normal", name: "Normal", value:"Normal"},
    {id: "Un Known", name: "Un Known", value:"Un Known"},
    {id: "Deceased", name: "Deceased", value:"Deceased"}
   ],
   SAMPLE_TYPE:[
    {id: "Blood", name: "Blood", value:"Blood"},
    {id: "Bone", name: "Bone", value:"Bone"},
    {id: "Culture", name: "Culture", value:"Culture"},
    {id: "Embryo", name: "Embryo", value:"Embryo"},
    {id: "Fecal", name: "Fecal", value:"Fecal"},
    {id: "Fecal Sample", name: "Fecal Sample", value:"Fecal Sample"},
    {id: "GI", name: "GI", value:"GI"},
    {id: "Hair", name: "Hair", value:"Hair"}
   ],
   SAMPLE_SITE:[
    {id: "Fecal", name: "Fecal", value:"Fecal"},
    {id: "Fluid", name: "Fluid", value:"Fluid"},
    {id: "Fur", name: "Fur", value:"Fur"},
    {id: "Left Leg", name: "Left Leg", value:"Left Leg"},
    {id: "Right Leg", name: "Right Leg", value:"Right Leg"},
    {id: "Others", name: "Others", value:"Others"},
   ],

  ANIMAL_STATUS: [
    { id: "Alive", name: "Alive", value: "Alive" },
    { id: "Dead", name: "Dead", value: "Dead" },
    { id: "Transferred", name: "Transferred", value: "Transferred" },
    { id: "Sold", name: "Sold", value: "Sold" },
    { id: "Unknown", name: "Unknown Reason", value: "Unknown" },
    { id: "Wrong", name: "Wrong Entry", value: "Wrong" },
  ],
  SEX_IDENTIFICATION_TYPES: [
    { id: "1", name: "Blood Sample" },
    { id: "2", name: "DNA" },
    { id: "3", name: "Visual" },
  ],
  ANIMAL_TYPE_GROUP: "Group",
  ANIMAL_TYPE_INDIVIDUAL: "Individual",

  ANIMAL_SOURCES: [
    { id: "1", name: "Transfer", value: "Transfer" },
    { id: "2", name: "Gifted", value: "Gifted" },
    { id: "3", name: "In House Breading", value: "In House Breading" },
    { id: "4", name: "Purchase", value: "Purchase" },
  ],
  ANIMAL_IDENTIFICATION_TYPES: [
    { id: "dna", name: "DNA", value: "DNA" },
    { id: "microchip", name: "Microchip", value: "Microchip" },
    { id: "ring_no", name: "Ring Number", value: "Ring Number" },
    { id: "dna_microchip", name: "DNA-Microchip", value: "DNA-Microchip" },
    { id: "dna_ring_no", name: "DNA-Ring Number", value: "DNA-Ring Number" },
    {
      id: "microchip_ring_no",
      name: "Microchip-Ring Number",
      value: "Microchip-Ring Number",
    },
    {
      id: "dna_microchip_ring_no",
      name: "DNA-Microchip-Ring Number",
      value: "DNA-Microchip-Ring Number",
    },
    { id: "without_id", name: "Without ID", value: "Without ID" },
  ],
  ANIMAL_IDENTIFICATION_TYPES_TEMP: [
    { id: "without_id", name: "Without ID", value: "Without ID" },
    { id: "dna", name: "DNA", value: "DNA" },
    { id: "microchip", name: "Microchip", value: "Microchip" },
    { id: "ring_no", name: "Ring Number", value: "Ring Number" },
  ],
  UNITS: [
    { id: "AMP", name: "AMPOULE", value: "AMP" },
    { id: "BAG", name: "BAGS", value: "BAG" },
    { id: "BTL", name: "BOTTLES", value: "BTL" },
    { id: "BOX", name: "BOX", value: "BOX" },
    { id: "BCK", name: "BUCKTES", value: "BCK" },
    { id: "BDL", name: "BUNDLES", value: "BDL" },
    { id: "CAN", name: "CANS", value: "CAN" },
    { id: "CPS", name: "CAPSULES", value: "CPS" },
    { id: "CTN", name: "CARTONS", value: "CTN" },
    { id: "COIL", name: "COIL", value: "COIL" },
    { id: "DRM", name: "DRUM", value: "DRM" },
    { id: "FT", name: "FEET", value: "FT" },
    { id: "GMS", name: "GRAMS", value: "GMS" },
    { id: "IN", name: "INCHES", value: "IN" },
    { id: "JAR", name: "JARS", value: "JAR" },
    { id: "KGS", name: "KILOGRAMS", value: "KGS" },
    { id: "LTR", name: "LITRE", value: "LTR" },
    { id: "MLG", name: "MILIGRAM", value: "MLG" },
    { id: "MLT", name: "MILLILITRE", value: "MLT" },
    { id: "NO", name: "NUMBER", value: "NO" },
    { id: "PET", name: "PETI", value: "PET" },
    { id: "PCS", name: "PIECES", value: "PCS" },
    { id: "PLT", name: "PLATES", value: "PLT" },
    { id: "POCH", name: "POUCH", value: "POCH" },
    { id: "TBS", name: "TABLETS", value: "TBS" },
    { id: "TIN", name: "TIN", value: "TIN" },
    { id: "TUB", name: "TUBES", value: "TUB" },
    { id: "VIAL", name: "VIALS", value: "VIAL" },
  ],
  HOME_SCREEN_MENUES: [
    {
      id: "feeding",
      name: "Feeding",
      screen: "FeedingSectionMenu",
      icon: require("../assets/image/feed-mgmt.jpg"),
    },
    {
      id: "journal",
      name: "Journal",
      screen: "JornalRecord",
      icon: require("../assets/image/Journal.png"),
    },
    {
      id: "daily_task_and_reports",
      name: "Task Management",
      screen: "Todo",
      icon: require("../assets/image/daily-task-reports.png"),
    },
    {
      id: "approval",
      name: "Approval",
      screen: "Approval",
      icon: require("../assets/image/approval.png"),
    },
    {
      id: "incident_reporting",
      name: "Incident Reporting",
      screen: "IncidentReportList",
      icon: require("../assets/image/incidentReport.webp"),
    },
    {
      id: "medical_reporting",
      name: "Medical Reporting",
      screen: "MedicalRecordsList",
      icon: require("../assets/image/medical.webp"),
    },
    {
      id: "observations",
      name: "Observations",
      screen: "Observations",
      icon: require("../assets/image/observation.png"),
    },

    // {
    // 	id: 'record_mgmt',
    // 	name: "Record Mgmt",
    // 	screen: 'AnimalGroups',
    // 	icon: require("../assets/image/record-mgmt.png")
    // },
    // {
    //   id: "record_mgmt",
    //   name: "Record Mgmt",
    //   screen: "Sections",
    //   icon: require("../assets/image/record-mgmt.png"),
    // },
    {
      id: "announcement",
      name: "Announcement",
      screen: "AddAnnouncement",
      icon: require("../assets/image/announcement.png"),
    },
    // {
    //   id: "enclosure_mgmt",
    //   name: "Enclosure",
    //   screen: "Enclosure",
    //   icon: require("../assets/image/enclousre-mgmt.png"),
    // },
    {
      id: "enclosure",
      name: "Enclosure",
      screen: "EnclosureMgmtHome",
      icon: require("../assets/image/enclousre-mgmt.png"),
    },
    {
      id: "inventory_mgmt",
      name: "Inventory Mgmt",
      screen: "InventoryHome",
      icon: require("../assets/image/inventory-mgmt.png"),
    },
    {
      id: "staff_mgmt",
      name: "Staff Mgmt",
      screen: "StaffHome",
      icon: require("../assets/image/staff-mgmt.jpg"),
    },

    {
      id: "reports",
      name: "Reports",
      screen: "ReportsHome",
      icon: require("../assets/image/report.png"),
    },
    // {
    // 	id: 'work_allocation',
    // 	name: "Work Allocation",
    // 	screen: 'WorkAllocation',
    // 	icon: require("../assets/image/WorkAllocation.webp")
    // },
    // {
    // 	id: 'survilence',
    // 	name: "Surveillance",
    // 	screen: '',
    // 	icon: require("../assets/image/survilence.png")
    // },
    // {
    // 	id: 'dashboard',
    // 	name: "Dashboard",
    // 	screen: '',
    // 	icon: require("../assets/image/dashboard.png")
    // },
    // {
    // 	id: 'animal_movement',
    // 	name: "Animal Movement",
    // 	screen: '',
    // 	icon: require("../assets/image/animal-movement.png")
    // },
    // {
    // 	id: 'attendance',
    // 	name: "Attendance",
    // 	screen: 'Attendance',
    // 	icon: require("../assets/image/attendance.png")
    // },
    // {
    // 	id: 'reproduction',
    // 	name: "Reproduction",
    // 	screen: '',
    // 	icon: require("../assets/image/Reproduction.png")
    // },
    // {
    // 	id: 'critical_alerts',
    // 	name: "Critical Alerts",
    // 	screen: '',
    // 	icon: require("../assets/image/critcal-alerts.png")
    // },
    // {
    // 	id: 'breeding_colony_mgmt',
    // 	name: "Breeding / Colony Mgmt",
    // 	screen: '',
    // 	icon: require("../assets/image/breeding-colony-mgmt.png")
    // },
    // {
    // 	id: 'enrichment',
    // 	name: "Enrichments",
    // 	screen: '',
    // 	icon: require("../assets/image/enrichments.jpg")
    // },
    {
      id: "Chat",
      name: "Chat",
      screen: "Chat",
      icon: require("../assets/image/chat.jpg"),
    },
    {
      id: "master",
      name: "Master",
      screen: "MedIncMaster",
      icon: require("../assets/image/master_icon.jpg"),
    },
  ],
  USER_ACTION_TYPES: [
    { id: "Add", name: "Add" },
    { id: "Edit", name: "Edit" },
    { id: "Delete", name: "Delete" },
    { id: "View", name: "View" },
    { id: "Stats", name: "Statistic" },
  ],
  USER_ACTION_TYPES_CHECKING: {
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    stats: "Stats",
  },
  JOURNAL_REVIEW_MENU: [
    { id: "View", name: "View" },
    { id: "Report", name: "Report" },
    { id: "Filter", name: "Filter" },
  ],
  STATES: [
    { id: "35", name: "Andaman and Nicobor Islands" },
    { id: "28", name: "Andhra Pradesh" },
    { id: "12", name: "Arunachal Pradesh" },
    { id: "18", name: "Assam" },
    { id: "10", name: "Bihar" },
    { id: "04", name: "Chandigarh" },
    { id: "22", name: "Chattisgarh" },
    { id: "26", name: "Dadra and Nagar Haveli" },
    { id: "25", name: "Daman and Diu" },
    { id: "07", name: "Delhi" },
    { id: "30", name: "Goa" },
    { id: "24", name: "Gujarat" },
    { id: "06", name: "Haryana" },
    { id: "02", name: "Himachal Pradesh" },
    { id: "01", name: "Jammu & Kashmir" },
    { id: "20", name: "Jharkhand" },
    { id: "29", name: "Karnataka" },
    { id: "32", name: "Kerla" },
    { id: "31", name: "Lakshadweep Islands" },
    { id: "23", name: "Madhya Pradesh" },
    { id: "27", name: "Maharashtra" },
    { id: "14", name: "Manipur" },
    { id: "17", name: "Meghalaya" },
    { id: "15", name: "Mizoram" },
    { id: "13", name: "Nagaland" },
    { id: "21", name: "Odisha" },
    { id: "34", name: "Pondichery" },
    { id: "03", name: "Punjab" },
    { id: "08", name: "Rajasthan" },
    { id: "11", name: "Sikkim" },
    { id: "33", name: "Tamil Nadu" },
    { id: "36", name: "Telangana" },
    { id: "16", name: "Tripura" },
    { id: "09", name: "Uttar Pradesh" },
    { id: "05", name: "Uttarakhand" },
    { id: "19", name: "West Bengal" },
  ],
  SEARCH_TYPES: [
    { id: "common_name", name: "Common Name" },
    { id: "section", name: "Section" },
    { id: "enclosure", name: "Enclosure" },
    { id: "category", name: "Category" },
    { id: "sub_category", name: "Sub Category" },
    { id: "animal_code", name: "Animal Code" },
  ],
  SCAN_OPTIONS: [
    { id: "section", name: "Section", screen: "EnclosureIds" },
    { id: "enclosure", name: "Enclosure", screen: "AnimalsListEnclosure" },
    { id: "medical", name: "Add Medical", screen: "AddMedicalRecord" },
    { id: "incident", name: "Add Incident", screen: "AddIncident" },
    { id: "feeding", name: "Feeding", screen: "FeedingSectionMenu" },
    { id: "task", name: "Add Task", screen: "AddCategoryItem" },
  ],
  ITEM_PRIORITIES: [
    { id: "1", name: "Low" },
    { id: "2", name: "Medium" },
    { id: "3", name: "High" },
    { id: "4", name: "Top" },
  ],
  MEDICAL_RECORD_STATUS: [
    { id: "P", name: "Pending" },
    { id: "O", name: "Ongoing" },
    { id: "A", name: "Closed" },
    { id: "all", name: "ALL" },
  ],
  INCIDENT_RECORD_STATUS: [
    { id: "P", name: "Pending" },
    { id: "A", name: "Closed" },
    { id: "all", name: "ALL" },
  ],
  TASK_STATUS: {
    pending: "Pending",
    approved: "Approved",
    waiting: "Waiting for approval",
    completed: "Completed",
    rejected: "Rejected",
  },
  ASSIGN_TYPE: [
    { value: "delicate", label: "Delicate" },
    { value: "permanent", label: "Permanent" },
  ],
  TASK_TYPE: [
    { value: "all", label: "All Tasks" },
    { value: "selected", label: "Selected Tasks" },
  ],
  ACTIVE_STATUS: [
    { id: "1", name: "Active" },
    { id: "0", name: "Inactive" },
  ],
  JOURNAL_TAB_MENU: [
    { id: "all", name: "All", value: "all" },
    { id: "observation", name: "Observation", value: "observation" },
    { id: "feed", name: "Feed", value: "feed" },
    { id: "task", name: "Task", value: "task" },
    { id: "incident", name: "Incident", value: "incident" },
    { id: "medical", name: "Medical", value: "medical" },
  ],
  DATEWISE_TASK_TAB_MENU: [
    { id: "all", name: "All", value: "all_task" },
    { id: "pending", name: "Pending", value: "pending" },
    { id: "overdue", name: "Over Due", value: "over_due_task" },
  ],
  PRIORITY_FOR_CATEGORY_ADD: [
    {
      id: "1",
      name: "Low",
    },
    {
      id: "2",
      name: "Moderate",
    },
    {
      id: "3",
      name: "High",
    },
    {
      id: "4",
      name: "Danger",
    },
    {
      id: "5",
      name: "Critical",
    },
  ],
  SETTINGS_MENU: [
    {
      id: "language",
      name: "Language",
    },
  ],

  APP_LANGUAGES: [
    {
      id: "english",
      name: "English",
      value: "en",
    },
    {
      id: "hindi",
      name: "Hindi",
      value: "hi",
    },
  ],
};

export default Configs;
