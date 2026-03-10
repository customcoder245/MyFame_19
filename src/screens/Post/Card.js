import { StyleSheet, Text, TouchableOpacity, View,Switch } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'

const Card = ({title='',icon,variant,onValueChange,value,iconStyle,onPress,videoLinks}) => {
  return (
    <TouchableOpacity onPress={onPress} style ={styles.container}>
      <Ionicons style={iconStyle} name={icon} color={'black'} size={24} />
      <View style={{flex:1,marginLeft:10}}>
        {
          videoLinks !== undefined && videoLinks.length>0 ?
            videoLinks.map(item=>(
              <Text style={{width:'70%',fontSize:14,color:'grey',textAlign:'left'}}>{item}</Text>
            ))
            :
          <Text style={{width:'70%',fontSize:14,color:'grey',textAlign:'left'}}>{title}</Text>
        }
      </View>
      {
        variant === 'switch'?
        <Switch
        trackColor={{false: '#767577', true: '#228B22'}}
        thumbColor={value ? '#90EE90' : 'grey'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
      :
      variant === 'link' ?
      <Ionicons name='add' color={'black'} size={24} />
      :
        <Ionicons name='chevron-forward' color={'black'} size={24} />
      }
    </TouchableOpacity>
  )
}

export default Card

const styles = StyleSheet.create({
    container:{
        flexDirection : 'row',
        justifyContent:'space-between',
        alignItems : 'center',
        paddingVertical:10
    }
})