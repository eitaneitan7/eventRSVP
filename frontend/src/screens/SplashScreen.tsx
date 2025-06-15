import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Linking,
  StyleSheet,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

const SplashScreen = () => {
  const opacity = useRef(new Animated.Value(1)).current;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [initialRoute, setInitialRoute] = useState<{
    name: keyof RootStackParamList;
    params?: any;
  } | null>(null);

  // Handle deep link
  useEffect(() => {
    const checkInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const match = url.match(/event\/(\d+)/);
        if (match) {
          const eventId = match[1];
          setInitialRoute({ name: 'EventDetails', params: { id: eventId } });
          return;
        }
      }
      setInitialRoute({ name: 'Home' });
    };

    checkInitialURL();
  }, []);

  const handleLottieFinish = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      if (initialRoute) {
        navigation.replace(initialRoute.name, initialRoute.params);
      }
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <LottieView
        source={require('@/assets/lottie/splash.json')}
        autoPlay
        loop={false}
        onAnimationFinish={handleLottieFinish}
        style={styles.lottie}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  lottie: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default SplashScreen;
