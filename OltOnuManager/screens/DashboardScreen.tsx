import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { deviceAPI } from '../api';
import { OLTDevice, ONUDevice } from '../types/devices';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

const DashboardScreen = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const [oltDevices, setOltDevices] = useState<OLTDevice[]>([]);
  const [onuDevices, setOnuDevices] = useState<ONUDevice[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDevices = async () => {
    try {
      setRefreshing(true);
      const olts: OLTDevice[] = await deviceAPI.getOLTDevices();
      setOltDevices(olts);
      
      // Get ONUs for the first OLT if available
      if (olts.length > 0) {
        const onus: ONUDevice[] = await deviceAPI.getONUDevices(olts[0].id);
        setOnuDevices(onus);
      }
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const onRefresh = () => {
    fetchDevices();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>OLT/ONU Management</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OLT Devices</Text>
        {oltDevices.map(device => (
          <View key={device.id} style={styles.deviceCard}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <Text style={[
              styles.deviceStatus,
              device.status === 'online' ? styles.online : styles.offline
            ]}>
              {device.status.toUpperCase()}
            </Text>
            <Text style={styles.deviceDetail}>IP: {device.ip}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ONU Devices</Text>
        {onuDevices.map(device => (
          <View key={device.id} style={styles.deviceCard}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <Text style={[
              styles.deviceStatus,
              device.status === 'online' ? styles.online : styles.offline
            ]}>
              {device.status.toUpperCase()}
            </Text>
            <Text style={styles.deviceDetail}>Connected to: {device.connectedTo}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E86C1',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  deviceCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  deviceStatus: {
    fontSize: 14,
    marginBottom: 5,
  },
  deviceDetail: {
    fontSize: 14,
    color: '#666',
  },
  online: {
    color: '#27AE60',
  },
  offline: {
    color: '#E74C3C',
  },
});

export default DashboardScreen;