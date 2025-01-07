/* import Axios from "axios";
import React, {useState} from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';


const HeaderNavigation = ({onButtonPress}) => {

  const handleTextPress = () => {
    onButtonPress('button2');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleTextPress}>
        <Text style={[styles.logoText, { fontFamily: 'PlayfairDisplay_500Medium_Italic' }]}>thesedays</Text>
      </TouchableOpacity>
    </View>
  );
};  

export default HeaderNavigation;  */
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

const HeaderNavigation = () => {
  const navigation = useNavigation();

  const handleTextPress = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleTextPress}>
        <Text style={[styles.logoText, { fontFamily: 'PlayfairDisplay_500Medium_Italic' }]}>thesedays</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HeaderNavigation;