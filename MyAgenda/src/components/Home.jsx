import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthenticationContext } from '../components/Authentication';
import { AddContactModal } from './AddContactModal';
import { NotificationModal } from './NotificationModal';
import { StyleSheet, View, Image, Modal, Text, TouchableOpacity, Button, TextInput, TouchableWithoutFeedback, Animated } from "react-native";
import { colors } from '../utility/Global';
import DropDownPicker from 'react-native-dropdown-picker';
import { screenSize } from '../utility/Global';
import { getDatabase, ref, set, push, get, onValue, update } from 'firebase/database';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DialogBox } from './DialogBox';
import { ShareComponent } from './Share';

export const Home = (props) => {
  const [myAgendas, setMyAgendas] = useState('[]');
  const [myNotifications, setMyNotifications] = useState({});
  const { user } = useContext(AuthenticationContext);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addContactModalVisible, setAddContactModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [agendaName, setAgendaName] = useState(null);
  const [reset, setReset] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(true);
  const animation = useRef(null);
  const [restartAnim, setRestartAnim] = useState(true);


  const loadAgendas = () => {
    const db = getDatabase();
    const agendaRef = ref(db, 'Agendas/');
    let buffer = []
    onValue(agendaRef, snapshot => {
      const agendas = snapshot.val();
      const ids = Object.keys(agendas);
      console.log("AGENDAS", agendas)
      console.log("IDS", ids)
      if (ids && ids.length > 0) {
        for (let id of ids) {
          if (agendas[id].members) {
            for (let memberID of Object.keys(agendas[id].members)) {
              console.log("!!!!!!!!!!!!!!!!!!!!", agendas[id].members[memberID])
              if (agendas[id].members[memberID] && user.email === agendas[id].members[memberID].email) {
                let dict = {}
                dict.label = agendas[id].name
                dict.value = agendas[id].name
                dict.id = id
                buffer.push(dict)
              }
            }
          }
          if (
            user.email === agendas[id].owner &&
            !Object.keys(myAgendas).includes(id)
          ) {
            let dict = {}
            dict.label = agendas[id].name
            dict.value = agendas[id].name
            dict.id = id
            buffer.push(dict)
          }
        }
      }
      setMyAgendas(JSON.stringify(buffer));
    });
  };

  const loadNotifications = () => {
    const db = getDatabase();
    const notifRef = ref(db, 'Notifications/');
    get((notifRef)).then(snap => {
      const notifications = snap.val();
      const keys = Object.keys(notifications);
      for (const key of keys) {
        const notification = notifications[key];
        if (notification.target === user.email) {
          setMyNotifications(oldState => {
            return { ...oldState, [key]: notification }
          });
        }
      }
    }).catch(error => {
      console.log(error);
    });
  };

  const handleAgendaSelection = () => {
    for (let agenda of JSON.parse(myAgendas)) {
      if (value === agenda.label) {
        props.navigation.navigate('Agenda', { key: agenda.id, name: value })
      }
    }
  };

  const onCreateAgenda = () => {
    setModalVisible(!modalVisible)
  };

  const onChangeAgendaName = (agendaName) => {
    setAgendaName(agendaName)
  };

  const createModalValidation = () => {

    if (agendaName === "Mon agenda personnel" || agendaName === "Mon agenda familial") {
      setModalVisible(!modalVisible)
      return
    }
    const previousAgendas = JSON.parse(myAgendas)
    const db = getDatabase();
    let reference = ref(db, 'Agendas')
    const newRef = push(reference)
    set(newRef, {
      'name': agendaName,
      'owner': user.email
    })
    let id = newRef.toString().split("/")[newRef.toString().split("/").length - 1]
    previousAgendas.push({ "label": agendaName, "value": agendaName, id: id })
    setModalVisible(!modalVisible)
    setMyAgendas(JSON.stringify(previousAgendas))
  };



  const closeAddContactModal = () => {
    setAddContactModalVisible(!addContactModalVisible)
  };
  const closeNotificationModal = () => {
    setNotificationModalVisible(!notificationModalVisible)
  };

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
  };

  const getAgendaReferenceByNameAndEmail = async (name, email) => {
    const db = getDatabase();
    const agendaRef = ref(db, 'Agendas/');
    return get((agendaRef)).then(snap => {
      const agendas = snap.val();
      const keys = Object.keys(agendas);
      for (const key of keys) {
        const agenda = agendas[key];
        if (agenda.name === name && agenda.owner === email) {
          return key;
        }
      }
    }).catch(error => {
      console.log(error);
    })
  };

  const createRelation = async (person1, person2, type) => {
    console.log("CREATE RELATION ", person1, person2, type)
    const id1 = await getReferenceByEmail(person1);
    const id2 = await getReferenceByEmail(person2);
    const db = getDatabase();
    const person1Ref = ref(db, `Users/${id1}/relations/`);
    let obj1 = {}
    obj1[id2] = type == "friendRequest" ? "friend" : "family"
    update(person1Ref, obj1)
    let obj2 = {}
    obj2[id1] = type == "friendRequest" ? "friend" : "family"
    const person2Ref = ref(db, `Users/${id2}/relations/`);
    update(person2Ref, obj2)
  };

  const addAgendaMember = async (origin, target, agendaName) => {
    const db = getDatabase();
    const ref1 = await getAgendaReferenceByNameAndEmail(agendaName, origin);
    let memberRef = ref(db, `Agendas/${ref1}/members/`);
    const newRef = push(memberRef)
    update(newRef, {
      'email': target,
    })
  };

  const addEventMember = async (target, agendaID, eventID) => {
    const db = getDatabase();
    const myref = ref(db, `Agendas/${agendaID}/Events/${eventID}/members/`);
    const newRef = push(myref)
    update(newRef, {
      'email': target,
    })
  };

  const acceptNotification = (key) => {
    console.log("accept ", key)
    if (myNotifications[key].type === "friendRequest" || myNotifications[key].type === "familyRequest") {
      createRelation(myNotifications[key].origin, myNotifications[key].target, myNotifications[key].type)
    }

    if (myNotifications[key].type === "agendaMemberRequest") {
      addAgendaMember(myNotifications[key].origin, myNotifications[key].target, myNotifications[key].agendaName)
      setValue(null)
    }

    if (myNotifications[key].type === "eventShareRequest") {
      addEventMember(myNotifications[key].target, myNotifications[key].agendaID, myNotifications[key].eventID)
    }
    const db = getDatabase();
    const notificationRef = ref(db, `Notifications/${key}`);
    set(notificationRef, null);
    const copy = { ...myNotifications }
    delete copy[key]
    setMyNotifications(copy)
  };

  const refuseNotification = (key) => {
    console.log("refuse  ", key)
    const db = getDatabase();
    const notificationRef = ref(db, `Notifications/${key}`);
    set(notificationRef, null);
    const copy = { ...myNotifications }
    delete copy[key]
    setMyNotifications(copy)
  };

  const touchDiscord = () => {
    setReset(true);
    setDialogVisible(true);
  };

  const resetDiscord = () => {
    setRestartAnim(!restartAnim);
  };

  const resetDialog = () => {
    setReset(false);
    setDialogVisible(false);
  };

  const dropDownOpening = () => {
    setOpen(!open);
    setDialogVisible(false);
    setReset(false);
  };

  useEffect(() => {
    loadAgendas();
    loadNotifications();
    handleAgendaSelection();
  }, [value]);

  useEffect(() => {
    // This is intentional
  }, [reset, dialogVisible])

  useEffect(() => {
    animation.current.play();
  }, [restartAnim])

  const styles = StyleSheet.create({
    gradient: {
      height: '100%',
      width: '100%'
    },
    topBarView: {
      position: 'absolute',
      width: '100%',
      height: '10%',
      top: '8%',
      flexDirection: 'row',
      backgroundColor: '#D0BCB3',
      zIndex: 1
    },

    addAgendaView: {
      flex: 1
    },
    addAgendaTouchable: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.Clearer3,
      height: '100%',
      borderRadius: 30,
      borderWidth: 2,
      borderColor: colors.Black
    },
    addAgendaImage: {
      width: '40%',
      height: undefined,
      aspectRatio: 1
    },
    addContactView: {
      flex: 1,
    },
    addContactTouchable: {
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      backgroundColor: colors.Clearer3,
      borderRadius: 30,
      borderWidth: 2,
      borderColor: colors.Black
    },
    addContactImage: {
      width: '40%',
      height: undefined,
      aspectRatio: 1
    },
    notificationView: {
      flex: 1
    },
    notificationTouchable: {
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      backgroundColor: colors.Clearer3,
      flexDirection: 'row',
      borderRadius: 30,
      borderWidth: 2,
      borderColor: colors.Black
    },
    notificationText: {
      color: colors.Black,
      fontFamily: 'Roboto_900Black',
      textAlign: 'center'
    },
    notificationImage: {
      width: '40%',
      height: '40%',
      marginLeft: '10%',
      aspectRatio: 1
    },
    topView: {
      width: '100%',
      height: '50%',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center'
    },
    title: {
      color: colors.White,
      fontSize: 40,
      fontFamily: 'PlayfairDisplay-SemiBoldItalic',
      textShadowColor: 'black',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10
    },
    button: {
      padding: 20,
      backgroundColor: colors.Clearer3,
      borderRadius: 5,
      margin: 15
    },
    textButton: {
      fontFamily: 'Roboto_700Bold',
      textAlign: 'center',
      color: colors.Black
    },
    dropdownView: {
      position: 'absolute',
      top: '85%',
      marginHorizontal: '20%',
    },
    dropdown: {
      backgroundColor: colors.Clearer1,
      borderColor: colors.Clearer1,
      width: '80%'
    },
    dropdownText: {
      color: colors.White
    },
    dropdownContainer: {
      backgroundColor: colors.Clearer1,
      width: '80%',
      borderColor: colors.Clearer1
    },
    dropdownListText: {
      fontFamily: 'Roboto_500Medium',
      textAlign: 'center',
      color: colors.White
    },
    placeholder: {
      fontFamily: 'Roboto_700Bold',
      textAlign: 'center',
      color: colors.White
    },
    arrowIcon: {
      color: colors.White
    },
    bullView: {
      paddingTop: '40%'
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22
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
      elevation: 5
    },
    exitButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      borderRadius: 20
    },
    createAgenda: {
      backgroundColor: colors.Darker1,
      padding: 20,
      borderRadius: 20
    },
    createAgendaText: {
      color: colors.White
    }

  })
  return (
    <>
      <LinearGradient
        style={styles.gradient}
        colors={['#BABDD0', '#D0BCB3', '#EFBA88', '#F7BD7D', '#F5C97E']}>
        <View style={styles.topBarView}>

          <View style={styles.addAgendaView}>
            <TouchableOpacity style={styles.addAgendaTouchable}
              onPress={onCreateAgenda} >
              <Image
                source={require('../assets/newAgenda.png')}
                style={styles.addAgendaImage}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.addContactView}>
            <TouchableOpacity
              style={styles.addContactTouchable}
              onPress={() => setAddContactModalVisible(!addContactModalVisible)}
            >
              <Image
                source={require('../assets/management.png')}
                style={styles.addContactImage}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.notificationView}>
            <TouchableOpacity
              style={styles.notificationTouchable}
              onPress={() => setNotificationModalVisible(true)} >
              <Text style={styles.notificationText}> {Object.keys(myNotifications).length} </Text>
              <Image
                source={require('../assets/message.png')}
                style={styles.notificationImage}
              />
            </TouchableOpacity>
          </View>

          {notificationModalVisible && <NotificationModal visible={true}
            onRequestClose={closeNotificationModal}
            notifications={myNotifications}
            acceptNotification={acceptNotification}
            refuseNotification={refuseNotification}
          />}
        </View>

        <View style={styles.topView}>
          <Text style={styles.title}>
            My family agenda
          </Text>
        </View>

        <TouchableWithoutFeedback
          onPress={touchDiscord}
          disabled={reset}
        >
          <LottieView
            speed={1.2}
            autoPlay={true}
            loop={false}
            source={require('../assets/discord.json')}
            ref={animation}
          />
        </TouchableWithoutFeedback>

        <View style={styles.bullView}>
          {dialogVisible && <DialogBox
            resetDialog={resetDialog}
            resetDiscord={resetDiscord}
            textArray={["Welcome into Family Agenda tutorial!",
              "Click me to restart the tutorial.",
              "This application allows you to manage different agenda.",
              "Your personnal agenda contains all the events to which you are invited and your private events.",
              "Your familial agenda regroups all the events of your family.",
              "You can declare an event private or public.\nIf it is private it cannot be shared",
              "You can add someone to one of your public events from your personnal agenda.",
              "Thank you for using Family Agenda!"]}
          />}
        </View>

        <View style={styles.dropdownView}>
          <DropDownPicker
            showTickIcon={false}
            placeholder={"List of your agendas"}
            placeholderStyle={styles.placeholder}
            listItemLabelStyle={styles.dropdownListText}
            dropDownContainerStyle={styles.dropdownContainer}
            labelStyle={styles.dropdownText}
            style={styles.dropdown}
            open={open}
            value={value}
            setValue={setValue}
            items={JSON.parse(myAgendas)}
            setOpen={dropDownOpening}
          />
        </View>

        {addContactModalVisible && <AddContactModal visible={true} onRequestClose={closeAddContactModal} />}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.exitButton}>
                <Button
                  title="X"
                  color={colors.Darker1}
                  onPress={() => setModalVisible(!modalVisible)}
                />
              </View>
              <TextInput
                onChangeText={onChangeAgendaName}
                value={agendaName}
                placeholder="Add a title"
                keyboardType="default"
              />
              <TouchableOpacity style={styles.createAgenda} onPress={createModalValidation}>
                <Text style={styles.createAgendaText}>Create your agenda</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <ShareComponent />
      </LinearGradient>
    </>
  );
};
