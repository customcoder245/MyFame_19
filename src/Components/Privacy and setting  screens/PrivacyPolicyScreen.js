import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import PrivacyPolicyFetch from '../../Fetch_API/PrivacyPolicyFetch';

const PrivacyPolicyScreen = () => {

  const [termsData, setTermsData] = useState(null); // State to hold fetched data

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const data = await PrivacyPolicyFetch(); // Call your fetch function
        setTermsData(data); // Set state with fetched data
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
      }
    };

    fetchTerms();
  }, []);

  // List of highlighted texts with corresponding URLs
  const highlightLinks = {
    "Users Aged under 13 Privacy Policy.": "https://myfame.com/aged-under-13-privacy-policy/",
    "Consumer Health Data Privacy Policy.": "https://myfame.com/consumer-health-data-policy/",
    "Terms of Service.": "https://myfame.com/terms-of-service/",
    "Aged under 13 Privacy Policy.": "https://myfame.com/aged-under-13-privacy-policy/",
  };

  // Function to highlight specific text and add links
  const highlightText = (text) => {
    if (!text) return text;

    // Add the email detection along with the previously defined links
    const email = 'info@myfame.com';
    const regex = new RegExp(`(${Object.keys(highlightLinks).join("|")}|${email})`, "gi");

    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (highlightLinks[part]) {
        // Create clickable text with link
        return (
          <Text
            key={index}
            style={styles.linkText} // Style for link
            onPress={() => Linking.openURL(highlightLinks[part])} // Open corresponding URL
          >
            {part}
          </Text>
        );
      } else if (part === email) {
        // Make email clickable
        return (
          <Text
            key={index}
            style={[styles.linkText, {color: 'red'}]} // Styling for email links
            onPress={() => Linking.openURL(`mailto:${email}`)} // Open mail app with email
          >
            {part}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>; // Non-highlighted parts
    });
  };

  // Function to sanitize and filter out placeholders
  const sanitizeText = (text) => {
    const placeholders = ['add_title_here', 'add_explanation_here', 'add_list_here'];
    
    return typeof text === 'string' && !placeholders.includes(text) ? text : null;
  };

  // Render list items with "123" in front
// Render list items with better styling for bullet points
const renderListItems = (list) => {
  return list
    .filter(item => item && item.add_list_here) // Filter out unwanted placeholders
    .map((item, idx) => (
      <View key={idx} style={styles.listItemContainer}>
        {/* Use a bullet point (•) instead of large dot */}
        <Text style={styles.bulletPoint}>•</Text>
        <Text style={styles.listingItem}>
          {sanitizeText(item.add_list_here)}
        </Text>
      </View>
    ));
};


  // Render inner content
  const renderInnerContent = (content) => {
    return content
      .filter(item => item.add_title_here && item.add_explanation_here) // Ensure we have both title and explanation
      .map((item, index) => (
        <View key={index} style={styles.innerContent}>
          {sanitizeText(item.add_title_here) && (
            <Text style={styles.innerContentTitle}>{sanitizeText(item.add_title_here)}</Text>
          )}
          {sanitizeText(item.add_explanation_here) && (
            <Text style={styles.innerContentExplanation}>{highlightText(sanitizeText(item.add_explanation_here))}</Text>
          )}
        </View>
      ));
  };

  // Render individual sections
  const renderSection = (section, index) => {
    return (
      <View key={index} style={styles.section}>
        {sanitizeText(section.title) && (
          <Text style={styles.sectionTitle}>{highlightText(sanitizeText(section.title))}</Text>
        )}
        {sanitizeText(section.description) && (
          <Text style={styles.sectionDescription}>{highlightText(sanitizeText(section.description))}</Text>
        )}
        {section.listing && Array.isArray(section.listing) && section.listing.length > 0 ? (
          <View style={styles.listing}>
            {renderListItems(section.listing)}
          </View>
        ) : null}
        {section.terms_inner_content && Array.isArray(section.terms_inner_content) && section.terms_inner_content.length > 0 ? (
          renderInnerContent(section.terms_inner_content)
        ) : null}
        {sanitizeText(section.last_paragraph) && (
          <Text style={styles.lastParagraph}>{highlightText(sanitizeText(section.last_paragraph))}</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {termsData && !termsData.error ? (
        <>
          <Text style={styles.title}>{termsData.title}</Text>
          <View style={styles.dateItem}>
            <Text style={styles.dateTitle}>Rofhub and MyFame:</Text>
            <Text style={styles.date}>{termsData.title}</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateTitle}>{termsData.update_title}</Text>
            <Text style={styles.date}>{termsData.update_date}</Text>
          </View>

          {/* No need to manually add clickable email here as all instances will be clickable now */}
          
          <Text style={styles.content}>{highlightText(termsData.content)}</Text>
          {termsData.privacy_policy.map((policy, index) => renderSection(policy, index))}
        </>
      ) : (
        <ActivityIndicator size="large" color="#00A4FF" />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '5%',
    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 41,
    color: '#141414',
    marginVertical: '5%',
  },
  content: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    marginTop: '10%',
  },
  dateTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateItem: {
    flexDirection: 'row',
    marginVertical: '2%',
  },
  date: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    marginVertical: '5%',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#141414',
  },
  sectionDescription: {
    fontSize: 16,
    color: '#000000',
    marginVertical: '2%',
  },
  listing: {
    marginVertical: '2%',
  },
  listItemContainer: {
    flexDirection: 'row', // Align bullet and text horizontally
    alignItems: 'flex-start', // Ensure the bullet aligns at the top of the text
    marginVertical: 5, // Adjust spacing between items
  },
  bulletPoint: {
    fontSize: 18, // Adjust font size for bullet point
    lineHeight: 22, // Match with text's line height
    marginRight: 5, // Space between bullet and text
  },
  listingItem: {
    fontSize: 16, // Normal font size for list content
    color: '#000000',
    lineHeight: 22, // Adjust line height for better spacing between lines
    flex: 1, // Ensure the text takes remaining space
  },
  innerContent: {
    marginVertical: '2%',
  },
  innerContentTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#141414',
  },
  innerContentExplanation: {
    fontSize: 16,
    color: '#000000',
  },
  lastParagraph: {
    fontSize: 16,
    color: '#000000',
    marginVertical: '2%',
  },
  linkText: {
    color: 'red',
  },
});

export default PrivacyPolicyScreen;
