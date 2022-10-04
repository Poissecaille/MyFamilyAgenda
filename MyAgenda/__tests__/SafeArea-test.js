import {SafeArea} from '../old/SafeArea';
import { expect } from '@jest/globals';
import React from 'react'
import {create} from 'react-test-renderer';
import {theme} from '../src/utility/Global';
import { ThemeProvider } from 'styled-components';  
// Note: test renderer must be required after react-native.

const tree= create(
<SafeArea theme={{colors: {Primary_Color:"red"}}}/>
);

test('test SafeArea component', () => {

    expect(tree.toJSON()).toMatchSnapshot();

  });