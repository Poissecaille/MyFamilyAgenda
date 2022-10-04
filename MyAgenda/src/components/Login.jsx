import React, { useState, useContext } from 'react';
import {
  ErrorContainer,
} from '../styledComponents/Error';
import { AuthenticationContext } from '../components/Authentication';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { colors } from '../utility/Global';
import { TextInput } from 'react-native-paper';

const styles = StyleSheet.create({
  backgroundAppImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  mainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: colors.White,
    fontSize: 40,
    fontFamily: 'PlayfairDisplay-SemiBoldItalic',
    paddingBottom: 30,
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  backgroundOpacity: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  textInput: {
    width: 300,
    marginBottom: 10
  },
  menuOpacity: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 40,
    margin: 20
  },
  button: {
    padding: 15,
    backgroundColor: colors.Clearer3,
    borderRadius: 5,
    margin: 15
  },
  textButton: {
    fontFamily: 'Roboto_700Bold',
    textAlign: 'center',
    color: colors.Black
  },
  errorMessage: {
    color: '#DC143C'
  }
});


export const LoginScreen = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { onLogin, error, isLoading } = useContext(AuthenticationContext);
  return (
    <>
      <Image style={styles.backgroundAppImage} source={require('../assets/family.jpg')} />
      <View style={styles.mainView}>
        <View style={styles.backgroundOpacity} />
        <Text style={styles.title}>My Family Calendar</Text>
        <View style={styles.menuOpacity}>
          <TextInput style={styles.textInput}
            label="E-mail"
            value={email}
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={u => setEmail(u)}
          />
          <TextInput style={styles.textInput}
            label="Password"
            value={password}
            textContentType="password"
            secureTextEntry
            autoCapitalize="none"
            onChangeText={p => setPassword(p)}
          />
          {error && (
            <ErrorContainer>
              <Text style={styles.errorMessage}>{error}</Text>
            </ErrorContainer>
          )}
          {isLoading ? (
            <ActivityIndicator animating={true} color={Colors.blue300} />
          ) : (
            <TouchableOpacity style={styles.button}
              onPress={() => onLogin(email, password)}>
              <Text style={styles.textButton}>LOGIN</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.goBack()}
        >
          <Text style={styles.textButton}>GO BACK</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
