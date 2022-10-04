import React, {useEffect, useState} from 'react';
import {Button, View} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

export const ColorPickerObject = props => {
  const [currentColor, setCurrentColor] = useState('#fffff');
  return (
    <>
      {props.visible && (
        <View>
          <ColorPicker
            ref={r => {}}
            color={currentColor}
            onColorChangeComplete={color => {
              setCurrentColor(color);
              props.colorChangeHandler(color);
            }}
            thumbSize={40}
            row={false}
            swatchesLast={false}
            sliderHidden={true}
          />
          {/* <Button title="btn-picker" onPress={() => this.picker.revert()} /> */}
        </View>
      )}
    </>
  );
};
