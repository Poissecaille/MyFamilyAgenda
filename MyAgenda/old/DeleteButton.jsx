import React from 'react';
import styled from 'styled-components/native';
import { colors } from '../Colors';
import { RegularText } from '../RegularText';

const ButtonStyle = styled.TouchableOpacity`
  position:absolute;
  align-items: center;
  background-color: ${colors.LightRed};
  width: 20%;
  height:30%;
  left:180px;
  top:30px;
  border-radius: 10px;
  z-index:1
`;

export const DeleteButton = props => {
    return (
        <ButtonStyle onPress={props.onPress}>
            <RegularText value={props.title}></RegularText>
        </ButtonStyle>
    );
};
