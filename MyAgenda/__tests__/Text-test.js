import {Text} from '../old/Text';
import { expect } from '@jest/globals';
import React from 'react'
import {create} from 'react-test-renderer';
// Note: test renderer must be required after react-native.


test('test default Text component', () => {
    const tree= create(<Text />);
    expect(tree.toJSON()).toMatchSnapshot();
    expect(tree.toJSON().type).toBe("Text");
    expect(tree.toJSON().props.variant).toBe("body");
    expect(tree.toJSON().props.style[0]).toEqual({ 
        "fontFamily": "Oswald_400Regular",
        "fontSize": 16,
        "fontWeight": "400",
        "color": "#C8D6F6",
        "flexWrap": "wrap",
        "marginTop": 0,
        "marginBottom": 0,
    });
    
});


test('test label Text component', () => {
    const tree= create(<Text variant="label" />);
    expect(tree.toJSON()).toMatchSnapshot();
    expect(tree.toJSON().type).toBe("Text");
    expect(tree.toJSON().props.variant).toBe("label");
    expect(tree.toJSON().props.style[0]).toEqual({ 
        "fontFamily": "Lato_400Regular",
        "fontSize": 16,
        "fontWeight": "500",
        "color": "#C8D6F6",
        "flexWrap": "wrap",
        "marginTop": 0,
        "marginBottom": 0,
    });
    
});

test('test hint Text component', () => {
    const tree= create(<Text variant="hint" />);
    expect(tree.toJSON()).toMatchSnapshot();
    expect(tree.toJSON().type).toBe("Text");
    expect(tree.toJSON().props.variant).toBe("hint");
    expect(tree.toJSON().props.style[0]).toEqual({ 
        "fontFamily": "Oswald_400Regular",
        "fontSize": 16,
        "fontWeight": "400",
        "color": "#C8D6F6",
        "flexWrap": "wrap",
        "marginTop": 0,
        "marginBottom": 0,
    });
    
});

test('test error Text component', () => {
    const tree= create(<Text variant="error" />);
    expect(tree.toJSON()).toMatchSnapshot();
    expect(tree.toJSON().type).toBe("Text");
    expect(tree.toJSON().props.variant).toBe("error");
    expect(tree.toJSON().props.style[0]).toEqual({ 
        "fontFamily": "Oswald_400Regular",
        "fontWeight": "400",
        "color": "red",
        "flexWrap": "wrap",
        "marginTop": 0,
        "marginBottom": 0,
    });
    
});


test('test caption Text component', () => {
    const tree= create(<Text variant="caption" />);
    expect(tree.toJSON()).toMatchSnapshot();
    expect(tree.toJSON().type).toBe("Text");
    expect(tree.toJSON().props.variant).toBe("caption");
    expect(tree.toJSON().props.style[0]).toEqual({ 
        "fontFamily": "Oswald_400Regular",
        "fontSize": 12,
        "fontWeight": "700",
        "color": "#C8D6F6",
        "flexWrap": "wrap",
        "marginTop": 0,
        "marginBottom": 0,
    });
    
});






