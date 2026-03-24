import React from "react";
import { SafeAreaView } from "react-native";

import { GestureHandlerRootView }
  from "react-native-gesture-handler";

import IndoorMap from "./components/IndoorMap";

export default function App() {

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>

      <SafeAreaView style={{ flex: 1 }}>

        <IndoorMap />

      </SafeAreaView>

    </GestureHandlerRootView>

  );

}