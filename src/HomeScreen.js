import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, ActivityIndicator } from 'react-native-paper';

export default function HomeScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const getData = async () => {
      await getUsers();
    };
    getData();
  }, []);

  const getUsers = async () => {
    try {
      setLoading(true);
      const { token } = JSON.parse(await AsyncStorage.getItem('token'));
      const response = await fetch(
        page === 0
          ? 'http://68.183.48.101:3333/users/list'
          : 'http://68.183.48.101:3333/users/list?page=' + page,
        {
          method: 'Get',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data } = await response.json();
      setLoading(false);
      setPage(parseInt(data.pagination.page));
      setUsers([...users, ...data.users]);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getNextUsersData = async () => {
      if (page !== 0) {
        await getUsers();
      }
    };
    getNextUsersData();
  }, [page]);

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-evenly',
          flexDirection: 'row',
          margin: '3%',
        }}>
        <View style={{ flex: 1 }}>
          <Avatar.Image size={80} source={{ uri: item.profile_pic }} />
        </View>
        <View style={{ flex: 2.5, justifyContent: 'center' }}>
          <Text>
            {item.username}
            {'\n'}
            {item.email}
          </Text>
        </View>
      </View>
    );
  };
  if (loading && page === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} color={'#000'} />
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
      <Text>Home Screen</Text>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
        onEndReached={async () => {
          await setPage(page + 1);
        }}
      />
    </SafeAreaView>
  );
}
