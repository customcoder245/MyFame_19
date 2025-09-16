import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Linking, // Add Linking for opening URLs
} from "react-native";
import CommunityGuidelinesFetch from '../../Fetch_API/CommunityGuidelinesFetch';

const CommunityGuidelines = () => {
  const [termsData, setTermsData] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const data = await CommunityGuidelinesFetch(); // Call your fetch function
        setTermsData(data); // Set state with fetched data
      } catch (error) {
        console.error('Error fetching community guidelines:', error);
        setTermsData({ error: true }); // Handle error state
      }
    };

    fetchTerms();
  }, []);

  // Function to highlight specific text and add links
  const highlightText = (text) => {
    if (!text) return text;

    // List of texts to highlight and corresponding URLs
    const highlights = {
      "Safety and Well Being": "https://myfame.com/safety-and-well-being-youth/",
      "safety guide": "https://myfame.com/safety-guideline/"
    };
    
    const regex = new RegExp(`(${Object.keys(highlights).join("|")})`, "g");

    // Use the split method and map through the parts
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (highlights[part]) {
        return (
          <Text
            key={index}
            style={styles.linkText} // Style for clickable link
            onPress={() => Linking.openURL(highlights[part])} // Open URL on click
          >
            {part}
          </Text>
        );
      }
      return part; // Return non-highlighted parts as plain text
    });
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {termsData && !termsData.error ? (
          <>
            <Text style={styles.title}>{termsData.title}</Text>
            <Text style={styles.overviewTitle}>{termsData.overview_title}</Text>

            {/* Render guidelines dates using map */}
            <View style={styles.datesContainer}>
              {termsData.guidelines_dates.map((item, index) => (
                <View key={index} style={styles.dateItem}>
                  <Text style={styles.dateTitle}>{item.title}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.content}>{highlightText(termsData.content)}</Text>

            <Text style={styles.contentModerationTitle}>{termsData.content_moderation_title}</Text>
            <Text style={styles.content}>{highlightText(termsData.content_moderation_description)}</Text>

            {/* Render content moderation points using map */}
            <View style={styles.pointsContainer}>
              {termsData.content_moderation_points.map((item, index) => (
                <View key={index} style={styles.pointItem}>
                  <View style={styles.pointHeader}>
                    <Text style={styles.pointBullet}>.</Text>
                    <Text style={styles.overviewTitle}>{highlightText(item.point_title)}</Text>
                  </View>
                  <Text style={styles.content}>{highlightText(item.point_description)}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.closingStatement}>{highlightText(termsData.closing_statement)}</Text>
          </>
        ) : (
          <ActivityIndicator size="large" color="#00A4FF" />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "white",
    flex: 1,
  },
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
  },
  overviewTitle: {
    fontWeight: "bold",
    fontSize: 17,
  },
  dateTitle: {
    fontWeight: "bold",
    fontSize: 17,
  },
  dateItem: {
    flexDirection: "row",
  },
  datesContainer: {
    marginTop: "4%",
  },
  date: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000000",
    lineHeight: 26,
  },
  contentModerationTitle: {
    fontWeight: "bold",
    fontSize: 17,
    paddingVertical: "8%",
  },
  pointItem: {
    marginTop: "10%",
  },
  closingStatement: {
    fontSize: 14,
    lineHeight: 19,
    color: "#000000",
    marginTop: "9%",
  },
  linkText: {
    color: 'red', // Style for the link

  },
  pointHeader: {
    flexDirection: "row",
  },
  pointBullet: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 40,
    position: "absolute",
    bottom: "-8%",
    left: "-3%",
  },
});

export default CommunityGuidelines;
