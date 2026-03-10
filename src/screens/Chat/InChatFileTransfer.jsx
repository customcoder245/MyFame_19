import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const InChatFileTransfer = ({filePath}) => {

  var fileType = '';
  var name = '';
  if (filePath !== undefined && filePath.startsWith('https://')) {
    name = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.indexOf('?')).split('%').pop().replace('2F','');
    fileType= name.split('.').pop().toLowerCase();
  }
  else{
    name = filePath.substring(filePath.lastIndexOf('/') + 1);
    fileType = name.split('.').pop().toLowerCase();
  }
  return (
    <View style={styles.container}>
      <View
        style={styles.frame}
      >
         <Image
            source={
              fileType === 'pdf'
                ? require('../../assets2/Images/pdf.png')
                : require('../../assets2/Images/ukn.png')
            }
            style={{height: 60, width: 60}}
            resizeMode='contain'
          />
        <View>
          <Text style={styles.text}>
            {name.replace('%20', '').replace(' ', '')}
          </Text>
          <Text style={styles.textType}>{fileType.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
};
export default InChatFileTransfer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    borderRadius: 15,
    padding: 5,
  },
  text: {
    color: 'black',
    marginTop: 10,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  textType: {
    color: 'white',
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  frame: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 5,
    marginTop: -4,
  },
});