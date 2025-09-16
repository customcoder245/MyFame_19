import { ImageBackground, StyleSheet, Text, View, Alert, Image } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'

import { PenStrokeIco2 } from '../src/assets2/Icons/allIcons'

import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const CustomDrawer = (props) => {
    return (


        <View style={{ flex: 1 }}>
            <DrawerContentScrollView contentContainerStyle={{ paddingTop: 0 }}  >

                <ImageBackground style={{ width: "100%", paddingBottom: 25 }} >

                    <Text style={styles.welcometxt}>Welcome to Eat Out</Text>
                    <Text style={styles.crntxt}>Current City,</Text>
                    <View style={{ flexDirection: "row", gap: 80 }}>
                        {/* <FontAwesome5 name="coins" size={14} color="white"/> */}

                        <Text style={styles.locationtxt}>Sarasota, Florida</Text>
                        <TouchableOpacity>

                            <Image

                                source={PenStrokeIco2}
                            />

                        </TouchableOpacity>

                    </View>




                </ImageBackground>

                <View style={styles.mainfood}>


                    <View style={styles.foodbtnm}>

                        <TouchableOpacity style={styles.foodbtn}

                            onPress={() => {


                                Alert.alert("Food")
                            }}

                        >

                            <Text style={styles.foodtxt}>FOOD</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.nonfoodbtnm}>

                        <TouchableOpacity style={styles.NONFOODbtn}

                            onPress={() => {


                                Alert.alert("No Food")
                            }}
                        >

                            <Text style={styles.NONFOODtxt}>NON-FOOD</Text>
                        </TouchableOpacity>

                    </View>

                </View>



                <DrawerItemList {...props} />



            </DrawerContentScrollView>

        </View>
    )

}





const styles = StyleSheet.create({


    welcometxt: {
        color: "#e6e6e6",
        fontSize: 20,
        fontWeight: "500",
        marginLeft: 17,
        marginTop: 50
    },
    crntxt: {
        color: "#e6e6e6",
        fontSize: 15,
        fontWeight: "200",
        marginLeft: 17,
        marginTop: 50


    },
    locationtxt: {
        color: "#e6e6e6",
        fontSize: 18,
        fontWeight: "500",
        marginLeft: 17,
        marginTop: 20
    },
    foodbtn: {

        backgroundColor: "#67D945",
        width: "80%",
        alignItems: "center",
        paddingVertical: 13,
        borderRadius: 4

    },
    foodtxt: {
        color: "white",
        fontSize: 14,
        fontWeight: "500"
    },
    NONFOODtxt: {
        color: "black    ",
        fontSize: 14,
        fontWeight: "500"
    },
    NONFOODbtn: {
        backgroundColor: "#D9D9D9",
        width: "80%",
        alignItems: "center",
        paddingVertical: 13,
        borderRadius: 4
    },
    mainfood: {
        flexDirection: "row",
        marginTop: 35,
        marginBottom: 30,
        gap: -15

    },
    foodbtnm: {
        width: "50%",
        marginLeft: 23
    },
    nonfoodbtnm: {
        width: "50%"

    }





})









export default CustomDrawer