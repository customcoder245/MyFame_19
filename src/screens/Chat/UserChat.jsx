import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Bubble,
  GiftedChat,
  Send,
  Actions,
  ActionsProps,
} from "react-native-gifted-chat";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import {
  Avatar,
  Modal,
  PaperProvider,
  Portal,
  Provider,
} from "react-native-paper";
import Back from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "react-native-document-picker";

//Icons
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import InChatFileTransfer from "./InChatFileTransfer";
import InChatViewFile from "./InChatViewFile";
import { blank, port2 } from "../../assets2/Images/allImages";
import { AuthContext } from "../../Context/AuthContext";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { Video } from "expo-av";

const Index = (props) => {
  const { userId } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [isAttachImage, setIsAttachImage] = useState(false);
  const [isAttachFile, setIsAttachFile] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [filePath, setFilePath] = useState("");
  const [fileVisible, setFileVisible] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const [videoUri, setVideoUri] = useState("");
  const [uploading, setUploading] = useState(false);

  const route = useRoute();
  const user = route.params.item;
  const docId =
    user.id > userId ? `${userId}-${user.id}` : `${user.id}-${userId}`;

  const _pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        copyTo: "documentDirectory",
        mode: "import",
        allowMultiSelection: true,
      });
      const fileUri = result[0].fileCopyUri;
      if (!fileUri) {
        console.log("File URI is undefined or null");
        return;
      }
      if (fileUri.indexOf(".png") !== -1 || fileUri.indexOf(".jpg") !== -1) {
        setImagePath(fileUri);
        setIsAttachImage(true);
      } else {
        setFilePath(fileUri);
        setIsAttachFile(true);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled file picker");
      } else {
        console.log("DocumentPicker err => ", err);
        throw err;
      }
    }
  };

  const renderChatFooter = useCallback(() => {
    if (uploading) {
      return (
        <View style={styles.chatFooter}>
          <Text style={styles.uploadingText}>Uploading File...</Text>
        </View>
      );
    }
    if (imagePath) {
      return (
        <View style={styles.chatFooter}>
          <Image
            source={{ uri: imagePath }}
            style={{ height: 75, width: 75 }}
          />
          <TouchableOpacity
            onPress={() => setImagePath("")}
            style={styles.buttonFooterChatImg}
          >
            <Ionicons name="close" size={24} color={"black"} />
          </TouchableOpacity>
        </View>
      );
    }
    if (filePath) {
      return (
        <View style={styles.chatFooter}>
          <InChatFileTransfer filePath={filePath} />
          <TouchableOpacity
            onPress={() => setFilePath("")}
            style={styles.buttonFooterChat}
          >
            <Ionicons name="close" size={24} color={"black"} />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [filePath, imagePath, uploading]);

  const chooseImage = async () => {
    const msg = messages[0];
    let mymsg = {};

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      setUploading(true);
      const imageName = result.assets[0].uri.split("/").slice(-1)[0];

      if (result.assets[0].type === "video") {
        await storage()
          .ref(`${docId}/${imageName}`)
          .putFile(result.assets[0].uri);
        const url = await storage()
          .ref(`${docId}/${imageName}`)
          .getDownloadURL();

        mymsg = {
          _id: Math.random().toString(32).substring(2, 61),
          chatId: docId,
          sendBy: userId,
          sendTo: user.id,
          image: "",
          video: url,
          createdAt: new Date(),
          text: "",
          user: {
            _id: userId,
          },
        };

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, mymsg)
        );
      } else {
        await storage()
          .ref(`${docId}/${imageName}`)
          .putFile(result.assets[0].uri);
        const url = await storage()
          .ref(`${docId}/${imageName}`)
          .getDownloadURL();

        mymsg = {
          _id: Math.random().toString(32).substring(2, 61),
          chatId: docId,
          sendBy: userId,
          sendTo: user.id,
          image: url,
          createdAt: new Date(),
          text: "",
          user: {
            _id: userId,
          },
        };

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, mymsg)
        );
      }
      await firestore()
        .collection("ChatsRoom")
        .doc(docId)
        .collection("Messages")
        .add(mymsg);
    } catch (error) {
      console.log("CHOSE IMAGE SECTION ERROR : ", error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const messageRef = firestore()
      .collection("ChatsRoom")
      .doc(docId)
      .collection("Messages")
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        if (querySnapshot) {
          const allmessage = querySnapshot.docs.map((querySnapshot) => {
            if (querySnapshot.data().createdAt) {
              return {
                ...querySnapshot.data(),
                createdAt: querySnapshot.data().createdAt.toDate(),
              };
            } else {
              return {
                ...querySnapshot.data(),
                createdAt: new Date(),
              };
            }
          });

          setMessages(allmessage);
        } else {
          alert("Unknown error occured");
        }
      });

    return () => messageRef();
  }, []);

  const onSend = useCallback(
    async (messages = []) => {
      setUploading(true);

      try {
        const [messageToSend] = messages;
        if (isAttachImage) {
          const imageName = imagePath.split("/").pop();
          await storage().ref(`${docId}/${imageName}`).putFile(imagePath);
          const url = await storage()
            .ref(`${docId}/${imageName}`)
            .getDownloadURL();
          const newMessage = {
            _id: Math.random().toString(32).substring(2, 61),
            text: messageToSend.text,
            chatId: docId,
            sendBy: userId,
            sendTo: user.id,
            createdAt: new Date(),
            user: {
              _id: userId,
              avatar: "",
            },
            image: url,
            file: {
              url: "",
            },
          };
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, newMessage)
          );
          await firestore()
            .collection("ChatsRoom")
            .doc(docId)
            .collection("Messages")
            .add(newMessage);
          setImagePath("");
          setIsAttachImage(false);
        } else if (isAttachFile) {
          const filename = filePath
            .split("/")
            .pop()
            .replace("%20", "")
            .replace(" ", "");

          await storage().ref(`files/${docId}/${filename}`).putFile(filePath);
          const url = await storage()
            .ref(`files/${docId}/${filename}`)
            .getDownloadURL();

          const newMessage = {
            _id: messages[0]._id + 1,
            text: messageToSend.text || "",
            chatId: docId,
            sendBy: userId,
            sendTo: user.id,
            createdAt: new Date(),
            user: {
              _id: userId,
              avatar: "",
            },
            image: "",
            file: {
              url: url,
            },
          };

          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, newMessage)
          );

          setFilePath("");
          setIsAttachFile(false);
          await firestore()
            .collection("ChatsRoom")
            .doc(docId)
            .collection("Messages")
            .add(newMessage);
        } else {
          if (messageToSend.text !== "") {
            const msg = {
              ...messageToSend,
              chatId: docId,
              sendBy: userId,
              sendTo: user.id,
            };
            setMessages((previousMessages) =>
              GiftedChat.append(previousMessages, msg)
            );
            firestore()
              .collection("ChatsRoom")
              .doc(docId)
              .collection("Messages")
              .add(msg);
          }
        }
      } catch (error) {
        console.log("Error while sending message ");
      } finally {
        setUploading(false);
      }
    },
    [filePath, imagePath, isAttachFile, isAttachImage]
  );

  const renderMessageVideo = (props) => {
    const { currentMessage } = props;

    return (
      <TouchableOpacity
        onPress={() => {
          setVideoUri(currentMessage.video);
          setVideoVisible(true);
        }}
      >
        <View style={{ padding: 10 }}>
          <Video
            source={{ uri: currentMessage.video }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            isLooping
            style={{ width: 250, height: 140 }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const handleCloseVideo = () => {
    setVideoVisible(false);
    setVideoUri("");
  };

  const bubble = (props) => {
    const { currentMessage } = props;

    if (currentMessage.file && currentMessage.file.url) {
      return (
        <TouchableOpacity
          style={{
            ...styles.fileContainer,
            backgroundColor:
              props.currentMessage.user._id === 1 ? "green" : "#EAECF2",
            borderBottomLeftRadius:
              props.currentMessage.user._id === 1 ? 15 : 5,
            borderBottomRightRadius:
              props.currentMessage.user._id === 1 ? 5 : 15,
          }}
          onPress={() => setFileVisible(true)}
        >
          <InChatFileTransfer
            style={{ marginTop: -10 }}
            filePath={currentMessage.file.url}
          />
          <InChatViewFile
            props={props}
            visible={fileVisible}
            onClose={() => setFileVisible(false)}
          />
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                ...styles.fileText,
                color: currentMessage.user._id === userId ? "white" : "black",
              }}
            >
              {currentMessage.text}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "green",
          },
          left: {
            backgroundColor: "#EAECF2",
            color: "#EAECF2",
          },
        }}
      />
    );
  };

  const renderSend = (props) => {
    const { text, user, onSend } = props;

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          marginHorizontal: 10,
          columnGap: 10,
        }}
      >
        <FontAwesome
          onPress={_pickDocument}
          name="paperclip"
          size={24}
          color={"blue"}
          style={{ transform: [{ rotateY: "180 deg" }] }}
        />
        <TouchableOpacity
          onPress={() => {
            onSend({ text: props.text }, true);
          }}
          containerStyle={{ justifyContent: "center" }}
          {...props}
        >
          <FontAwesome name="send" size={24} color={"orange"} />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <PaperProvider>
      <SafeAreaView style={{ height: "100%", width: "100%" }}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => props.navigation.goBack(null)}>
            <Back name="chevron-back" size={20} color="#BFC4D3" />
          </TouchableOpacity>
          <Avatar.Image
            size={35}
            source={user.profile_img ? { uri: user.profile_img } : blank}
          />
          <Text
            style={{
              color: "black",
              fontSize: 16,
              fontFamily: "pink",
              marginLeft: 5,
            }}
          >
            {user.username}
          </Text>
        </View>
        <View style={{ backgroundColor: "white", flex: 1 }}>
          <GiftedChat
            renderActions={() => (
              <MaterialIcons
                style={styles.uploadImage}
                onPress={chooseImage}
                name="photo-library"
                size={30}
                color="#000"
              />
            )}
            renderMessageVideo={renderMessageVideo}
            renderSend={renderSend}
            messages={messages}
            onSend={(messages) => onSend(messages)}
            renderBubble={bubble}
            minInputToolbarHeight={50}
            maxComposerHeight={100}
            showAvatarForEveryMessage={false}
            showUserAvatar={false}
            alwaysShowSend
            renderChatFooter={renderChatFooter}
            renderAvatar={null}
            user={{
              _id: userId,
            }}
          />
        </View>
      </SafeAreaView>
      <Portal>
        <Modal
          onDismiss={() => setVideoVisible(!videoVisible)}
          visible={videoVisible}
        >
          <View style={styles.videoContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseVideo}
            >
              <Back name="close" size={40} color="white" />
            </TouchableOpacity>
            <Video
              source={{ uri: videoUri }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              isLooping
              resizeMode="contain"
              shouldPlay
              style={styles.fullScreenVideo}
            />
          </View>
        </Modal>
      </Portal>
    </PaperProvider>
  );
};
export default Index;

const styles = StyleSheet.create({
  chatHeader: {
    width: "100%",
    backgroundColor: "#F7F8FB",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    zIndex: 1,
    paddingTop: StatusBar.currentHeight + 10,
    paddingHorizontal: 15,
    columnGap: 5,
    paddingBottom: 15,
  },
  uploadImage: {
    alignSelf: "center",
    marginLeft: 10,
  },
  chatFooter: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  buttonFooterChat: {
    // height:50,
    // width:50
  },
  videoContainer: {
    height: Dimensions.get("window").height,
  },
  fullScreenVideo: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 100,
    right: 20,
    zIndex: 1,
  },
  uploadingText: {
    color: "gray",
    fontSize: 16,
  },
});
