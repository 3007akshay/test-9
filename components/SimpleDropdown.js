import React, { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet
} from "react-native";


export default function SimpleDropdown({
  label,
  options,
  selected,
  onSelect
}) {

  const [visible, setVisible] =
    useState(false);

  return (

    <View style={{ flex: 1 }}>

      <Text style={styles.label}>
        {label}
      </Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() =>
          setVisible(true)
        }
      >

        <Text style={{ color: "white" }}>
          {selected !== null
            ? `Beacon ${selected}`
            : "Select"}
        </Text>

      </TouchableOpacity>


      <Modal
        visible={visible}
        transparent
        animationType="slide"
      >

        <View style={styles.modalBg}>

          <View style={styles.modalBox}>

            <FlatList
              data={options}

              keyExtractor={(item) =>
                item.toString()
              }

              renderItem={({ item }) => (

                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {

                    onSelect(item);
                    setVisible(false);

                  }}
                >

                  <Text>
                    Beacon {item}
                  </Text>

                </TouchableOpacity>

              )}
            />

          </View>

        </View>

      </Modal>

    </View>

  );

}


const styles = StyleSheet.create({

  label: {
    color: "white",
    marginBottom: 4
  },

  dropdown: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 6
  },

  modalBg: {
    flex: 1,
    justifyContent: "center",
    backgroundColor:
      "rgba(0,0,0,0.4)"
  },

  modalBox: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 8,
    maxHeight: 400
  },

  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd"
  }

});