import React, { Component } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  FlatList,
  StyleSheet,
  Image
} from "react-native";
import { f, auth, database } from "../backend/firebase";

import PhotoList from "../components/photoList";

export default class feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo_feed: [],
      refresh: false,
      loading: true
    };
  }

  componentDidMount = () => {};

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: 50,
            paddingTop: 20,
            backgroundColor: "white",
            borderColor: "lightgrey",
            borderBottomWidth: 0.5,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text>Feed</Text>
        </View>

        <PhotoList isUser={false} navigation={this.props.navigation} />
      </View>
    );
  }
}
