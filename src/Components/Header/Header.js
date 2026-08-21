import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
const Header = ({title,handlePress}) => {
  return (
    <View style={styles.container}>
        <Ionicons onPress={handlePress} name='chevron-back' color={'black'} size={24} />
     <View style={{flex:1}}>   
      <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container:{
        paddingBottom:13,
        flexDirection:'row',
        alignItems:'center',
        borderBottomColor:'#D0D1D3',
        borderBottomWidth:1
    },
    title:{
        textAlign:'center',
        fontSize : 17,
        fontWeight : '600',
        color : '#000',
        marginLeft:-10,
    }
})