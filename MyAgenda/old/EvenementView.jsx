import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const EvenementView = (props) => {

  return (
    <>
      <View style={styles.centeredView}>
        <Text style={styles.title}> {props.name} (R.S) </Text>
        <Text style={styles.regular}> {props.date} à {props.place} </Text>
        <Text style={styles.regular}> {props.description} </Text>
        <Text style={styles.regular}> Invités : {props.guests}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  regular: {
    fontSize: 25,
    fontWeight: 'lighter',
  }
});