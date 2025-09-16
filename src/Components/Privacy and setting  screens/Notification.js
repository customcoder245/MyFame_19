import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { useState } from "react";
import { LeftArrowIcon, toggle } from "../../assets2/Icons/allIcons";
import { on } from "../../assets2/Icons/allIcons";

import ChangeToggleImage from "../../Hooks/ChangeToggleImage";
export default function Notification(props) {
  const toggleSource = toggle;
  const onSource = on;

  const {
    imageSource1,
    imageSource2,
    imageSource3,
    imageSource4,
    imageSource5,
    imageSource6,
    imageSource7,
    imageSource8,
    imageSource9,
    imageSource10,
    imageSource11,
    switchImage1,
    switchImage2,
    switchImage3,
    switchImage4,
    switchImage5,
    switchImage6,
    switchImage7,
    switchImage8,
    switchImage9,
    switchImage10,
    switchImage11,
  } = ChangeToggleImage(toggleSource, onSource);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("InAppNotification");
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "13%",
            }}
          >
            <View style={{ display: "flex", flexDirection: "collumn" }}>
              <Text style={styles.txt11}>In-app notification</Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "13%",
            }}
          >
            <View style={{ display: "flex", flexDirection: "collumn" }}>
              <Text style={styles.txt11}>Push notification schedule</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "100%",
                }}
              >
                Set a schedule to turn off notifications.
              </Text>
            </View>
            <Image source={LeftArrowIcon} style={styles.imgpar12} />
          </View>
        </TouchableOpacity>

        <Text style={styles.texthead}>INTERACTIONS</Text>

        <TouchableOpacity onPress={switchImage1}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "13%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Likes</Text>
            </View>
            <View style={{ maxWidth: "90%" }}>
              <Image
                source={imageSource1 === toggleSource ? toggleSource : onSource}
                style={styles.imgpar13}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchImage2}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "7%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Comments</Text>
            </View>
            <Image
              source={imageSource2 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchImage3}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "7%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>New followers</Text>
            </View>
            <Image
              source={imageSource3 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchImage4}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "7%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Mention and tags</Text>
            </View>
            <Image
              source={imageSource4 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchImage5}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "7%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Post you interacted with</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "95%",
                }}
              >
                Get notified when your friends comment on other friends postyou
                liked or commented on.
              </Text>
            </View>
            <Image
              source={imageSource5 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity>

        <Text style={styles.texthead}>MESSAGES</Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <View
            style={{
              gap: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.txt11}>Direct messages</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>

        <TouchableOpacity onPress={switchImage6}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10%",
            }}
          >
            <View
              style={{
                gap: 20,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.txt11}>Direct messages preview</Text>
            </View>
            <Image
              source={imageSource6 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity>

        <Text style={styles.texthead}>POST SUGGESTION</Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <View
            style={{
              gap: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.txt11}>Posts from people you follow</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>

        <Text style={styles.texthead}>INTERACTIONS</Text>

        <TouchableOpacity onPress={switchImage7}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "13%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Posts friom people you may know</Text>
            </View>
            <View style={{ maxWidth: "90%" }}>
              <Image
                source={imageSource7 === toggleSource ? toggleSource : onSource}
                style={styles.imgpar13}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchImage8}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "7%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Reposted by others</Text>
            </View>
            <Image
              source={imageSource8 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchImage9}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "7%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Posts you might like</Text>
            </View>
            <Image
              source={imageSource9 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity>

        <Text style={styles.texthead}>LIVE</Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <View
            style={{
              gap: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.txt11}>LIVE notification settings</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>

        <Text style={styles.texthead}>SCREEN TIME</Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <View
            style={{
              gap: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.txt11}>Weekly screen time updates</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>

        <Text style={styles.texthead}>OTHER</Text>

        <TouchableOpacity onPress={switchImage10}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "13%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>People you may know</Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "200",
                  paddingTop: 10,
                  maxWidth: "95%",
                }}
              >
                These are personalized nitifications shaped by your engagement
                on tiktok
              </Text>
            </View>
            <View style={{ maxWidth: "90%" }}>
              <Image
                source={
                  imageSource10 === toggleSource ? toggleSource : onSource
                }
                style={styles.imgpar13}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={switchImage11}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "7%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "collumn",
                maxWidth: "90%",
              }}
            >
              <Text style={styles.txt11}>Customized ypdates and more</Text>
            </View>
            <Image
              source={imageSource11 === toggleSource ? toggleSource : onSource}
              style={styles.imgpar13}
            />
          </View>
        </TouchableOpacity>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10%",
          }}
        >
          <View
            style={{
              gap: 20,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={styles.txt11}>Email notifications</Text>
          </View>
          <Image source={LeftArrowIcon} style={styles.imgpar12} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: "5%",
    paddingBottom: 20,
  },
  texthead: {
    fontSize: 12,
    fontWeight: "300",
    color: "#86878B",
    marginTop: "8%",
  },
  imgpar11: {
    height: 20,
    width: 18,
  },
  txt11: {
    fontSize: 17,
    color: "#161722",
    fontWeight: "500",
  },
  imgpar12: {
    height: 12,
    width: 12,
  },
  imgpar13: {
    height: 35,
    width: 45,
  },
});
