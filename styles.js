import React from 'react';
import { View } from 'react-native';
import styled, { css } from '@emotion/native';

export const Unit = styled.Text`
  position: relative;
  color: #fefefe;
  font-size: ${({ zoom = 1 }) => String(18 * zoom)}px;
  top: ${({ zoom = 1 }) => String(-3 * zoom)}px;
  font-weight: bold;
`;

const DegreeSymbol = styled.Text`
  position: relative;
  color: #fefefe;
  font-size: ${({ zoom = 1 }) => String(16 * zoom)}px;
  font-weight: bold;
  margin-bottom: ${({ zoom = 1 }) => String(3 * zoom)}px;
`;

export const Decimal = styled(Unit)`
  font-size: ${({ zoom = 1 }) => String(15 * zoom)}px;
  margin-top: ${({ zoom = 1 }) => String(-4 * zoom)}px;
  top: ${({ zoom = 1 }) => String(-4 * zoom)}px;
`;

export const Value = styled.Text`
  color: #fefefe;
  font-size: ${({ zoom = 1 }) => String(30 * zoom)}px;
  font-weight: bold;
`;

export const LabelBox = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Label = styled.Text`
  color: #fefefe;
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 10px;
`;

export const Percentage = styled(props => (
  <View style={props.style}>
    <Value>{props.children}</Value>
    <Unit>%</Unit>
  </View>
))`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

export const Degree = styled(props => (
  <View style={props.style}>
    <Value zoom={props.zoom}>{String(props.children).split('.')[0]}</Value>
    <View
      style={css`
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      `}
    >
      <DegreeSymbol zoom={props.zoom}>⚬</DegreeSymbol>
      <Decimal zoom={props.zoom}>
        .{String(props.children).split('.')[1] || 0}
      </Decimal>
    </View>
  </View>
))`
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;
