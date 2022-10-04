import React, { useState, useEffect, useContext } from 'react';
import { AuthenticationContext } from '../components/Authentication';
import { getDatabase, ref, get, push, set } from 'firebase/database';
import { StyleSheet, View, Modal, Text, TouchableOpacity, Button } from 'react-native';
import { colors } from '../utility/Global';
import { screenSize } from '../utility/Global';



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
  },
  relationBox: {
    borderWidth: 2,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  }

});

export const AddMemberModal = (props) => {

  //const [contactEmail,setContactEmail] = useState("")
  const { user } = useContext(AuthenticationContext);
  const [relations, setRelations] = useState([])

  async function checkUser(email) {
    const db = getDatabase();
    const userRef = ref(db, 'Users/');
    const res = get((userRef)).then(snap => {
      const users = snap.val();
      const keys = Object.keys(users);
      for (const key of keys) {
        const user = users[key];
        if (user.email === email) {
          return user.email;
        }
      }
      return null
    }).catch(error => {
      console.log(error);
    })
    return res;
  }

  useEffect(() => {
    getRelationList();
  })
  const getReferenceByEmail = async (email) => {
    const db = getDatabase();
    const userRef = ref(db, 'Users/');
    return get((userRef)).then(snap => {
      const users = snap.val();
      const keys = Object.keys(users);
      for (const key of keys) {
        const user = users[key];
        if (user.email === email) {
          return key;
        }
      }
    }).catch(error => {
      console.log(error);
    })
  }

  const getRelationList = async () => {
    const db = getDatabase();

    const myId = await getReferenceByEmail(user.email);
    const relationRef = ref(db, `Users/${myId}/relations/`);
    const res = await get((relationRef)).then(snap => {
      const relations = snap.val();
      return Object.keys(relations);
    }).catch(error => {
      console.log(error);
    })
    const userRef = ref(db, 'Users/');
    const resUsers = get((userRef)).then(snap => {
      const users = snap.val();
      const list = [];
      for (const key of res) {
        list.push(users[key].email);
      }
      return list;
    }).catch(error => {
      console.log(error);
    })



    setRelations(await resUsers);
  }

  const sendMemberRequest = async (email) => {
    console.log("sendMemberRequest...");
    const targetEmail = await checkUser(email); // find user
    if (!targetEmail) {
      alert(" This user is not registered in the app yet. Perhaps you can share this application with them first.");  
      props.onRequestClose();
      return
    }
    if (targetEmail == user.email) {
      alert("You cannot invite yourself !");
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
        'message': `${user.email} wants you to join the agenda \"${props.agendaName}\" !`,
        'target': targetEmail,
        'origin': user.email,
        'type': "agendaMemberRequest",
        'agendaName': props.agendaName,
      })
      alert("Notification sent !");
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
            <Text>
              {relations && relations.map((relation, index) => {
                return (
                  <TouchableOpacity style={styles.relationBox} key={index} onPress={() => sendMemberRequest(relation)}>
                    <Text>{relation}</Text>
                  </TouchableOpacity>
                )
              })}</Text>
          </View>
        </View>
      </Modal>
    </>
  );
}