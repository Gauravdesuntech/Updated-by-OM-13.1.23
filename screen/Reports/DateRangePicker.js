import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import moment from "moment";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Colors } from "../../config";
import styles from "./Style";

export const DateRangePicker = (props) => {
  const [isDateTimePickerVisible, setDatePickerVisibility] = useState(false);
  const [mode, setMode] = useState("date");
  const [date, setDate] = useState(props.date);
  const [selectType, setSelectType] = useState("");
  const [fromDate, setFromDate] = useState(
    moment(new Date()).subtract(1,'days').format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  // const [time, setTime] = useState(props.time);
  // const [display, setDisplay] = useState("");

  const showDatePicker = (type) => {
    // if (mode == "date") {
    //   setDisplay("inline");
    // }
    // setMode(mode);
    setSelectType(type);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setSelectType("");
    setDatePickerVisibility(false);
  };

  useEffect(() => {
    props.getSelectedDates({ fromDate, toDate });
  }, [fromDate, toDate]);

  const handleConfirm = (selectedDate) => {
    if (selectType === "from") {
      setFromDate(moment(selectedDate).format("YYYY-MM-DD"));
    } else if (selectType === "to") {
      setToDate(moment(selectedDate).format("YYYY-MM-DD"));
    }

    hideDatePicker();
  };

  return (
    <View style={styles.dateRangePickerWrapper}>
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: Colors.textColor }}>From Date</Text>
        <TouchableOpacity
          onPress={() => {
            showDatePicker("from");
          }}
          style={styles.dateRangePickerDateContainer}
        >
          <Text style={{ color: "green" }}>
            {moment(fromDate).format("DD-MM-YYYY")}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: Colors.textColor }}>To Date</Text>
        <TouchableOpacity
          onPress={() => {
            showDatePicker("to");
          }}
          style={styles.dateRangePickerDateContainer}
        >
          <Text style={{ color: "red" }}>
            {moment(toDate).format("DD-MM-YYYY")}
          </Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        // display={Platform.OS == "ios" ? display : "default"}
        mode={mode}
        isVisible={isDateTimePickerVisible}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};
