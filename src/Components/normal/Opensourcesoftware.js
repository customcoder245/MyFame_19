// YourComponent.js
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import OpenSourceSoftwareFetch from '../../Fetch_API/OpenSourceSoftwareFetch';


const Opensourcesoftware = () => {
  const [termsData, setTermsData] = useState(null); // State to hold fetched data

  useEffect(() => {
    const fetchTerms = async () => {
      const data = await OpenSourceSoftwareFetch(); // Call your fetch function
      setTermsData(data); // Set state with fetched data
    };   
    fetchTerms();
  }, []);

  return (
    <ScrollView style={{backgroundColor:"white" , flex:1}}>
    <View style={styles.container}>
     
      {termsData && !termsData.error ? (
        <>
          <Text style={styles.title}> {termsData.title}</Text>
          <Text style={styles.title2}> {termsData.first_sub_heading}</Text>
          <Text style={styles.content}> {termsData.first_sub_heading_content}</Text>
          <Text style={styles.title3}> {termsData.second_sub_heading}</Text>
          <Text style={styles.content}> {termsData.second_sub_heading_content}</Text>

           
        </>
      ) : (
        // <Text>{termsData ? termsData.error : 'Loading...'}</Text>

        <ActivityIndicator size="large" color="#00A4FF" />

      )}

    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  container:{
flex:1,
padding:"5%",
backgroundColor:"white"

  },
  title: {
    fontWeight: "bold",
    fontSize: 41,
    color: "#141414",
    marginVertical: "5%",
  },
content:{
  fontSize:14,
  fontWeight:"400",
  color:"#000000",
  lineHeight:21,
  marginTop:"2%"
  
},
title2:{
  fontWeight:"600",
  fontSize:28,
  color:"#141414",

  
  },
  title3:{
    fontWeight:"600",
    fontSize:28,
    color:"#141414",
    marginTop:"12%"
    },
})


export default Opensourcesoftware;
