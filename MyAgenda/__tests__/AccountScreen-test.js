import {AccountScreen} from '../src/components/Account';    
import { expect } from '@jest/globals';
import React from 'react'
import {create} from 'react-test-renderer';
// Note: test renderer must be required after react-native.

const tree= create(
<AccountScreen/>
);

test('test AccountScreen component', () => {
    expect(tree.toJSON()).toMatchSnapshot();
  });