import { Linking, Platform } from 'react-native';
import moment from "moment";
import * as ELinking from 'expo-linking';


/**RECEIVES DATE and returns formatted date
**Ex: 2021-10-07 will return 7th Oct 2021
**Second param is optional if provided then
**it will return day name also 
**Ex: 2021-10-07 will return 7th Oct 2021, Thursday
**/
const formatdate = (date, name = '') => {
    const stringdate = moment(date).format("Do MMM YYYY");
    if (name.length > 0) {
        const dayname = moment(date).format('dddd');
        return stringdate + ", " + dayname;
    } else {
        return stringdate;
    }

}


/**RECEIVES url to open in app using deep link scheme
**Second param is a config object contains app name, app store id, app store local and play store id
**If not able to play the received url then it will redirect to playstore with playstore ID to download app
**Once app is downloaded then it will open the URL passed to it 
**/
const maybeOpenURL = async ( url, callBacks ) => {
    // console.log(url, callBacks);return
    Linking.openURL(url).catch(err => {
        if (err.code === 'EUNSPECIFIED') {
            callBacks();
        } else {
            throw new Error(`Could not open ${appName}. ${err.toString()}`);
        }
    });
};


const openAppOnStore = ({ appName, appStoreId, appStoreLocale, playStoreId }) => {
    if (Platform.OS === 'ios') {
        // check if appStoreLocale is set
        const locale = typeof appStoreLocale === 'undefined'
            ? 'us'
            : appStoreLocale;

        Linking.openURL(`https://apps.apple.com/${locale}/app/${appName}/id${appStoreId}`);
    } else {
        Linking.openURL(
            `https://play.google.com/store/apps/details?id=${playStoreId}`
        );
    }
}


//Create Deep Link URL 
const generateURL = (screenName,query) =>{
    const redirectUrl = ELinking.createURL(screenName, {
        queryParams: query,
      });
      return redirectUrl
}



export { formatdate, maybeOpenURL, openAppOnStore, generateURL };