import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo';
import styled, { css } from '@emotion/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { State } from 'react-powerplug';
import posed, { Transition } from 'react-native-pose';
import memoize from 'memoizee';
import { getGradient, getPrimaryColor, getSecondaryColor } from './colors';
import { Degree, Percentage, LabelBox, Label } from './styles';
import Level from './components/Level';
import { EXPANDED_BOX_SIZE, BOX_SIZE, LARGE_BOX_SIZE } from './constants';

const Container = styled(LinearGradient)`
  flex: 1;
  display: flex;
`;

const Safe = styled.SafeAreaView`
  display: flex;
  flex: 1;
  align-items: stretch;
`;

const AnimatedBox = posed.View({
  collapsed: { height: BOX_SIZE, top: 0 },
  expanded: { height: EXPANDED_BOX_SIZE, top: 20 },
  confirming: { height: LARGE_BOX_SIZE, top: 0 },
});

const Box = styled(({ style, onPress, pose, children }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <AnimatedBox style={style} pose={pose}>
      {children}
    </AnimatedBox>
  </TouchableWithoutFeedback>
))`
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  background-color: #ffc235;
  width: ${String(BOX_SIZE)}px;
  border-radius: 50px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 20px;
`;

const AnimatedBoxLabel = posed.Text({
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
});

const boxLabel = (temp, current, open) => {
  let text;
  const t = Math.round(temp);
  const c = Math.round(current);

  if (c >= t) {
    text = 'Set to';
  } else if (c < t) {
    text = 'Heating to';
  }
  return (
    <AnimatedBoxLabel
      pose={open ? 'hidden' : 'visible'}
      style={css`
        color: #fefefe;
        margin-bottom: auto;
      `}
    >
      {text}
    </AnimatedBoxLabel>
  );
};

const Temp = styled(
  posed.Text({
    collapsed: { top: 0, fontSize: 90 },
    expanded: { top: -350, fontSize: 70 },
    confirming: { top: -80, fontSize: 90 },
  })
)`
  color: #fefefe;
  margin-right: -35px;
  margin-bottom: auto;
`;

const Header = styled(
  posed.View({
    visible: { top: 0 },
    hidden: { top: -100 },
  })
)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  margin-bottom: 80px;
`;

const Title = styled.Text`
  color: #fefefe;
  font-size: 18px;
`;

const Footer = styled(
  posed.View({
    visible: { bottom: 0 },
    hidden: { bottom: -300 },
  })
)`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: auto;
`;

const ICONS = {
  manual: 'cursor-pointer',
  'smart schedule': 'calendar-star',
  off: 'power',
  timer: 'timer',
};
const OperationMode = styled(props => (
  <View style={props.style}>
    <Icon
      style={css`
        color: #fefefe;
        margin-right: 10px;
      `}
      size={24}
      name={ICONS[props.children.toLowerCase()] || 'thermostat'}
    />
    <Text
      style={css`
        color: #fefefe;
      `}
    >
      {props.children}
    </Text>
  </View>
))`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
  border: 1px solid #fff;
  border-radius: 40px;
  padding: 2px 15px 2px 10px;
  margin-top: 50px;
`;

class TimerLogic extends React.Component {
  componentDidMount() {
    this.timeout = setTimeout(
      () => this.props.onPoseCompleted && this.props.onPoseCompleted(),
      5000
    );
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  render() {
    return <View {...this.props} />;
  }
}

const TimerAnim = posed(TimerLogic)({
  exit: { width: 0, transition: { duration: 0 } },
  enter: { width: BOX_SIZE, transition: { duration: 5000, ease: 'linear' } },
});

const Timer = styled(TimerAnim)`
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  background-color: ${props => getSecondaryColor(props.temp)};
`;

const AnimatedCancel = posed(TouchableOpacity)({
  exit: { opacity: 0, transition: { duration: 100 } },
  enter: { opacity: 1 },
});
const Cancel = styled(props => (
  <AnimatedCancel {...props}>
    <Text
      style={css`
        color: #000;
      `}
    >
      {props.children}
    </Text>
  </AnimatedCancel>
))`
  z-index: 1;
  margin-top: auto;
  margin-bottom: 30px;
  border: 1px solid #000;
  border-radius: 40px;
  padding: 4px 14px;
`;

const DEBUG_TEMP_SHIFT = 0;

export default class ThermostatView extends React.Component {
  state = {
    open: false,
    tempUserOverride: null,
    timeout: null,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.entity.attributes.temperature === state.tempUserOverride) {
      return { ...state, tempUserOverride: null };
    } else {
      return null;
    }
  }

  render() {
    const { state } = this;
    const { entity, onClose, setTemperature } = this.props;

    if (!entity) {
      return (
        <Container colors={getGradient(0 + DEBUG_TEMP_SHIFT)}>
          <StatusBar barStyle="light-content" />
          <Safe>
            <Text>Loading...</Text>
          </Safe>
        </Container>
      );
    }

    const attrs = entity.attributes;
    const range = attrs ? attrs.max_temp - attrs.min_temp : 0;

    const temp = state.tempUserOverride || attrs.temperature + DEBUG_TEMP_SHIFT;

    const pose = state.open
      ? 'expanded'
      : state.timeout
      ? 'confirming'
      : 'collapsed';

    return (
      <TouchableWithoutFeedback onPress={() => this.setState({ open: false })}>
        <Container colors={getGradient(temp)}>
          <StatusBar barStyle="light-content" />
          <Safe>
            <Header pose={state.open ? 'hidden' : 'visible'}>
              <Icon
                name="close-circle"
                onPress={onClose}
                size={30}
                style={css`
                  color: #fff;
                `}
              />
              <Title>{attrs.friendly_name}</Title>
              <Icon
                name="settings"
                size={30}
                style={css`
                  color: #fff;
                `}
              />
            </Header>
            <Box
              style={{
                backgroundColor: getPrimaryColor(temp),
              }}
              pose={pose}
              onPress={() =>
                pose === 'collapsed' && this.setState({ open: true })
              }
            >
              {boxLabel(temp, attrs.current_temperature, state.open)}
              {<Temp pose={pose}>{temp}°</Temp>}
              <Level
                temp={temp}
                pose={pose}
                setTemperature={temp => {
                  this.setState({ tempUserOverride: temp, timeout: true });
                }}
              >
                <Transition>
                  {pose === 'confirming' && (
                    <Timer
                      onPoseCompleted={() => {
                        this.setState({ timeout: null });
                        setTemperature(temp);
                      }}
                      key="timer"
                      temp={temp}
                    />
                  )}
                  {pose === 'confirming' && (
                    <Cancel
                      key="cancel"
                      onPress={() =>
                        this.setState(({ timeout }) => ({
                          open: false,
                          timeout: clearTimeout(timeout),
                          tempUserOverride: attrs.temperature,
                        }))
                      }
                    >
                      Cancel
                    </Cancel>
                  )}
                </Transition>
              </Level>
            </Box>

            <Footer pose={state.open ? 'hidden' : 'visible'}>
              <OperationMode>{attrs.operation_mode}</OperationMode>
              <View
                style={css`
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  padding: 80px;
                  margin-top: auto;
                `}
              >
                {
                  <LabelBox>
                    <Label>Inside now</Label>
                    <Degree>{attrs.current_temperature}</Degree>
                  </LabelBox>
                }
                {
                  <LabelBox>
                    <Label>Humidity</Label>
                    <Percentage>
                      {Math.round(attrs.current_humidity)}
                    </Percentage>
                  </LabelBox>
                }
              </View>
            </Footer>
          </Safe>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}
