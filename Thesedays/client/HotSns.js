import { StatusBar, Linking } from 'expo-status-bar';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFonts, PlayfairDisplay_500Medium_Italic } from '@expo-google-fonts/playfair-display';
import { styles } from './styles';
import ItemComponent from './item';

const HotSns = () => {
  const data = Array.from({ length: 20 }, (_, index) => ({ id: index + 1, text: `Item ${index + 1}`,isScraped: false }));
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  let [fontsLoaded] = useFonts({
    PlayfairDisplay_500Medium_Italic,
  });

  

  const renderItem = ({ item }) => {
    const handleItemPress = () => {
      // Handle item press here
      console.log('Item pressed:', item.id);

      // Example: Open a link based on the item ID
      const link = getItemLinkById(item.id); // Implement a function to get the corresponding link for the item ID
      if (link) {
        Linking.openURL(link);
      }
    };

    return <ItemComponent item={item} onPress={handleItemPress} />;
  };


  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <StatusBar style="auto" />
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

export default HotSns;