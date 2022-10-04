import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, get, child } from 'firebase/database';
import { Agenda, Calendar } from 'react-native-calendars';
import {
  Alert,
  Switch,
  Button,
  Modal,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
import {
  screenSize,
  colors,
  //  timezoneStruct,
  actualDatetimeString,
  timestampToTimeAndTimeString,
  getDatesBetweenTwoDates
} from '../utility/Global';

//import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MeteoView } from './Meteo';
import { AuthenticationContext } from '../components/Authentication';
import { AddMemberModal } from './AddMemberModal';
import Checkbox from 'expo-checkbox';

export const AgendaObject = ({ route, navigation }) => {
  const { key, name } = route.params;
  const dateString = actualDatetimeString.split(' ')[0];
  const timeString = actualDatetimeString.split(' ')[1].substring(0, 5);
  const [firstTime, setFirstTime] = useState(timeString);
  const [secondTime, setSecondTime] = useState(timeString);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [firstDate, setFirstDate] = useState('');
  const [secondDate, setSecondDate] = useState('');
  const [eventName, setEventName] = React.useState(null);
  const [firstCalendarVisible, setFirstCalendarVisible] = useState(false);
  const [secondCalendarVisible, setSecondCalendarVisible] = useState(false);
  const [firstMarkedDate, setFirstMarkedDate] = useState('{}');
  const [secondMarkedDate, setSecondMarkedDate] = useState('{}');
  //const [timezone, setTimeZone] = useState('Europe/Paris');
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState(colors.Darker1);
  const [firstWatchVisible, setFirstWatchVisible] = useState(false);
  const [secondWatchVisible, setSecondWatchVisible] = useState(false);
  const [agendaItems, setAgendaItems] = useState('{}');
  const [eventDescription, setEventDescription] = useState(null);
  const [update, setUpdate] = useState(false);
  const [eventID, setEventID] = useState(null);
  const { user } = useContext(AuthenticationContext);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [emailInvite, setEmailInvite] = useState(null);

  useEffect(() => {
    if (allDay) {
      setFirstTime('00:00');
      setSecondTime('23:59');
    }
  }, [firstMarkedDate, allDay]);

  useEffect(() => {
    if (name === "Mon agenda personnel") {
      getAllEvents()
    } else if (name === "Mon agenda familial") {
      getAllFamilyEvents()
    }
    else {
      getEvents()
    }
  }, [])

  const onChangeEventName = eventName => {
    setEventName(eventName);
  };

  const onDaySelected = daySelected => {
    setFirstDate(daySelected.dateString);
    setSecondDate(daySelected.dateString);
    setEventModalVisible(!eventModalVisible);
    setUpdate(false)
  };

  const onClickDisplayFirstCalendar = () => {
    setFirstCalendarVisible(!firstCalendarVisible);
    setSecondCalendarVisible(false);
  };

  const onClickDisplaySecondCalendar = () => {
    setSecondCalendarVisible(!secondCalendarVisible);
    setFirstCalendarVisible(false);
  };

  const updateCalendarFirstDaySelected = dateSelected => {
    let tmp = {};
    if (!(dateSelected.dateString in tmp)) {
      tmp[dateSelected.dateString] = {
        selected: true,
        selectedColor: color,
      };
    } else {
      tmp[dateSelected.dateString] = {
        selected: !tmp[dateSelected.dateString].selected,
        selectedColor: color,
      };
    }
    setFirstMarkedDate(JSON.stringify(tmp));
    setFirstDate(dateSelected.dateString);
    if (secondDate < dateSelected.dateString) {
      setSecondDate(dateSelected.dateString);
    }
    setFirstCalendarVisible(!firstCalendarVisible)
  };

  const updateCalendarSecondDaySelected = dateSelected => {
    let tmp = {};
    if (!(dateSelected.dateString in tmp)) {
      tmp[dateSelected.dateString] = {
        selected: true,
        selectedColor: color,
      };
    } else {
      tmp[dateSelected.dateString] = {
        selected: !tmp[dateSelected.dateString].selected,
        selectedColor: color,
      };
    }
    setSecondMarkedDate(JSON.stringify(tmp));
    setSecondDate(dateSelected.dateString);
    setSecondCalendarVisible(!secondCalendarVisible)
  };

  const toggleAllDaySwitch = () => {
    setAllDay(!allDay);
  };

  // const updateTimezone = timezoneName => {
  //   if (timezoneName) {
  //     setTimeZone(timezoneName.title);
  //   }
  // };

  const onClickDisplayFirstWatch = () => {
    setFirstWatchVisible(true);
    setSecondWatchVisible(false);
  };

  const onClickDisplaySecondWatch = () => {
    setSecondWatchVisible(true);
    setFirstWatchVisible(false);
  };

  const onSelectFirstTime = date => {
    if (Object.keys(date.nativeEvent).length != 0) {
      let result = timestampToTimeAndTimeString(date.nativeEvent.timestamp);
      let time = result[1].substring(0, 5)
      if (time > secondTime) {
        setSecondTime(time)
      }
      setFirstTime(time);
    }
    setFirstWatchVisible(false);
  };

  const onSelectSecondTime = date => {
    if (Object.keys(date.nativeEvent).length != 0) {
      let result = timestampToTimeAndTimeString(date.nativeEvent.timestamp);
      let time = result[1].substring(0, 5)
      if (time < firstTime) {
        setFirstTime(time)
      }
      setSecondTime(time);
    }
    setSecondWatchVisible(false);
  };

  const updateModalValidation = () => {
    if (eventName === "Mon agenda personnel" || eventName === "Mon agenda familial") {
      alert("Ce nom d'agenda est réservé!")
      return
    }
    const buffer = JSON.parse(agendaItems)
    const eventDuration = getDatesBetweenTwoDates(firstDate, secondDate)
    let dbUpdate = true
    for (let date of eventDuration) {
      if (!(date in buffer)) {
        buffer[date] = [{ 'id': eventID, 'name': eventName, 'firstDate': firstDate, 'secondDate': secondDate, 'firstTime': firstTime, 'secondTime': secondTime, 'eventDescription': eventDescription ? eventDescription : null }]
      }
      for (let eventData of buffer[date]) {
        if (eventData.id == eventID) {
          eventData.firstDate = firstDate
          eventData.secondDate = secondDate
          eventData.name = name
          eventData.firstTime = firstTime
          eventData.secondTime = secondTime
          eventData.eventDescription = eventDescription ? eventDescription : null
          eventData.private = isPrivate
          eventData.owner = user.email
          if (dbUpdate) {
            updateEventsInDB(eventData)
            dbUpdate = false
          }
        }
      }
      setAgendaItems(JSON.stringify(buffer))
      setEventModalVisible(!eventModalVisible)
    }
  };

  const createModalValidation = () => {
    if (eventName === "Mon agenda personnel" || eventName === "Mon agenda familial") {
      alert("Ce nom d'agenda est réservé!")
      return
    }
    let buffer = {}
    const eventDuration = getDatesBetweenTwoDates(firstDate, secondDate)
    let items = JSON.parse(agendaItems)
    for (let date of eventDuration) {
      if (!(date in buffer)) {
        buffer[date] = [{ 'name': eventName, 'firstDate': firstDate, 'secondDate': secondDate, 'firstTime': firstTime, 'secondTime': secondTime, 'eventDescription': eventDescription ? eventDescription : null, 'private': isPrivate, 'owner': user.email }]
      } else {
        buffer[date].push({ 'name': eventName, 'firstDate': firstDate, 'secondDate': secondDate, 'firstTime': firstTime, 'secondTime': secondTime, 'eventDescription': eventDescription ? eventDescription : null, 'private': isPrivate, 'owner': user.email })
      }
    }
    let bufferWithId = saveEventsInDB(buffer)
    for (let date in items) {
      for (let eventData of items[date]) {
        if (!(date in bufferWithId)) {
          bufferWithId[date] = [{ 'id': eventData.id, 'name': eventData.name, 'firstDate': eventData.firstDate, 'secondDate': eventData.secondDate, 'firstTime': eventData.firstTime, 'secondTime': eventData.secondTime, 'eventDescription': eventData.eventDescription, 'private': isPrivate, 'owner': user.email }]
        } else {
          bufferWithId[date].push({ 'id': eventData.id, 'name': eventData.name, 'firstDate': eventData.firstDate, 'secondDate': eventData.secondDate, 'firstTime': eventData.firstTime, 'secondTime': eventData.secondTime, 'eventDescription': eventData.eventDescription, 'private': isPrivate, 'owner': user.email })
        }
      }
    }
    setAgendaItems(JSON.stringify(bufferWithId))
    setEventModalVisible(!eventModalVisible)
  };

  const onDescriptionUpdate = (description) => {
    setEventDescription(description);
  };

  const updateEventsInDB = (event) => {
    const db = getDatabase();
    set(ref(db, `Agendas/${event.agendaID}/Events/${eventID}`), event)
  };

  const saveEventsInDB = (itemsToSave) => {
    const db = getDatabase();
    const reference = ref(db, 'Agendas/' + key + '/Events')
    let dbSave = true
    let id;
    for (let date in itemsToSave) {
      for (let eventData of itemsToSave[date]) {
        if (dbSave) {
          const newReference = push(reference)
          id = newReference.toString().split("/")[newReference.toString().split("/").length - 1]
          set(newReference, {
            'name': eventData.name,
            'firstDate': eventData.firstDate,
            'secondDate': eventData.secondDate,
            'firstTime': eventData.firstTime,
            'secondTime': eventData.secondTime,
            'eventDescription': eventData.eventDescription,
            'id': id,
            'private': isPrivate,
            'owner': user.email
          })
          dbSave = false
        }
        eventData.id = id
      }
    }
    return itemsToSave
  };

  const getAllFamilyEvents = () => {
    const dbRef = ref(getDatabase());
    let currentUserID;
    let familyRelations = [];
    //let familyEvents = [];
    const dict = {}

    // TROUVER ID DE L'UTILISATEUR COURANT
    get(child(dbRef, 'Users')).then((snapshot) => {
      for (let id in snapshot.val()) {
        if (snapshot.val()[id].email === user.email) {
          currentUserID = id
          break
        }
      }
      console.log(currentUserID);
      // TROUVER TOUTES LES RELATIONS FAMILIALES ET SAVE LES EMAILS
      get(child(dbRef, 'Users')).then((snapshot) => {
        for (let id in snapshot.val()) {
          if (snapshot.val()[id].relations) {
            for (let relationID in snapshot.val()[id].relations) {
              if (snapshot.val()[id].relations[relationID] === "family" && relationID === currentUserID) {
                familyRelations.push(snapshot.val()[id].email)
              }
            }
          }
        }
        console.log(familyRelations);
        // TROUVER TOUS LES EVENTS FAMILIAUX ET CEUX DE L'UTILISATEUR COURANT
        get(child(dbRef, 'Agendas')).then((snapshot) => {
          for (let agendaID in snapshot.val()) {
            for (let eventID in snapshot.val()[agendaID].Events) {
              if (snapshot.val()[agendaID].Events[eventID].owner === user.email) {
                console.log("PRRRRRRRRRRRRRROUT")
                const eventDuration = getDatesBetweenTwoDates(snapshot.val()[agendaID]["Events"][eventID].firstDate, snapshot.val()[agendaID]["Events"][eventID].secondDate)
                for (let date of eventDuration) {
                  if (date in dict) {
                    dict[date].push(snapshot.val()[agendaID].Events[eventID])
                  } else {
                    dict[date] = [snapshot.val()[agendaID].Events[eventID]]
                  }
                }
              }
              for (let relation of familyRelations) {
                if (relation === snapshot.val()[agendaID].Events[eventID].owner) {
                  const eventDuration = getDatesBetweenTwoDates(snapshot.val()[agendaID]["Events"][eventID].firstDate, snapshot.val()[agendaID]["Events"][eventID].secondDate)
                  for (let date of eventDuration) {
                    let event = snapshot.val()[agendaID].Events[eventID]
                    if (date in dict) {
                      dict[date].push(event)
                    } else {
                      dict[date] = [event]
                    }
                  }
                  //familyEvents.push(snapshot.val()[agendaID].Events[eventID])
                }
              }
            }
          }
          //console.log(familyEvents)
          setAgendaItems(JSON.stringify(dict));
        })
      })
    })
  };

  const getAllEvents = () => {
    const dict = {}
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'Agendas')).then((snapshot) => {
      for (let agendaID in snapshot.val()) {
        // TOUS LES EVENEMENTS DES AGENDAS DE LUTILISATEUR
        if (user.email === snapshot.val()[agendaID].owner) {
          for (let eventID in snapshot.val()[agendaID].Events) {
            const eventDuration = getDatesBetweenTwoDates(snapshot.val()[agendaID]["Events"][eventID].firstDate, snapshot.val()[agendaID]["Events"][eventID].secondDate)
            for (let date of eventDuration) {
              let event = snapshot.val()[agendaID]["Events"][eventID]
              event['agendaID'] = agendaID
              if (date in dict) {
                dict[date].push(event)
              } else {
                dict[date] = [event]
              }
            }
          }
        } else {
          // TOUS LES EVENEMENTS OU LUTILISATEUR EST INVITE
          for (let eventID in snapshot.val()[agendaID].Events) {
            for (let member in snapshot.val()[agendaID]["Events"][eventID].members) {
              if (user.email === snapshot.val()[agendaID]["Events"][eventID].members[member].email) {
                const eventDuration = getDatesBetweenTwoDates(snapshot.val()[agendaID]["Events"][eventID].firstDate, snapshot.val()[agendaID]["Events"][eventID].secondDate)
                for (let date of eventDuration) {
                  let event = snapshot.val()[agendaID]["Events"][eventID]
                  event['agendaID'] = agendaID
                  if (date in dict) {
                    dict[date].push(event)
                  } else {
                    dict[date] = [event]
                  }
                }
              }
            }
          }
        }
      }
      setAgendaItems(JSON.stringify(dict));
    })
  };

  const getEvents = async () => {
    const dbRef = ref(getDatabase());
    const dict = {};
    await get(child(dbRef, `Agendas/${key}/Events`)).then((snapshot) => {
      const result = snapshot.val()
      for (let uid in result) {
        const eventDuration = getDatesBetweenTwoDates(result[uid].firstDate, result[uid].secondDate)
        for (let date of eventDuration) {
          if (!(date in dict)) {
            dict[date] = [result[uid]]
          } else {
            buffer[date].push(result[uid])
          }
        }
      }
    })
    setAgendaItems(JSON.stringify(dict));
  };

  const onEventUpdate = (event) => {
    let items = JSON.parse(agendaItems)
    for (let date in items) {
      for (let eventData of items[date]) {
        if (event.id == eventData.id) {
          setFirstDate(eventData.firstDate)
          setSecondDate(eventData.secondDate)
          setFirstTime(eventData.firstTime)
          setSecondTime(eventData.secondTime)
          setEventName(eventData.name)
          setEventDescription(eventData.description)
          setEventID(eventData.id)
        }
      }
    }
    setUpdate(true);
    setEventModalVisible(!eventModalVisible);
  };

  const onEventDelete = (event) => {
    const db = getDatabase();
    set(ref(db, `Agendas/${event.agendaID}/Events/${event.id}`), null)
    let items = JSON.parse(agendaItems)
    for (let date in items) {
      for (let i = items[date].length - 1; i >= 0; i--) {
        if (event.id == items[date][i].id) {
          items[date].splice(i, 1)
        }
      }
    }
    setAgendaItems(JSON.stringify(items));
  };

  const closeAddMemberModal = () => {
    setAddMemberModalVisible(!addMemberModalVisible);
  }
  const onInvite = (item) => {
    setEventName(item.name)
    if (!item.private) {
      setInviteModalVisible(!inviteModalVisible);
    } else {
      Alert.alert("Your event is private!\nPut it public to continue.");
    }
  };

  const onChangeEmailInvite = (email) => {
    setEmailInvite(email);
  };

  const onValidateModalInvitation = async () => {
    const dbRef = ref(getDatabase());
    const userTargetID = await get(child(dbRef, `Users`)).then((snapshot) => {
      for (let id in snapshot.val()) {
        if (emailInvite === snapshot.val()[id].email) {
          return id;
        }
      }
    })

    if (userTargetID) {
      const eventTargetID = await get(child(dbRef, `Agendas/${key}/Events`)).then((snapshot) => {
        for (let id in snapshot.val()) {
          if (snapshot.val()[id].name === eventName && snapshot.val()[id].owner === user.email) {
            return id;
          }
        }
      })
      const reference = ref(getDatabase(), 'Notifications/');
      let newRef = push(reference);
      set(newRef, {
        "origin": user.email,
        //"fromID": user.id,
        "target": emailInvite,
        //"toID": userTargetID,
        "message": `${user.email} veut vous inviter à son évenement ${eventName} de l'agenda ${name}`,
        "eventID": eventTargetID,
        "agendaID": key,
        "type": "eventShareRequest"
      });
      setInviteModalVisible(!inviteModalVisible)
    } else {
      alert("The user does not exist!\nInvitation cancelled")
    }
  };

  const styles = StyleSheet.create({
    gradient: {
      height: '100%',
      width: '100%',
    },
    topBarView: {
      width: '100%',
      height: '9%',
      marginTop: '5%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      backgroundColor: '#BABDD0'
    },
    homeTouchable: {
      flex: 1,
      height: '30%',
      marginBottom: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    homeImage: {
      height: '100%',
      width: '100%',
      aspectRatio: 1,
    },
    addMemberTouchable: {
      backgroundColor: colors.Clearer3,
      height: '40%',
      flex: 3,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.Black
    },
    addMemberText: {
      color: colors.White,
      fontFamily: 'Roboto_500Medium',
      fontSize: 10
    },
    addContactImage: {
      aspectRatio: 1,
      width: '100%',
      height: '100%'
    },
    mainView: {
      height: '40%',
      width: '100%',
    },
    calendarTitle: {
      fontFamily: 'Roboto_900Black',
      fontSize: 20,
      flex: 9,
      color: colors.Black
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
      height: (screenSize.height * 3) / 4,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      }
    },
    exitButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      borderRadius: 20,
    },
    modalText: {
      fontWeight: 'bold',
    },
    checkbox: {
      borderColor: colors.LightGray
    },
    buttonText: {
      color: colors.White,
      fontWeight: 'bold',
    },
    validateModalButton: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.Darker1,
      width: '80%',
      height: '10%',
      borderRadius: 10
    },
    eventView: {
      backgroundColor: colors.White,
      height: 80,
      width: "90%",
      borderRadius: 10,
      margin: 10,
      display: 'flex',
      flexDirection: 'row',
      //flexWrap: 'wrap'

    },
    eventTextView: {
      //width: '40%',
      //height: '100%',
      //justifyContent:'flex-start',
      //backgroundColor: colors.Darker2,
      //flex: 1

    },
    eventTitle: {
      fontSize: 15,
      fontFamily: 'Roboto_500Medium',
      marginLeft: 5
    },
    eventDescription: {
      fontSize: 10,
      fontFamily: 'Roboto_500Medium_Italic',
      marginLeft: 20
    },
    eventOwner: {
      fontSize: 12,
      fontFamily: 'Roboto_700Bold',
      marginLeft: 20
    },
    eventTime: {
      fontSize: 17,
      fontFamily: 'Roboto_900Black',
    },
    eventButtonsView: {
      // width: '40%',
      //height: '100%',
      //justifyContent:'flex-start',
      backgroundColor: colors.Clearer2,
    },
    eventImage: {
      position: 'absolute',
      width: '60%',
      height: '60%',
      aspectRatio: 1,
      left: 120,
      top: 15
    },
    deleteButton: {
      position: 'absolute',
      alignItems: 'center',
      backgroundColor: colors.LightRed,
      width: '50%',
      height: '40%',
      left: 200,
      marginVertical: 5,
      borderRadius: 10,
      zIndex: 1
    },
    inviteButton: {
      position: 'absolute',
      alignItems: 'center',
      backgroundColor: colors.Clearer3,
      width: '50%',
      height: '40%',
      left: 200,
      marginVertical: 40,
      borderRadius: 10,
      zIndex: 1
    },



  });

  return <>
    <View style={styles.topBarView}>
      <TouchableOpacity
        style={styles.homeTouchable}
        onPress={() => navigation.goBack()}
      >
        <Image
          style={styles.homeImage}
          source={require('../assets/arrow.png')}
        />
      </TouchableOpacity>
      <Text style={styles.calendarTitle}>{name}</Text>
      {name != "Mon agenda personnel" &&
        <TouchableOpacity
          style={styles.addMemberTouchable}
          onPress={() => setAddMemberModalVisible(!addMemberModalVisible)}
        >
          <Image
            style={styles.addContactImage}
            source={require('../assets/contacts.png')}
          />
          {/* <Text style={styles.addMemberText}>Ajouter Membre</Text> */}
        </TouchableOpacity>
      }
    </View>

    {addMemberModalVisible && <AddMemberModal visible={true} agendaName={name} onRequestClose={closeAddMemberModal} />}

    <View style={styles.mainView}>
      <Agenda
        onDayLongPress={onDaySelected}
        renderItem={(item, firstItemInDay) => {
          return <View style={styles.eventView} >
            <TouchableOpacity onLongPress={() => onEventUpdate(item)}>
              {item.owner === user.email ?
                <>
                  <Text style={styles.eventTime}>{item.firstTime}-{item.secondTime}</Text>
                  <Text style={styles.eventTitle}>{item.name}</Text>
                  <Text style={styles.eventDescription}>{item.eventDescription}</Text>
                  {/* <View style={styles.eventButtonsView}> */}
                  <TouchableOpacity style={styles.deleteButton} onPress={() => onEventDelete(item)}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inviteButton} onPress={() => onInvite(item)}>
                    <Text style={styles.buttonText}>Invite</Text>
                  </TouchableOpacity>
                  {/* </View> */}
                  <Image style={styles.eventImage} source={require('../assets/blue_calendar.png')} />
                </>
                : <>
                  <View style={styles.eventTextView}>
                    <Text style={styles.eventTime}>{item.firstTime}-{item.secondTime}</Text>
                    <Text style={styles.eventTitle}>{item.name}</Text>
                    <Text style={styles.eventDescription}>{item.eventDescription}</Text>
                    <Text style={styles.eventOwner}>{item.owner}</Text>
                  </View>
                  {/* <View style={styles.eventButtonsView}> */}
                  <TouchableOpacity style={styles.deleteButton} onPress={() => onEventDelete(item)}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inviteButton} onPress={() => onInvite(item)}>
                    <Text style={styles.buttonText}>Invite</Text>
                  </TouchableOpacity>
                  {/* </View> */}
                  <Image style={styles.eventImage} source={require('../assets/data-transfer.png')} />
                </>
              }
            </TouchableOpacity>
          </View>;
        }}
        minDate={dateString}
        items={JSON.parse(agendaItems)}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={inviteModalVisible}
        onRequestClose={() => {
          setInviteModalVisible(!inviteModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.exitButton}>
              <Button
                title="X"
                color={colors.Darker1}
                onPress={() => setInviteModalVisible(!inviteModalVisible)}
              >
              </Button>
            </View>
            <TextInput
              onChangeText={onChangeEmailInvite}
              value={emailInvite}
              placeholder="Choose an email address"
              keyboardType="default"
            />
            <TouchableOpacity style={styles.validateModalButton} onPress={onValidateModalInvitation}>
              <Text style={styles.buttonText}>Send invitation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={eventModalVisible}
        onRequestClose={() => {
          setEventModalVisible(!eventModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.exitButton}>
              <Button
                title="X"
                color={colors.Darker1}
                onPress={() => setEventModalVisible(!eventModalVisible)}
              >
              </Button>
            </View>
            <TextInput
              onChangeText={onChangeEventName}
              value={eventName}
              placeholder="Add a title"
              keyboardType="default"
            />

            <Text styles={styles.modalText}>All day</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={allDay ? '#f5dd4b' : '#f4f3f4'}
              onValueChange={toggleAllDaySwitch}
              value={allDay}
            />
            <Text style={styles.modalText}>Private event y/n</Text>
            <Checkbox color={colors.LightRed} style={styles.checkbox} value={isPrivate} onValueChange={setIsPrivate} />

            <TouchableOpacity
              onPress={onClickDisplayFirstCalendar}
              disabled={true ? allDay : false}
            >
              <Text style={styles.boldtextStyle}>{firstDate}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClickDisplayFirstWatch}
              disabled={true ? allDay : false}
            >
              <Text style={styles.textStyle}>
                {firstTime ? firstTime : timeString}
              </Text>
            </TouchableOpacity>

            {firstWatchVisible && (
              <DateTimePicker
                value={new Date()}
                mode={'time'}
                is24Hour={true}
                onChange={onSelectFirstTime}
              />
            )}

            {firstCalendarVisible && (
              <Calendar
                onDayPress={updateCalendarFirstDaySelected}
                markedDates={JSON.parse(firstMarkedDate)}
                initialDate={dateString}
                minDate={dateString}
                hideExtraDays={true}
              ></Calendar>
            )}

            <TouchableOpacity
              onPress={onClickDisplaySecondCalendar}
            >
              <Text style={styles.boldtextStyle}>-{secondDate}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClickDisplaySecondWatch}
              disabled={true ? allDay : false}
            >
              <Text style={styles.textStyle}>
                {secondTime ? secondTime : timeString}
              </Text>
            </TouchableOpacity>

            {secondWatchVisible && (
              <DateTimePicker
                value={new Date()}
                mode={'time'}
                is24Hour={true}
                onChange={onSelectSecondTime}
              />
            )}

            {secondCalendarVisible && (
              <Calendar
                onDayPress={updateCalendarSecondDaySelected}
                markedDates={JSON.parse(secondMarkedDate)}
                initialDate={firstDate}
                minDate={firstDate}
                hideExtraDays={true}
              ></Calendar>
            )}


            <TextInput
              onChangeText={onDescriptionUpdate}
              value={eventDescription}
              placeholder="Add a description"
              keyboardType="default"
            />
            <TouchableOpacity style={styles.validateModalButton} onPress={update ? updateModalValidation : createModalValidation}>
              <Text style={styles.buttonText}>{update ? "Update event" : " Create event"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View >
    < MeteoView date={dateString} time={`${timeString.split(":")[0]}:${timeString.split(":")[1]}`} />
  </>
}