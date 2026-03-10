// YourComponent.js
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import IntellectualSourceSoftwareFetch from "../../Fetch_API/IntellectualSourceSoftwareFetch";

const IntellectualPolicy = ({ navigation }) => {
  const [termsData, setTermsData] = useState(null); // State to hold fetched data

  useEffect(() => {
    const fetchTerms = async () => {
      const data = await IntellectualSourceSoftwareFetch(); // Call your fetch function
      setTermsData(data); // Set state with fetched data
    };

    fetchTerms();
  }, []);

  // Function to highlight specific text and add navigation
  const highlightText = (text) => {
    if (!text) return text;

    const regex = /Terms of Service|Community Guidelines/g;

    const parts = text.split(regex);
    const matches = text.match(regex);

    return parts.map((part, index) => (
      <Text key={index} style={styles.content}>
        {part}
        {matches && matches[index] ? (
          <Text
            style={styles.redText}
            onPress={() => {
              if (matches[index] === "Terms of Service") {
                Linking.openURL("https://myfame.com/terms-of-service/");
              } else if (matches[index] === "Community Guidelines") {
                Linking.openURL("https://myfame.com/community-guidelines/");
              }
            }}
          >
            {matches[index]}
          </Text>
        ) : null}
      </Text>
    ));
  };

  return (
    <ScrollView style={{ backgroundColor: "white", flex: 1 }}>
      <View style={styles.container}>
        {termsData && !termsData.error ? (
          <>
            <Text style={styles.title}> {termsData.title}</Text>
            <View style={styles.dateItem}>
              <Text style={styles.dateTitle}>{termsData.update_title}</Text>
              <Text style={styles.date}>{termsData.update_date}</Text>
            </View>
            <Text style={styles.content}>
              {highlightText(termsData.content)}
            </Text>

            {/* Render property_policy using map */}
            <View style={styles.policyContainer}>
              {termsData.property_policy.map((item, index) => (
                <View key={index} style={styles.policyItem}>
                  <Text style={styles.policyTitle}>{item.title}</Text>
                  <Text style={[styles.policyDescription, styles.marginTop]}>
                    {highlightText(item.description)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <ActivityIndicator size="large" color="#00A4FF" />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "5%",
    backgroundColor: "white",
  },
  title: {
    fontWeight: "bold",
    fontSize: 41,
    color: "#141414",
    marginVertical: "5%",
  },
  content: {
    fontSize: 14,
    lineHeight: 19,
    marginTop: "5%",
  },
  dateTitle: {
    fontWeight: "bold",
    fontSize: 17,
  },
  dateItem: {
    flexDirection: "row",
  },
  policyTitle: {
    fontWeight: "bold",
    fontSize: 17,
  },
  policyItem: {
    marginTop: "7%",
  },
  redText: {
    color: "red",

  },
  marginTop: {
    marginTop: "5%",
  },
});

export default IntellectualPolicy;
