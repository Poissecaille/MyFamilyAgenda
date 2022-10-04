import React from 'react';
import styled from "styled-components/native";
import { colors } from "../src/utility/Global";


const SubTitleStyle = styled.Text`
    font-size: 15px;
    text-align: left;
    font-family: PlayfairDisplay-SemiBold;
    color: ${colors.Clearer1}
`;

export const SubTitle = (props) => {
    return (
        <SubTitleStyle
            style={props.style}
            idTest="subtitle"
        >
            {props.value}
        </SubTitleStyle>
    )
}
