import React, { Component } from "react";
import { Text, View } from "react-native";
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator
} from "react-navigation";
import { f, auth, database } from "./src/backend/firebase";

import feed from "./src/pages/feed";
import profile from "./src/pages/profile";
import upload from "./src/pages/upload";
import userProfile from "./src/pages/userProfile";
import comments from "./src/pages/comments";

export default class App extends Component {
  

  constructor(props) {
    super(props);
   
  }

  render() {
    return <AppContainer />;
  }
}

const TabStack = createBottomTabNavigator({
  Feed: { screen: feed },
  Upload: { screen: upload },
  Profile: { screen: profile }
});

const MainStack = createStackNavigator(
  {
    Home: { screen: TabStack },
    Users: { screen: userProfile },
    Comments: { screen: comments }
  },
  {
    initialRouteName: "Home",
    mode: "modal",
    headerMode: "none"
  }
);
const AppContainer = createAppContainer(MainStack);

// import React, { Component } from "react";
// import { Text, View, TextInput, TouchableHighlight } from "react-native";
//
// export default class HelloWorldApp extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       loggedin: false
//     };
//     // this.registerUser("test@gmail.com", "fakepassword");
//     // this.registerUser("Sanjay@gmail.com", "fakepassword");

//     var that = this;
//     f.auth().onAuthStateChanged(user => {
//       if (user) {
//         that.setState({
//           loggedin: true
//         });
//         console.log("Logged in", user);
//       } else {
//         that.setState({
//           loggedin: false
//         });
//         console.log("Logged out");
//       }
//     });
//   }

//   loginUser = async (email, pass) => {
//     if (email != "" && pass != "") {
//       try {
//         let user = await auth.signInWithEmailAndPassword(email, pass);
//         console.log(user);
//       } catch (error) {
//         console.log("Error...", error);
//       }
//     }
//   };

//   registerUser = (email, password) => {
//     console.log(email, password);
//     auth
//       .createUserWithEmailAndPassword(email, password)
//       .then(userObj => console.log(email, password, userObj))
//       .catch(error => console.log("error", error));
//   };

//   signUserOut = () => {
//     auth
//       .signOut()
//       .then(() => {
//         console.log("Logged out...");
//       })
//       .catch(error => {
//         console.log("Error", error);
//       });
//   };

//   render() {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         {this.state.loggedin == true ? (
//           <View>
//             <Text>Logged in...</Text>
//             <TouchableHighlight
//               onPress={() => this.signUserOut()}
//               style={{ backgroundColor: "blue" }}
//             >
//               <Text>Log out</Text>
//             </TouchableHighlight>
//           </View>
//         ) : (
//           <View>
//             <Text>Hello World</Text>
//             {this.state.emailLoginView == true ? (
//               <View>
//                 <Text>Email:</Text>
//                 <TextInput
//                   onChangeText={text => this.setState({ email: text })}
//                   value={this.state.email}
//                 />
//                 <Text>Password:</Text>
//                 <TextInput
//                   onChangeText={text => this.setState({ pass: text })}
//                   secureTextEntry={true}
//                   value={this.state.pass}
//                 />

//                 <TouchableHighlight
//                   onPress={() =>
//                     this.loginUser(this.state.email, this.state.pass)
//                   }
//                   style={{ backgroundColor: "blue" }}
//                 >
//                   <Text>Login</Text>
//                 </TouchableHighlight>
//               </View>
//             ) : (
//               <View>

//               </View>
//             )}
//             <TouchableHighlight
//                   onPress={() => this.setState({ emailLoginView: true })}
//                   style={{ backgroundColor: "green" }}
//                 >
//                   <Text style={{ color: "white" }}>Login With email</Text>
//                 </TouchableHighlight>
//           </View>
//         )}
//       </View>
//     );
//   }
// }
