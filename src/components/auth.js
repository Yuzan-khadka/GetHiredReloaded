import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { f, auth, database } from "../backend/firebase";

export default class userAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authStep: 0,
      email: "",
      pass: "",
      moveScreen: false
    };
  }

  login = async () => {
    var email = this.state.email;
    var pass = this.state.pass;
    if (email != "" && pass != "") {
      try {
        let user = await auth.signInWithEmailAndPassword(email, pass);
      } catch (error) {
        console.log("Error...", error);
        alert(error);
      }
    } else {
      alert("Email or Password is empty!!");
    }
  };

  createUserObj = (userObj, email) => {
    console.log(userObj, email, userObj.uid);
    var uObj = {
      name: "Enter name",
      username: "@name",
      avatar: "http://www.gravatar.com/avatar",
      email: email
    };
    database
      .ref("users")
      .child(userObj.uid)
      .set(uObj);
  };

  signup = async () => {
    var email = this.state.email;
    var pass = this.state.pass;
    if (email != "" && pass != "") {
      try {
        let user = await auth
          .createUserWithEmailAndPassword(email, pass)
          .then(userObj => this.createUserObj(userObj.user, email))
          .catch(error => alert(error));
      } catch (error) {
        console.log("Error...", error);
        alert(error);
      }
    } else {
      alert("Email or Password is empty!!");
    }
  };

  componentDidMount = () => {
    if (this.props.moveScreen == true) {
      this.setState({
        moveScreen: true
      });
    }
  };

  showLogin = () => {
    if (this.state.moveScreen == true) {
      this.props.navigation.navigate("Upload");
      return false;
    }
    this.setState({ authStep: 1 });
  };

  showSignup = () => {
    if (this.state.moveScreen == true) {
      this.props.navigation.navigate("Upload");
      return false;
    }
    this.setState({ authStep: 2 });
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>You are not logged in</Text>
        <Text>{this.props.message}</Text>
        {this.state.authStep == 0 ? (
          <View style={{ marginVertical: 20, flexDirection: "row" }}>
            <TouchableOpacity onPress={() => this.showLogin()}>
              <Text style={{ fontWeight: "bold", color: "green" }}>Login</Text>
            </TouchableOpacity>
            <Text style={{ marginHorizontal: 10 }}>or</Text>

            <TouchableOpacity onPress={() => this.showSignup()}>
              <Text style={{ fontWeight: "bold", color: "blue" }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ marginVertical: 20 }}>
            {this.state.authStep == 1 ? (
              //Login
              <View>
                <Text
                  style={{
                    fontWeight: "bold",
                    marginBottom: 20,
                    borderBottomWidth: 1,
                    width: "16%"
                  }}
                >
                  Login
                </Text>
                <Text>Email Address:</Text>
                <TextInput
                  editable={true}
                  keyboardType={"email-address"}
                  placeholder={"Email"}
                  onChangeText={text => this.setState({ email: text })}
                  value={this.state.email}
                  style={{
                    width: 250,
                    marginVertical: 10,
                    padding: 5,
                    borderColor: "grey",
                    borderBottomWidth: 2,
                    borderRadius: 3
                  }}
                />
                <Text>Password:</Text>
                <TextInput
                  editable={true}
                  secureTextEntry={true}
                  placeholder={"Password"}
                  onChangeText={text => this.setState({ pass: text })}
                  value={this.state.pass}
                  style={{
                    width: 250,
                    marginVertical: 10,
                    padding: 5,
                    borderColor: "grey",
                    borderBottomWidth: 2,
                    borderRadius: 3
                  }}
                />
                <TouchableOpacity
                  onPress={() => this.login()}
                  style={{
                    backgroundColor: "#06c919",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5
                  }}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ authStep: 0 })}
                  style={{
                    backgroundColor: "red",
                    marginTop: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5
                  }}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              //signup
              <View>
                <Text
                  style={{
                    fontWeight: "bold",
                    marginBottom: 20,
                    borderBottomWidth: 1,
                    width: "20%"
                  }}
                >
                  Sign Up
                </Text>
                <Text>Email Address:</Text>
                <TextInput
                  editable={true}
                  keyboardType={"email-address"}
                  placeholder={"Email"}
                  onChangeText={text => this.setState({ email: text })}
                  value={this.state.email}
                  style={{
                    width: 250,
                    marginVertical: 10,
                    padding: 5,
                    borderColor: "grey",
                    borderBottomWidth: 2,
                    borderRadius: 3
                  }}
                />
                <Text>Password:</Text>
                <TextInput
                  editable={true}
                  secureTextEntry={true}
                  placeholder={"Password"}
                  onChangeText={text => this.setState({ pass: text })}
                  value={this.state.pass}
                  style={{
                    width: 250,
                    marginVertical: 10,
                    padding: 5,
                    borderColor: "grey",
                    borderBottomWidth: 2,
                    borderRadius: 3
                  }}
                />
                <TouchableOpacity
                  onPress={() => this.signup()}
                  style={{
                    backgroundColor: "#06c919",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5
                  }}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ authStep: 0 })}
                  style={{
                    backgroundColor: "red",
                    marginTop: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5
                  }}
                >
                  <Text style={{ color: "white", textAlign: "center" }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}
