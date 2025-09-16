import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { image1, mail } from "../../assets2/Icons/allIcons";
import { logo3 } from "../../assets2/Icons/allIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from 'react-native-toast-message';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { BASE_URL } from "../../Fetch_API/BaseURL";
const CELL_COUNT = 6;
const CELL_SIZE = 70;

export default function VerifyOtp() {
    const [email, setEmail] = useState("");
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const navigation = useNavigation()
    const { params } = useRoute()

    console.log("Params are : ", params.userID)


    const handleCodeVerification = async (code) => {

        // console.log(code)

        try {
            const response = await fetch(
                `${BASE_URL}/verifyotp/v1/verifyOtp/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userid: params.userID.toString(),
                        otp: code
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: data.message
                })

                setTimeout(() => {
                    navigation.navigate('ResetPassword', {
                        userID: params.userID
                    })
                }, 1500)
            } else {

                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: data.message
                })
                console.error("Error:", data);
            }
        } catch (error) {

            console.error("Error:", error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An error occurred. Please try again later.'
            })
        }

    };


    const renderCell = ({ index, symbol, isFocused }) => {
        return (
            <Text
                allowFontScaling={false}
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
        );
    };



    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <ImageBackground source={image1} style={styles.background}>
                {/* <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]}
          style={styles.overlay}
        > */}
                <Image source={logo3} style={styles.logo} resizeMode="contain" />

                <View style={styles.inputContainer_1}>
                    <View style={{ alignItems: "center", marginTop: "5%", width: '50%' }}>
                        <Text style={styles.maintxt}>Verify OTP</Text>
                        <Text style={styles.discr}>
                            Enter the otp that we've just sent you.
                        </Text>
                    </View>

                    <View style={{ alignItems: "center", }}>

                        <CodeField
                            ref={ref}
                            {...props}
                            value={value}
                            onChangeText={code => {
                                setValue(code);
                                if (code.length === CELL_COUNT) handleCodeVerification(code);
                            }}
                            cellCount={CELL_COUNT}
                            rootStyle={styles.codeFieldRoot}
                            textContentType="oneTimeCode"
                            renderCell={renderCell}
                            keyboardType="number-pad"
                            autoFocus={true}
                        />

                    </View>
                </View>
                <Toast
                    position="top"
                    topOffset={20}
                    visibilityTime={3000}
                />

                {/* </LinearGradient> */}
            </ImageBackground>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: "center",
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlay: {
        flex: 1,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
    },
    lockIcon: {
        position: "absolute",
        left: 15,
        top: 15,
        width: 20,
        height: 20,
        resizeMode: "contain",
    },
    logo: {
        height: 230,
        width: 230,
        marginTop: -85,
    },
    inputContainer_1: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    frpasstxt: {
        color: "white",
        marginTop: 15,
    },
    btnsign1mn_2: {
        backgroundColor: "#00E2FF",
        alignItems: "center",
        paddingVertical: 20,
        width: "50%",
        borderRadius: 10,
        marginTop: "20%",
    },
    didntantxt: {
        color: "white",
        fontWeight: "100",
    },
    siguytxt: {
        color: "#00E6FF",
        fontWeight: "300",
    },
    dntfrmn_txts: {
        display: "flex",
        flexDirection: "row",
        marginTop: 20,
    },
    maintxt: {
        fontSize: 26,
        fontWeight: "300",
        color: "white",
    },
    discr: {
        color: "white",
        fontWeight: "100",
        textAlign: "center",
        width: "70%",
        marginTop: "10%",
    },
    codeFieldRoot: {
        height: CELL_SIZE,
        marginTop: 30,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    ContentContainer: {
        // backgroundColor : 'red',
        marginTop: 114,
    },
    cell: {
        marginHorizontal: 5,
        height: 52,
        width: 45,
        fontSize: 20,
        borderRadius: 5,
        color: '#3759b8',
        backgroundColor: '#fff',
        borderColor: 'grey',
        borderWidth: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});
