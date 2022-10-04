import React from 'react';
import styled from 'styled-components/native';
import {colors} from '../components/Colors';

const RegularTextStyle = styled.Text`
  font-size: 15px;
  font-family: PlayfairDisplay-SemiBold;
  color: ${colors.White};
`;

export const RegularText = props => {
  return <RegularTextStyle idTest="text" style={props.style}>{props.value}</RegularTextStyle>;
};
