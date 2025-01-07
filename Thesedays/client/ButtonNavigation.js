import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native'; // Import Text component
import { styles } from './styles';

const ButtonNavigation = ({ selectedButton, onButtonPress }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, selectedButton === 'button1' && styles.selectedButton]}
        onPress={() => onButtonPress('button1')}
      >
        <Text style={styles.buttonText}>Button 1</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, selectedButton === 'button2' && styles.selectedButton]}
        onPress={() => onButtonPress('button2')}
      >
        <Text style={styles.buttonText}>Button 2</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, selectedButton === 'button3' && styles.selectedButton]}
        onPress={() => onButtonPress('button3')}
      >
        <Text style={styles.buttonText}>Button 3</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonNavigation;
