import {SubTitle} from '../old/SubTitle';
import { expect } from '@jest/globals';
import React from 'react'
import {create} from 'react-test-renderer';
// Note: test renderer must be required after react-native.

const tree= create(<SubTitle value="this is a test"/>);

test('test SubTitle component', () => {
    expect(tree.toJSON()).toMatchSnapshot();
    const text = tree.root.findByProps({idTest: "subtitle"}).props
    expect(text.children).toEqual("this is a test");
});