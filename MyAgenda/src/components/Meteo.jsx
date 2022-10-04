import * as Location from 'expo-location';
import { OPENWEATHERMAP_API_KEY } from '@env';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { colors, weekStruct, weatherApiStruct } from '../utility/Global';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';


export const MeteoView = props => {
  const [weather, setWeather] = useState(null);
  const [today, setToday] = useState(null);
  const [nextDays, setNextDays] = useState(null);

  useEffect(() => {
    if (weather) {
      setToday(todayData(weather, props.date));
      setNextDays(nextDaysData(weather, props.date));
    }
  }, [weather]);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync().then(() => {
      Location.getCurrentPositionAsync({})
        .then(location => {
          axios
            .get(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`,
            )
            .then(response => {
              setWeather(() => JSON.stringify(response.data));
            })
            .catch(error => {
              console.log(JSON.stringify(error));
            });
        })
        .catch(error => {
          console.log(JSON.stringify(error));
        });
    });
  }, []);

  const getWeatherImagePath = (imagesStruct, code) => {
    if (code > 800) {
      return imagesStruct[801];
    } else {
      return imagesStruct[Math.round(code / 100) * 100];
    }
  };

  const todayData = (jsonString, currentDate) => {
    let json = JSON.parse(jsonString);
    let minTemperatures = [];
    let maxTemperatures = [];
    for (let todayData of json.list) {
      if (todayData.dt_txt.split(' ')[0] <= currentDate.trim()) {
        minTemperatures.push(todayData.main.temp_min);
        maxTemperatures.push(todayData.main.temp_max);
      }
    }

    return JSON.stringify({
      temperature: (
        Math.round(json.list[0].main.feels_like * 10) / 10
      ).toString(),
      maxTemperature: (
        Math.round(Math.max(...maxTemperatures) * 10) / 10
      ).toString(),
      minTemperature: (
        Math.round(Math.min(...minTemperatures) * 10) / 10
      ).toString(),
      windSpeed: json.list[0].wind.speed.toString(),
      weatherImage: getWeatherImagePath(
        weatherApiStruct,
        json.list[0].weather[0].id,
      ),
      city: json.city.name,
      atmPressure: json.list[0].main.pressure,
      weatherDescription: json.list[0].weather[0].description,
    });
  };

  const nextDaysData = (jsonString) => {
    let result = [];
    let json = JSON.parse(jsonString);
    let buffer = {};
    let minTemperatures = [];
    let maxTemperatures = [];
    let copy;
    let i = 0;
    for (let dayData of json.list) {
      minTemperatures.push(dayData.main.temp_min);
      maxTemperatures.push(dayData.main.temp_max);
      if (dayData.dt_txt.split(' ')[1] === '00:00:00') {
        buffer['date'] = dayData.dt_txt.split(' ')[0];
        buffer['minTemperature'] = (
          Math.round(Math.min(...minTemperatures) * 10) / 10
        ).toString();
        buffer['maxTemperature'] = (
          Math.round(Math.max(...maxTemperatures) * 10) / 10
        ).toString();
        minTemperatures = [];
        maxTemperatures = [];
        copy = { ...buffer };
        result.push(copy);
      }
      if (dayData.dt_txt.split(' ')[1] === '12:00:00' || i === 0) {
        buffer['weatherImage'] = getWeatherImagePath(
          weatherApiStruct,
          dayData.weather[0].id,
        );
        buffer['weatherDescription'] = dayData.weather[0].description;
      }
      i++
    }
    return result;
  };

  const styles = StyleSheet.create({
    gradient: {
      height: '100%',
      width: '100%',
    },
    dateView: {
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    dateText: {
      fontSize: 25,
      fontFamily: 'Roboto_700Bold'
    },
    timeText: {
      fontSize: 45,
      fontFamily: 'Roboto_900Black'
    },
    locationView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    gpsImage: {
      width: '10%',
      height: '10%',
      aspectRatio: 1,
      flex: 1
    },
    regionText: {
      flex: 6,
      fontSize: 30,
      fontFamily: 'Roboto_400Regular',
    },
    todayTemperature: {
      fontSize: 40,
      fontFamily: 'Roboto_500Medium',
      marginLeft: '60%'
    },
    maxTemperatureView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    maxTemperatureImage: {
      width: '10%',
      height: '10%',
      aspectRatio: 1,
      flex: 1,
      marginLeft: '50%'
    },
    maxTemperatureText: {
      flex: 5,
      fontSize: 30,
      fontFamily: 'Roboto_400Regular'
    },
    minTemperatureView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    minTemperatureImage: {
      width: '10%',
      height: '10%',
      aspectRatio: 1,
      flex: 1,
      marginLeft: '50%'
    },
    minTemperatureText: {
      flex: 5,
      fontSize: 30,
      fontFamily: 'Roboto_400Regular'
    },
    windView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    windImage: {
      width: '10%',
      height: '10%',
      aspectRatio: 1,
      flex: 1,
      marginLeft: '50%'

    },
    windText: {
      flex: 5,
      fontSize: 30,
      fontFamily: 'Roboto_400Regular'
    },
    pressureView: {
      flexDirection: 'row'

    },
    pressureText: {
      fontSize: 25,
      fontFamily: 'Roboto_300Light',
      marginLeft: '52%'
    },
    weatherView: {
      position: 'absolute',
      width: '50%',
      height: '15%',
      marginTop: '30%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    weatherImage: {
      width: '80%',
      height: '80%',
      aspectRatio: 1
    },
    weatherDescription: {
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      fontSize: 20,
      fontFamily: 'Roboto_700Bold',
    },
    outerViewNextDays: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      position: "absolute",
      marginTop: "77%",
      height: '10%',
      width: '100%'
    },
    innerViewNextDays: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      borderWidth: 0.1,
      borderColor: colors.Black,
      borderRadius: 1,

    },
    nextDaysDayName: {
      textAlignVertical: 'top',
      fontSize: 14,
      fontFamily: 'Roboto_500Medium',
      textAlign: 'center',
    },
    nextDaysWeatherImage: {
      width: '45%',
      height: '45%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: '25%'
    },
    minMaxViewNextDays: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-evenly'
    },
    minNextDays: {
      color: '#1E90FF',
    },
    maxNextDays: {
      color: '#DC143C',
    }
  });

  return (
    <>
      <LinearGradient
        style={styles.gradient}
        colors={['#BABDD0', '#D0BCB3', '#EFBA88', '#F7BD7D', '#F5C97E']}>
        {nextDays && (
          <>
            <View style={styles.locationView}>
              <Image
                style={styles.gpsImage}
                source={require('../assets/placeholder.png')}
              />
              <Text style={styles.regionText}>{JSON.parse(today).city}</Text>
              <Text style={styles.timeText}>{props.time}</Text>
            </View>

            <View style={styles.dateView}>
              <Text style={styles.dateText}>{`${props.date} ${weekStruct[
                new Date(props.date).getDay()
              ].toString()}`}</Text>
            </View>

            <Text style={styles.todayTemperature}>
              {`${JSON.parse(today).temperature} C°`}
            </Text>

            <View style={styles.maxTemperatureView}>
              <Image
                style={styles.maxTemperatureImage}
                source={require('../assets/hot.png')}
              ></Image>
              <Text style={styles.maxTemperatureText}>
                {`${JSON.parse(today).maxTemperature} C°`}
              </Text>
            </View>

            <View style={styles.minTemperatureView}>
              <Image
                style={styles.minTemperatureImage}
                source={require('../assets/cold.png')}
              ></Image>
              <Text style={styles.minTemperatureText}>
                {`${JSON.parse(today).minTemperature} C°`}
              </Text>
            </View>

            <View style={styles.windView}>
              <Image
                style={styles.windImage}
                source={require('../assets/wind.png')}
              ></Image>
              <Text style={styles.windText}>{`${JSON.parse(today).windSpeed
                } km/h`}</Text>
            </View>

            <View style={styles.pressureView}>
              <Text style={styles.pressureText}>{`hPa   ${JSON.parse(today).atmPressure
                }`}</Text>
            </View>
            <View style={styles.weatherView}>
              <Image
                style={styles.weatherImage}
                source={JSON.parse(today).weatherImage}
              />
              <Text style={styles.weatherDescription}>
                {`${JSON.parse(today).weatherDescription}`}
              </Text>
            </View>

            <View style={styles.outerViewNextDays}>
              {nextDays.map((item, _i) => {
                return (
                  <View style={styles.innerViewNextDays}>
                    < Text style={styles.nextDaysDayName} >
                      {weekStruct[new Date(item.date).getDay()]}
                    </Text>
                    <Image
                      style={styles.nextDaysWeatherImage}
                      source={item.weatherImage}
                    />
                    <View style={styles.minMaxViewNextDays}>
                      <Text style={styles.minNextDays}>
                        {item.minTemperature}
                      </Text>
                      <Text style={styles.maxNextDays}>
                        {item.maxTemperature}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </LinearGradient>
    </>
  );
};
