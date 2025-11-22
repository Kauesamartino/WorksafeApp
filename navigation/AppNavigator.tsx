import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Text } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import AutoavaliacoesListScreen from '../screens/AutoavaliacoesListScreen';
import RecomendacoesListScreen from '../screens/RecomendacoesListScreen';
import AlertasListScreen from '../screens/AlertasListScreen';
import WearableDataScreen from '../screens/WearableDataScreen';
import PerfilScreen from '../screens/PerfilScreen';
import RecomendacaoFormScreen from '../screens/RecomendacaoFormScreen';
import AutoavaliacaoFormScreen from '../screens/AutoavaliacaoFormScreen';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

// Wrapper simples para adicionar padding top apenas
function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.screenContainer}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 50,
  },
});

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Autoavaliacoes') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Recomendacoes') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Alertas') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Sensores') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else {
            iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 14,
          paddingTop: 8,
          height: 72,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.08,
          shadowRadius: 3,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 3,
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginBottom: 3,
        },
        headerShown: false
      })}
    >
      <Tabs.Screen 
        name="Dashboard" 
        options={{ 
          title: 'Painel'
        }}
      >
        {() => (
          <ScreenWrapper>
            <DashboardScreen />
          </ScreenWrapper>
        )}
      </Tabs.Screen>
      <Tabs.Screen 
        name="Autoavaliacoes" 
        options={{ 
          title: 'Avaliações'
        }}
      >
        {() => (
          <ScreenWrapper>
            <AutoavaliacoesListScreen />
          </ScreenWrapper>
        )}
      </Tabs.Screen>
      <Tabs.Screen 
        name="Recomendacoes" 
        options={{ 
          title: 'Dicas'
        }}
      >
        {() => (
          <ScreenWrapper>
            <RecomendacoesListScreen />
          </ScreenWrapper>
        )}
      </Tabs.Screen>
      <Tabs.Screen 
        name="Alertas" 
        options={{ 
          title: 'Alertas'
        }}
      >
        {() => (
          <ScreenWrapper>
            <AlertasListScreen />
          </ScreenWrapper>
        )}
      </Tabs.Screen>
      <Tabs.Screen 
        name="Sensores" 
        options={{ 
          title: 'Sensores'
        }}
      >
        {() => (
          <ScreenWrapper>
            <WearableDataScreen />
          </ScreenWrapper>
        )}
      </Tabs.Screen>
      <Tabs.Screen 
        name="Perfil" 
        options={{ 
          title: 'Perfil'
        }}
      >
        {() => (
          <ScreenWrapper>
            <PerfilScreen />
          </ScreenWrapper>
        )}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
            color: '#1F2937',
          },
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name="Root" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen 
          name="AutoavaliacaoForm" 
          component={AutoavaliacaoFormScreen}
          options={{ 
            title: '✏️ Nova Autoavaliação',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '700',
              color: '#059669',
            }
          }}
        />
        <Stack.Screen 
          name="RecomendacaoForm" 
          component={RecomendacaoFormScreen}
          options={{ 
            title: '💡 Nova Recomendação',
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '700',
              color: '#10B981',
            }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
