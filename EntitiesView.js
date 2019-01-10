import React from 'react';
import {
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
  SafeAreaView,
} from 'react-native';
import styled, { css } from '@emotion/native';
import Color from 'color';
import { getMidColor } from './colors';
import { Degree } from './styles';
import ThermostatView from './ThermostatView';

const entityWidth = Dimensions.get('window').width / 3 - 20;
const entityHeight = entityWidth;

const ScrollView = styled.ScrollView`
  flex: 1;
  display: flex;
`;

const Container = styled.SafeAreaView`
  flex: 1;
  display: flex;
`;

const Margin = styled.View`
  margin: 50px 10px 10px 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Name = styled.Text`
  color: #fefefe;
  font-weight: bold;
  font-size: 14px;
`;

const Status = styled.Text`
  color: #fefefe;
  font-size: 12px;
`;

const Title = styled.View`
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.8);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  color: #000;
`;

const Modal = styled.Modal``;

const entityBox = css`
  width: ${String(entityWidth)}px;
  height: ${String(entityHeight)}px;
  margin: 5px;
  border-radius: 10px;
  padding: 10px 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

class InnerClimateEntity extends React.Component {
  state = {
    expanded: false,
  };

  render() {
    const {
      style,
      data: { attributes: attrs },
    } = this.props;

    return (
      <>
        <Modal
          animationType="slide"
          visible={this.state.expanded}
          onRequestClose={() => this.setState({ expanded: false })}
        >
          <ThermostatView
            entity={this.props.data}
            onClose={() => this.setState({ expanded: false })}
            setTemperature={temp =>
              this.props.setTemperature(temp, this.props.data.entity_id)
            }
          />
        </Modal>

        <TouchableWithoutFeedback
          onPress={() => this.setState({ expanded: true })}
        >
          <View style={style}>
            <Degree zoom={1.5}>{attrs.current_temperature}</Degree>
            <Name>{attrs.friendly_name}</Name>
            <Status>
              {attrs.current_temperature < attrs.temperature
                ? 'Heating to'
                : 'Set to'}{' '}
              {attrs.temperature}°
            </Status>
          </View>
        </TouchableWithoutFeedback>
      </>
    );
  }
}

const ClimateEntity = styled(InnerClimateEntity)`
  ${entityBox}
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: ${({ data: { attributes: attrs } }) =>
    getMidColor(attrs.temperature)};
`;

const LightEntity = styled.View`
  ${entityBox}
  background-color: ${({ data }) =>
    data.state === 'on'
      ? Color(data.attributes.rgb_color).string()
      : '#EBEBEB'};
`;

export default function EntitiesView({
  locationName,
  entities,
  setTemperature,
}) {
  return (
    <>
      <Title>
        <SafeAreaView>
          <Text
            style={css`
              font-weight: 600;
              font-size: 18px;
              text-align: center;
              padding: 14px;
            `}
          >
            {locationName}
          </Text>
        </SafeAreaView>
      </Title>
      <ScrollView>
        <Container>
          <Margin>
            {entities.map(entity => {
              console.log(entity.entity_id, entity.state);
              switch (entity.entity_id.split('.')[0]) {
                case 'climate':
                  return (
                    <ClimateEntity
                      key={entity.entity_id}
                      data={entity}
                      setTemperature={setTemperature}
                    />
                  );
                case 'light':
                  return <LightEntity key={entity.entity_id} data={entity} />;
              }
            })}
          </Margin>
        </Container>
      </ScrollView>
    </>
  );
}
