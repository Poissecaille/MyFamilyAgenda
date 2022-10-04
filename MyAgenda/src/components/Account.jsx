import React from 'react';
import { colors } from '../utility/Global';
import {
  StyleSheet, TouchableOpacity, Text, Image, View
} from 'react-native';

const styles = StyleSheet.create({
  backgroundAppImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  mainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  authButton: {
    padding: 15,
    backgroundColor: colors.Clearer3,
    borderRadius: 5,
    marginBottom: 15
  },
  textButton: {
    fontFamily: 'Roboto_700Bold',
    textAlign: 'center',
    color: colors.Black
  },
  menuOpacity: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 40,
    marginTop: 10
  }
});

export const AccountScreen = (props) => {
  return <>
    <Image style={styles.backgroundAppImage} source={require('../assets/family.jpg')} />
    <View style={styles.mainView}>
      <Text style={styles.title}>My Family Calendar</Text>
      <View style={styles.menuOpacity}>
        <TouchableOpacity style={styles.authButton} onPress={() => props.navigation.navigate('Login')}>
          <Text style={styles.textButton}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.authButton} onPress={() => props.navigation.navigate('Register')}>
          <Text style={styles.textButton}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </View>
  </>
}
