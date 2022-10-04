import React from 'react';
import { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import { ColorPickerObject } from './ColorPickler';
import { RegularButton } from './RegularButton';
import { colors } from '../src/utility/Global';

export const CalendarObject = () => {
  const [dateString, setDateString] = useState(
    new Date().toISOString().split('T')[0],
  ); // date formatted as 'YYYY-MM-DD' string
  const [picker, setPicker] = useState(false);
  const [color, setColor] = useState(colors.Primary_Color);
  const [markedDate, setMarkedDate] = useState('{}');

  LocaleConfig.locales['fr'] = {
    monthNames: [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ],
    monthNamesShort: [
      'Janv.',
      'Févr.',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juil.',
      'Août',
      'Sept.',
      'Oct.',
      'Nov.',
      'Déc.',
    ],
    dayNames: [
      'Dimanche',
      'Lundi',
      'Mardi',
      'Mercredi',
      'Jeudi',
      'Vendredi',
      'Samedi',
    ],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: "Aujourd'hui",
  };
  LocaleConfig.defaultLocale = 'fr';

  const colorPickerHandler = () => {
    setPicker(!picker);
  };
  const colorChangeHandler = color => {
    setColor(color);
  };
  const updateMarkedDayHandler = date => {
    let tmp;
    if (typeof markedDate == 'string') {
      tmp = JSON.parse(markedDate);
    } else {
      tmp = markedDate;
    }
    if (!(date.dateString in tmp)) {
      tmp[date.dateString] = {
        selected: true,
        selectedColor: color,
        dotColor: color,
      };
    } else {
      tmp[date.dateString] = {
        selected: !tmp[date.dateString].selected,
        selectedColor: color,
        dotColor: color,
      };
    }
    setMarkedDate(JSON.stringify(tmp));
  };

  return (
    <>
      <RegularButton title={'Color picker'} onPress={colorPickerHandler} />
      <Calendar
        style={{
          marginTop: 80,
          padding: 20,
        }}
        // Initially visible month
        initialDate={dateString}
        // Minimum date that can be selected, dates before minDate will be grayed out.
        minDate={dateString}
        // Do not show days of other months in month page. Default = false
        hideExtraDays={true}
        onDayPress={date => {
          //   console.log('selected date', date, color);
          updateMarkedDayHandler(date);
        }}
        // Enable the option to swipe between months. Default = false
        enableSwipeMonths={true}
        markedDates={JSON.parse(markedDate)}
      />
      <ColorPickerObject
        visible={picker}
        colorChangeHandler={colorChangeHandler}
      />
    </>
  );
};
