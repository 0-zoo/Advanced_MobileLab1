import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import MainScreen from './MainScreen';
import HotSns from './HotSns';
import Scrap from './Scrap';
import { styles } from './styles';
import HeaderNavigation from './HeaderNavigation';


const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <View style={styles.header}>
        <HeaderNavigation />
      </View>
      <Tab.Navigator
        screenOptions={
          ({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Main') {
              iconName = 'home';
            } else if (route.name === 'HotSns') {
              iconName = 'whatshot';
            } else if (route.name === 'Scrap') {
              iconName = 'bookmark';
            }

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarLabel: () => null,
          headerShown: false,
        })}
        tabBarOptions={{
          activeTintColor: 'gold',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="HotSns" component={HotSns} />
        <Tab.Screen name="Main" component={MainScreen} />
        <Tab.Screen name="Scrap" component={Scrap} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;