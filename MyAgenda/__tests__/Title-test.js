import {Title} from '../old/Title';
import { expect } from '@jest/globals';
import React from 'react'
import {create} from 'react-test-renderer';
// Note: test renderer must be required after react-native.

const tree= create(<Title value="this is a test"/>);

test('test Title component', () => {
    expect(tree.toJSON()).toMatchSnapshot();
    const text = tree.root.findByProps({idTest: "text"}).props
    expect(text.children).toEqual("this is a test");
  });