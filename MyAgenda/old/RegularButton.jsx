import React from 'react';
import styled from 'styled-components/native';
import { colors } from '../src/utility/Global';
import { RegularText } from '../src/components/RegularText';


const ButtonStyle = styled.TouchableOpacity`
  align-items: center;
  background-color: ${colors.Darker1};
  width: 80%;
  padding: 20px;
  margin-top: 10px;
  margin-left: 30px;
  border-radius: 20px;
`;

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: colors.Darker1,
//     textAlign: 'center',
//     width: '80%',
//     padding: 20,
//     marginTop: 10,
//     marginLeft: 30,
//     borderRadius: 20
//   }
// })

export const RegularButton = props => {
  return (
    <ButtonStyle idTest={"onPress"} onPress={props.onPress}>
      <RegularText idTest={"text"} value={props.title}></RegularText>
    </ButtonStyle>
    // <TouchableOpacity style={styles.button}>
    //   <RegularText value={props.title}></RegularText>
    // </TouchableOpacity>
  );
};
