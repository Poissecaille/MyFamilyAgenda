import React from 'react';
import styled from 'styled-components/native';
import { colors } from '../src/utility/Global';

const TitleStyle = styled.Text`
  font-size: 15px;
  text-align: left;
  font-family: PlayfairDisplay-SemiBold;
  color: ${colors.Clearer1};
`;

export const Title = (props) => {
  return <TitleStyle idTest="text" style={props.style}>{props.value}</TitleStyle>;
};
