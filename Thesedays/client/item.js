import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

const ItemComponent = ({ item, onPress }) => {
    
  const getItemLinkById = (itemId) => {
    // Implement your logic to retrieve the link for the given itemId
    // For example, you can have a data structure or API call to fetch the link data
    // and return the corresponding link for the itemId
    
    // Placeholder implementation
    const linkData = {
      1: 'https://example.com/item1',
      2: 'https://example.com/item2',
      // Add more mappings for other item IDs
    };
    
    return linkData[itemId] || null; // Return the link or null if not found
  };

  
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.itemText}>{item.text}</Text>
    </TouchableOpacity>
  );
};

export default ItemComponent;
