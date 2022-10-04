import {Spacer} from '../old/Spacer';
import { expect } from '@jest/globals';
import React from 'react'
import {create} from 'react-test-renderer';
// Note: test renderer must be required after react-native.



test('test default Spacer component', () => {
    const tree= create(<Spacer />);

    expect(tree.toJSON()).toMatchSnapshot();
    expect(tree.toJSON().props.variant).toEqual("marginTop:4px");
});

test('test medium Spacer component', () => {
    const tree= create(<Spacer position="left" size="medium" />);
    expect(tree.toJSON()).toMatchSnapshot();
    expect(tree.toJSON().props.variant).toEqual("marginLeft:8px");
});

test('test large Spacer component', () => {
    const tree= create(<Spacer position="bottom" size="large" />);
    expect(tree.toJSON()).toMatchSnapshot();
    expect(tree.toJSON().props.variant).toEqual("marginBottom:16px");
});

