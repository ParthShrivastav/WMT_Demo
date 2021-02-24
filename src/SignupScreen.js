import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, TextInput, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  const URL = 'http://68.183.48.101:3333/users/register';

  const body = { username, email, password };
  const signupButtonPressed = async () => {
    if (
      username === null ||
      email === null ||
      password === null ||
      confirmPassword === null
    ) {
      return alert('Please enter all the details to proceed!');
    } else if (password !== confirmPassword) {
      return alert('Password does not match with the confirm password');
    } else {
      try {
        setLoading(true);
        console.log(body, 'Body');

        const response = await fetch(URL, {
          method: 'Post',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(body),
        });
        const { meta, data } = await response.json();
        setLoading(false);
        if (response.status === 201) {
          alert('User created successfully');
          console.log(meta, data, '201 response');
          await AsyncStorage.setItem('user', JSON.stringify(data.user));
          await AsyncStorage.setItem('token', JSON.stringify(data.token));
          navigation.navigate('Home');
        } else if (response.status === 422) {
          alert(
            'User with the same username or email already exists. Please try with some unique information'
          );
        } else {
          alert('Something went wrong! Please try again after sometime');
        }
        console.log(response, meta, 'Response from Signup');
      } catch (error) {
        setLoading(false);
        console.log(error, 'Error signup');
        alert(error, 'Something went wrong!');
      }
    }
  };
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} color={'#000'} />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, margin: '5%', justifyContent: 'space-around' }}>
      <TextInput
        label="User Name"
        value={username}
        onChangeText={(text) => setUsername(text)}
        type="outlined"
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        type="outlined"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        type="outlined"
      />

      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        type="outlined"
      />
      <Button mode="contained" onPress={signupButtonPressed}>
        Signup
      </Button>
    </View>
  );
}
