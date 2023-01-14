import React from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Platform,
    TextInput,
    Button,
    ScrollView,
    SectionList,
    ActivityIndicator,
    RefreshControl,
    Image,
    Pressable,
    BackHandler,
    ToastAndroid
} from "react-native";
import moment from "moment";
import { Container } from "native-base";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import Colors from "../../config/colors";
import { Header, Loader, ListEmpty } from "../../component";
import {
    getMedicalRecords,
    filterMedicalRecords,
} from "../../services/MedicalAndIncidenTServices";
import AppContext from "../../context/AppContext";
import { Configs } from "../../config";
import DownloadFile from "../../component/DownloadFile";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
    downloadJournal,
    filterJournalRecord,
    get_journal_record_for_pdf,
    journalRecords,
} from "./../../services/JournalService";
import { capitalize, showDate } from "../../utils/Util";
import * as FileSystem from "expo-file-system";
const { StorageAccessFramework } = FileSystem;
import * as Sharing from "expo-sharing";
import { DateTimePickerModal } from "react-native-modal-datetime-picker";
import colors from "../../config/colors";
import * as WebBrowser from "expo-web-browser";
import globalStyles from "../../config/Styles";
import { userList } from "../../utils/api";
import UserItem from "../../component/tasks/UserItem";
import OverlayLoader from "./../../component/OverlayLoader";
import styles from "../../config/Styles";
import { getVersion } from "../../services/VersionServices";
import Constants from "expo-constants";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const tabHeight = 50;

export default class VersionCheck extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            currentVersion: '',
            newVersion: '',
            isSameVersion: true
        };
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        })
        getVersion().then((res) => {
            const currentVersion = Constants.manifest.version;
            const currentVersionNO = Constants.manifest.version.replace('.', '').replace('.', '');
			const newVersionNo = res.version.replace('.', '').replace('.', '');
			let isSameVersion = Number(currentVersionNO) < Number(newVersionNo) ? false : true;
            let newVersion = res;

            this.setState({
                currentVersion,
                newVersion,
                isLoading: false,
                isSameVersion
            })
        }).catch((err) => console.log(err))
    }

    checkUpdates = () => {
        this.setState({
            isLoading: true
        })
        setTimeout(() => {
            this.setState({
                isLoading: false
            });
            if(this.state.isSameVersion){
                ToastAndroid.show("No Updates Available !!", ToastAndroid.LONG);
            }else{
                ToastAndroid.show("Updates Available !!", ToastAndroid.LONG);
            }
        }, 2000);
    }

    render = () => (
        <Container style={{ flex: 1, backgroundColor: "#01C794" }}>
            <OverlayLoader visible={this.state.isLoading} />
            <View style={styles.drawerTop}>
                <Image
                    source={require("../../assets/image/versionLogo.png")}
                    resizeMode="cover"
                    style={{ height: 200, width: 200 }}
                />
                <Pressable
                    onPress={() => {
                        this.checkUpdates()
                    }}
                >
                    <Image
                        source={require("../../assets/image/update.png")}
                        resizeMode="cover"
                        style={{ height: 80, width: 80 }}
                    />
                </Pressable>
                {this.state.isSameVersion ?
                    <View style={styles.itemView}>
                        <Text style={styles.itemText}>No Updates Available !!</Text>
                        <Text style={[styles.itemText, { fontSize: 15, marginTop: 20 }]}>App Version  v{this.state.currentVersion}</Text>
                        <View style={{ width: "50%", paddingLeft: 20, paddingRight: 20 }}>
                                <Pressable
                                    style={styles.versionButton}
                                    onPress={() => {
                                        this.props.navigation.goBack();
                                    }}
                                >
                                    <Text style={[styles.versionButtonText, { color: colors.danger }]}>GO BACK</Text>
                                </Pressable>
                            </View>
                    </View>
                    :
                    <>
                        <View style={styles.itemView}>
                            <Text style={styles.itemText}>New Version Available !!</Text>
                            <Text style={[styles.itemText, { fontSize: 15, marginTop: 20 }]}>Current App Version  v{this.state.currentVersion} || New App Version  v{this.state.newVersion.version}</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 50 }}>
                            <View style={{ width: "50%", paddingLeft: 20, paddingRight: 20 }}>
                                <Pressable
                                    style={styles.versionButton}
                                    onPress={() => {
                                        BackHandler.exitApp();
                                    }}
                                >
                                    <Text style={[styles.versionButtonText, { color: colors.danger }]}>EXIT</Text>
                                </Pressable>
                            </View>

                            <View style={{ width: "50%", paddingLeft: 20, paddingRight: 20 }}>
                                <Pressable
                                    style={styles.versionButton}
                                    onPress={() => {
                                        WebBrowser.openBrowserAsync(this.state.newVersion.link)
                                    }}
                                >
                                    <Text style={styles.versionButtonText}>DOWNLOAD</Text>
                                </Pressable>
                            </View>
                        </View>
                    </>
                }
            </View>
        </Container>
    );
}