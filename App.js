import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #4dabf7;
`;

const TitleText = styled.Text`
  font-size: 22px;
  color: #fff;
`;

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <Container>
        <ActivityIndicator />
      </Container>
    );
  }

  if (hasPermission === false) {
    return (
      <Container>
        <TitleText>No access to camera</TitleText>
      </Container>
    );
  }

  return (
    <Container>
      <Camera
        style={{ width: '90%', height: '65%', borderRadius: 20, overflow: 'hidden' }}
        type={Camera.Constants.Type.front}
      ></Camera>
    </Container>
  );
}
