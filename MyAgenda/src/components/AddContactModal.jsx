import React, { useState, useContext } from 'react';
import { AuthenticationContext } from '../components/Authentication';
import { getDatabase, ref, get, push, set } from 'firebase/database';
import { StyleSheet, View, Modal, Text, TouchableOpacity, Button, TextInput } from 'react-native';
import { colors } from '../utility/Global';
import { screenSize } from '../utility/Global';
import { RadioButton } from 'react-native-paper';


const styles = StyleSheet.create({
  placeholder: {
    color: colors.White
  },
  arrowIcon: {
    color: colors.White
  },
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
    width: (screenSize.width * 3) / 4,
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

export const AddContactModal = (props) => {
  const [contactEmail, setContactEmail] = useState("")
  const [type, setType] = React.useState('friendRequest');
  const { user } = useContext(AuthenticationContext);


  async function checkUser() {
    const db = getDatabase();
    const userRef = ref(db, 'Users/');
    const res = get((userRef)).then(snap => {
      const users = snap.val();
      const keys = Object.keys(users);
      for (const key of keys) {
        const user = users[key];
        if (user.email === contactEmail) {
          return user.email;
        }
      }
      return null
    }).catch(error => {
      console.log(error);
    })
    return res;
  }

  const sendContactRequest = async () => {
    console.log("sendContactRequest...");
    const targetEmail = await checkUser(); // find user
    if (!targetEmail) {
      alert("Cet utilisateur n'est pas enregistré. Pensez à l'inviter à rejoindre l'application ! :)");
      props.onRequestClose();
      return
    }
    if (targetEmail == user.email) {
      alert("Vous ne pouvez pas vous envoyer de demande d'ami à vous-même !");
      props.onRequestClose();
      return
    }
    if (targetEmail) {
      console.log("found user, sending request");
      // Créer la notification
      const db = getDatabase();
      let notifRef = ref(db, 'Notifications/');
      const newRef = push(notifRef)
      set(newRef, {
        'message': type === "friendRequest" ? `${user.email} veut vous ajouter en tant qu'ami(e)` :
          `${user.email} veut vous ajouter en tant que membre de sa famille`,
        'target': targetEmail,
        'origin': user.email,
        'type': type
      })
      alert("Demande envoyée !");
    }
    props.onRequestClose()
    return
  }


  return (
    <>

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
            <TextInput
              onChangeText={setContactEmail}
              value={contactEmail}
              placeholder="Contact email"
              keyboardType="email-address"
            />
            <Text> Ami </Text>
            <RadioButton
              value="friendRequest"
              status={type === 'friendRequest' ? 'checked' : 'unchecked'}
              onPress={() => setType('friendRequest')}
            />
            <Text> Famille </Text>
            <RadioButton
              value="familyRequest"
              status={type === 'familyRequest' ? 'checked' : 'unchecked'}
              onPress={() => setType('familyRequest')}
            />

            <TouchableOpacity style={styles.create} onPress={sendContactRequest}>
              <Text style={styles.createText}> Add contact </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}