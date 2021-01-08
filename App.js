import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import * as FaceDetector from 'expo-face-detector';
// import * as MediaLibrary from 'expo-media-library';

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
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [smileDetected, setSmileDetected] = useState(false);
  const cameraRef = useRef();

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

  const switchCameraType = () => {
    if (type === Camera.Constants.Type.front) {
      setType(Camera.Constants.Type.back);
    } else {
      setType(Camera.Constants.Type.front);
    }
  };

  const onFacesDetected = ({ faces }) => {
    const face = faces[0];
    if (face) {
      if (face.smilingProbability > 0.7) {
        setSmileDetected(true);
      }
      takePhoto();
    }
  };

  const takePhoto = async () => {
    try {
      if (cameraRef) {
        let { uri } = await cameraRef.current.takePictureAsync({ quality: 1, exif: true });
        if (uri) {
          savePhoto(uri);
        }
      }
    } catch (e) {
      alert(e);
      setSmileDetected(false);
    }
  };

  const savePhoto = async (uri) => {};

  return (
    <Container>
      <Camera
        style={{ width: '90%', height: '65%', borderRadius: 20, overflow: 'hidden' }}
        type={type}
        onFacesDetected={smileDetected ? null : onFacesDetected}
        faceDetectorSettings={{
          detectLandmarks: FaceDetector.Constants.Landmarks.all,
          runClassifications: FaceDetector.Constants.Classifications.all,
        }}
        ref={cameraRef}
      ></Camera>
      <TouchableOpacity onPress={switchCameraType}>
        <MaterialIcons
          name={type === Camera.Constants.Type.front ? 'camera-rear' : 'camera-front'}
          style={{ marginTop: 40 }}
          size={50}
          color="#f1f3f5"
        />
      </TouchableOpacity>
    </Container>
  );
}
