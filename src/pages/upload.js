import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  TextInput,
  ActivityIndicator,
  Dimensions
} from "react-native";
import UserAuth from "../components/auth";
import { f, auth, database, storage } from "../backend/firebase";
import ImagePicker from "react-native-image-picker";
const { height, width } = Dimensions.get("window");
export default class upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      imageId: this.uniqueId(),
      imageSelected: false,
      uploading: false,
      caption: "",
      progress: 0
    };
  }

  // _checkPermission = async () => {
  //   const { status } = await Permissions.askAsync(Permissions.CAMERA);
  //   this.setStatus({ camera: status });

  //   const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  //   this.setStatus({ cameraRoll: statusRoll });
  // };

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  uniqueId = () => {
    return (
      this.s4() +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4()
    );
  };

  findNewImage = async () => {
    this.requestCameraPermission();
    // let result = await ImagePicker.launchImageLibrary({
    //   mediaTypes: 'Images',
    //   allowsEditing: true,
    //   quality: 1
    // });
    // console.log(result);
    // if(!result.cancelled){
    //   console.log("upload image");
    //   this.uploadImage(result.uri);

    // }
    // else{
    //   console.log('cancel')
    // }
    const options = {
      noData: true
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
        this.setState({
          imageSelected: false
        });
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.log("upload image");
        //this.uploadImage(response.uri);
        this.setState({
          imageSelected: true,
          imageId: this.uniqueId(),
          uri: response.uri
        });
      }
    });
  };

  uploadPost = () => {
    if (this.state.uploading == false) {
      if (this.state.caption != "") {
        this.uploadImage(this.state.uri);
      } else {
        alert("Please enter a caption..");
      }
    } else {
      console.log("Ignore button tap as already uploading");
    }
  };

  uploadImage = async uri => {
    var that = this;
    var userid = f.auth().currentUser.uid;
    var imageId = this.state.imageId;

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(uri)[1];
    this.setState({
      currentFileType: ext,
      uploading: true
    });

    const response = await fetch(uri);
    const blob = await response.blob();
    var FilePath = imageId + "." + that.state.currentFileType;

    var uploadTask = storage
      .ref("user/" + userid + "/img")
      .child(FilePath)
      .put(blob);

    uploadTask.on(
      "state_changed",
      function(snapshot) {
        var progress = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(0);
        console.log("Upload is " + progress + "% complete");
        that.setState({
          progress: progress
        });
      },
      function(error) {
        console.log("error with upload - " + error);
      },
      function() {
        //complete
        that.setState({
          progress: 100
        });
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log(downloadURL);
          that.processUpload(downloadURL);
          //alert(downloadURL);
        });
      }
    );

    // var snapshot = ref.put(blob).on("state_changed", snapshot => {
    //   console.log("Progress", snapshot.bytesTransferred, snapshot.totalBytes);
    // });
  };

  processUpload = imageUrl => {
    var imageId = this.state.imageId;
    var userId = f.auth().currentUser.uid;
    var caption = this.state.caption;
    var dateTime = Date.now();
    var timestamp = Math.floor(dateTime / 1000);
    //Build photo object
    //author, caption, posted, url

    var photoObj = {
      author: userId,
      caption: caption,
      posted: timestamp,
      url: imageUrl
    };

    //Add to main feed
    database.ref("/photos/" + imageId).set(photoObj);

    //set user photos object
    database.ref("/users/" + userId + "/photos/" + imageId).set(photoObj);

    alert("Image Uploaded");

    this.setState({
      uploading: false,
      imageSelected: false,
      caption: "",
      uri: ""
    });
  };

  componentDidMount = () => {
    var that = this;
    f.auth().onAuthStateChanged(function(user) {
      if (user) {
        that.setState({
          loggedin: true
        });
        console.log("Logged in", user);
      } else {
        that.setState({
          loggedin: false
        });
        console.log("Logged out");
      }
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.loggedin == true ? (
          <View style={{ flex: 1 }}>
            {/*Check if an image is selected*/}
            {this.state.imageSelected == true ? (
              <View style={{ flex: 1, backgroundColor: "lightgrey" }}>
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
                  <Text>Upload</Text>
                </View>
                <View style={{ padding: 5 }}>
                  <Text style={{ marginTop: 5 }}>Caption</Text>
                  <TextInput
                    editable={true}
                    placeholder={"Enter your caption..."}
                    maxLength={150}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={text => this.setState({ caption: text })}
                    style={{
                      margin: 10,
                      height: 100,
                      padding: 5,
                      borderColor: "grey",
                      borderWidth: 1,
                      borderRadius: 3,
                      backgroundColor: "white",
                      color: "black",
                      textAlignVertical: "top"
                    }}
                  />
                  <Image
                    source={{ uri: this.state.uri }}
                    style={{
                      margin: 10,
                      resizeMode: "cover",
                      width: width - 30,
                      height: 275
                      //paddingHorizontal: 15
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => this.uploadPost()}
                    style={{
                      alignSelf: "center",
                      width: 170,
                      marginHorizontal: "auto",
                      backgroundColor: "#06c919",
                      paddingVertical: 10,
                      paddingHorizontal: 20
                    }}
                  >
                    <Text style={{ textAlign: "center", color: "white" }}>
                      Upload
                    </Text>
                  </TouchableOpacity>

                  {this.state.uploading == true ? (
                    <View style={{ marginTop: 10 }}>
                      <Text>{this.state.progress}</Text>
                      {this.state.progress != 100 ? (
                        <ActivityIndicator size="small" color="blue" />
                      ) : (
                        <Text> Processing</Text>
                      )}
                    </View>
                  ) : (
                    <View />
                  )}
                </View>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: 28, paddingBottom: 15 }}>Upload</Text>
                <TouchableOpacity
                  onPress={() => this.findNewImage()}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    backgroundColor: "#06c919",
                    borderRadius: 5
                  }}
                >
                  <Text style={{ color: "white" }}>Select Photo</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <UserAuth message={"Please Login to upload photo"} />
        )}
      </View>
    );
  }
}
