import React from 'react';
import styled from '@emotion/native';
import { AuthSession, SecureStore } from 'expo';
import { CLIENT_ID } from './constants';

const Container = styled.SafeAreaView``;
const Margin = styled.View`
  margin: 40px;
`;

const LoginText = styled.Text`
  margin-top: 150px;
  text-align: center;
  font-size: 20px;
  margin-bottom: 20px;
`;

const Label = styled.Text`
  margin-bottom: 10px;
`;

const TextInput = styled.TextInput`
  height: 40px;
  border-color: gray;
  border-width: 1px;
  padding: 5px;
  margin-bottom: 20px;
`;

const Submit = styled.Button``;

export default class LoginView extends React.Component {
  state = {
    instanceUrl: null,
  };

  handlePress = async () => {
    const { instanceUrl } = this.state;
    console.log(
      `${instanceUrl}/auth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUrl}`
    );
    const redirectUrl = AuthSession.getRedirectUrl();
    const result = await AuthSession.startAsync({
      authUrl: `${instanceUrl}/auth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUrl}`,
    });
    await SecureStore.setItemAsync('authCode', result.params.code);
    await SecureStore.setItemAsync('instanceUrl', instanceUrl);
    this.props.onAuthSucceeded({ instanceUrl });
  };

  render() {
    return (
      <Container>
        <Margin>
          <Label>Home Assistant URL:</Label>
          <TextInput
            autoCapitalize="none"
            placeholder="https://localhost:8123"
            onChangeText={instanceUrl => this.setState({ instanceUrl })}
          />
          <Submit onPress={this.handlePress} title="Login" />
        </Margin>
      </Container>
    );
  }
}
