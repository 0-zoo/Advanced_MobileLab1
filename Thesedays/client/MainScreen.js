
/*
import { StatusBar, Linking } from 'expo-status-bar';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFonts, PlayfairDisplay_500Medium_Italic } from '@expo-google-fonts/playfair-display';
import { styles } from './styles';
import ItemComponent from './item';

const MainScreen = () => {
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

export default MainScreen;
*/

import { StatusBar, Linking } from 'expo-status-bar';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useFonts, PlayfairDisplay_500Medium_Italic } from '@expo-google-fonts/playfair-display';
import { styles } from './styles';

const MainScreen = () => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/api');
      const jsonData = await response.json();
      setData(jsonData);
      console.log(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  let [fontsLoaded] = useFonts({
    PlayfairDisplay_500Medium_Italic,
  });

  const getItemLinkById = (title) => {
    // itemId를 
    const itemLinkMap = {
      1: 'https://example.com/item1',
      2: 'https://example.com/item2',
      // ...
    };
  
    return itemLinkMap[title];
  };

  const renderItem = ({ item }) => {
    console.log(item);
    const handleItemPress = () => {
      console.log('Item pressed:', item.id); //몇번째꺼 클릭했는지 ㅇㅇ
      const link = getItemLinkById(item.title); //링크 박으면됨
      if (link) {
        Linking.openURL(link);
      }
    };

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={handleItemPress}>
          <Text>{item.title}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!fontsLoaded || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} 
        />}
      />
    </View>
  );
};

export default MainScreen;
