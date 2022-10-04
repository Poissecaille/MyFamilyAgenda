import React, { useContext } from 'react';
import { AuthenticationContext } from '../components/Authentication';
import { StyleSheet, View, Modal, Text, Button } from 'react-native';
import { colors } from '../utility/Global';
import { screenSize } from '../utility/Global';

const styles = StyleSheet.create({
  addAgenda: {
    backgroundColor: colors.Primary_Color,
    alignItems: 'center',
    width: '30%',
    padding: 10,
    borderRadius: 10,
    left: 250,
    bottom: 45
  },
  addAgendaText: {
    color: colors.White,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    width: '80%',
    height: (screenSize.height * 2) / 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  exitButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 20,
  },
  create: {
    backgroundColor: colors.Darker1,
    padding: 20,
    borderRadius: 20
  },
  createText: {
    color: colors.White
  }

});


export const NotificationModal = (props) => {

  return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.visible}
        onRequestClose={() => {
          alert('Modal has been closed.');
          props.onRequestClose();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.exitButton}>
              <Button
                title="X"
                color={colors.Darker1}
                onPress={() => props.onRequestClose()}
              />
            </View>
            {Object.keys(props.notifications).length > 0 &&
              Object.keys(props.notifications).map((key, index) => {
                return (
                  <>
                    <View key={key} style={{
                      borderWidth: 2, padding: 20, borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                    }}>

                      <Text >{props.notifications[key].message}</Text>
                      <View style={{ flexDirection: "row" }}>
                        <Button
                          title="Accept"
                          onPress={() => { props.acceptNotification(key) }}
                        />
                        <Button
                          color={colors.LightRed}
                          title="Refuse"
                          onPress={() => { props.refuseNotification(key) }}
                        />
                      </View>
                    </View>
                  </>

                );
              })
            }
            {Object.keys(props.notifications).length == 0 &&
              <Text>Aucune notification !</Text>
            }

          </View>
        </View>
      </Modal>

  );
}