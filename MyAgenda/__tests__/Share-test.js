import {ShareComponent} from '../src/components/Share';    
import { expect } from '@jest/globals';
import React from 'react'
import {create} from 'react-test-renderer';
// Note: test renderer must be required after react-native.

const tree= create(
<ShareComponent/>
);

test('test Share component', () => {
    expect(tree.toJSON()).toMatchSnapshot();
  });