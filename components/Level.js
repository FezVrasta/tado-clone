import React from 'react';
import { View, PanResponder } from 'react-native';
import posed from 'react-native-pose';
import styled, { css } from '@emotion/native';
import { decycle } from 'json-decycle';
import { getGradient, getPrimaryColor } from '../colors';
import { BOX_SIZE, EXPANDED_BOX_SIZE, LARGE_BOX_SIZE } from '../constants';

const getPercentage = temp => ((temp - 5) / (25 - 5)) * 100;

const config = {
  collapsed: { height: 0 },
  confirming: { height: LARGE_BOX_SIZE / 2 },
};
Array.from({ length: 25 }).forEach(
  (_, t) =>
    (config[`${t + 5}`] = {
      height: EXPANDED_BOX_SIZE * ((getPercentage(t + 5) + 1) / 100),
    })
);

const ActionWrapper = styled.View`
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${String(LARGE_BOX_SIZE / 2)}px;
`;

const Value = styled(posed.View(config))`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0 0 50px 50px;
  background-color: #ffffff;
`;

const Handle = styled(
  posed.View({
    collapsed: { scale: 0 },
    expanded: { scale: 1 },
  })
)`
  height: 6px;
  width: 24%;
  border-radius: 10px;
  margin-top: 10px;
  background-color: ${props => getPrimaryColor(props.temp)};
`;

const Level = styled(props => {
  return (
    <View ref={props.innRef} {...props}>
      <Value
        pointerEvents="none"
        pose={props.pose === 'expanded' ? props.temp : props.pose}
      >
        <Handle
          pose={props.pose === 'expanded' ? 'expanded' : 'collapsed'}
          temp={props.temp}
        />
      </Value>
      <ActionWrapper
        pointerEvents={props.pose === 'expanded' ? 'none' : 'auto'}
      >
        {props.children}
      </ActionWrapper>
    </View>
  );
})`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50px;
  overflow: hidden;
`;

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: this.onPanResponderMove,
    });
  }

  state = {
    height: EXPANDED_BOX_SIZE,
  };

  onPanResponderMove = (evt, state) => {
    const offset = this.state.height - evt.nativeEvent.locationY;
    const temp = Math.round(
      Math.min(Math.max(offset / (this.state.height / 21), 0), 21) + 4
    );
    this.props.setTemperature(temp === 4 ? 'off' : temp);
  };

  ref = React.createRef();

  render() {
    return (
      <Level
        {...this.props}
        {...this.panResponder.panHandlers}
        pointerEvents={this.props.pose !== 'collapsed' ? 'auto' : 'none'}
        onLayout={evt =>
          this.setState({ height: evt.nativeEvent.layout.height })
        }
      />
    );
  }
}
