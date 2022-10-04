import {AccountScreen} from "../src/components/Account";
import { render, fireEvent } from '@testing-library/react-native';
import 'react-native';
import React from 'react';
import {create} from 'react-test-renderer';

describe('<AccountScreen />', () => {
    it('Test Starting page', () => {
        const tree = create(<AccountScreen />);
        expect(tree).toMatchSnapshot();
    });
});