import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import TermsOfServiceApi from '../../Fetch_API/TermsOfServiceApi';

const TermsOfService = () => {
  const [termsData, setTermsData] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const data = await TermsOfServiceApi();
        console.log('Fetched Terms Data:', data);
        setTermsData(data);
      } catch (error) {
        console.error('Error fetching terms:', error);
      }
    };

    fetchTerms();
  }, []);

  // Function to sanitize and filter out placeholders
  const sanitizeText = (text) => {
    const placeholders = ['add_title_here', 'add_explanation_here', 'add_list_here'];
    return typeof text === 'string' && !placeholders.includes(text) ? text : null;
  };

  // Render list items
  const renderListItems = (list) => {
    return list
      .filter(item => item.add_list_here) // Filter out unwanted placeholders
      .map((item, idx) => (
        <View key={idx} style={styles.listItemContainer}>
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
            <Text style={styles.innerContentExplanation}>{sanitizeText(item.add_explanation_here)}</Text>
          )}
        </View>
      ));
  };

  const renderSection = (section, index) => {
    console.log('Rendering Section:', section); // Debugging log

    return (
      <View key={index} style={styles.section}>
        {sanitizeText(section.title) && (
          <Text style={styles.sectionTitle}>{sanitizeText(section.title)}</Text>
        )}
        {sanitizeText(section.description) && (
          <Text style={styles.sectionDescription}>{sanitizeText(section.description)}</Text>
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
          <Text style={styles.lastParagraph}>{sanitizeText(section.last_paragraph)}</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {termsData ? (
        <>
          <Text style={styles.title}>{sanitizeText(termsData.title)}</Text>
          <View style={styles.dateItem}>
            <Text style={styles.date}>{sanitizeText(termsData.update_title)}</Text>
            <Text style={styles.date}>{sanitizeText(termsData.update_date)}</Text>
          </View>

          {termsData.terms_of_service.map((term, index) => renderSection(term, index))}
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
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 26,
    maxWidth: '90%',
    marginTop: '5%',
  },
  dateItem: {
    flexDirection: 'row',
  },
  date: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 26,
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
    marginVertical: 2, // Adjust spacing between items
  },
  bulletPoint: {
    fontSize: 18, // Adjust font size for bullet point
    lineHeight: 22, // Match with text's line height
    marginRight: 5, // Space between bullet and text
  },
  listingItem: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 5, // Reduced margin for better alignment
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
});

export default TermsOfService;
