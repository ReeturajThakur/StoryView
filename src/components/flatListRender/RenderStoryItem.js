import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import GestureRecognizer from 'react-native-swipe-gestures';

import Video from 'react-native-video';
import Colors from '../../utils/Colors';
import ProgressBar from '../../storyView/progressBar/ProgressBar';
import StoryHeader from '../header/StoryHeader';

const {height, width} = Dimensions.get('window');

const RenderStoryItem = props => {
  console.log('propssssss off ', props?.profile);
  let currentAnim = 0;
  const [loader, setLoader] = useState(true);
  const [isPause, setPause] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const AnimatedVideo = Animated.createAnimatedComponent(Video);
  const opacityAnimation = useRef(new Animated.Value(0.3)).current;
  const fadeAnimation = useRef(new Animated.Value(1)).current;

  const onSwipeDown = useCallback(() => {
    props?.handleOpen({...props.open, open: false});
  }, [props?.open]);

  const startAnimation = useCallback(() => {
    setIsLoading(true);
    Animated.timing(opacityAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [isLoading]);

  const startAnim = useCallback(
    animationStart => {
      setIsLoading(true);
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      }).start();

      if (animationStart) animationStart(0);
    },
    [isLoading],
  );

  const _onLoad = useCallback(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, [isLoading]);

  const _onLoadEnd = useCallback(() => {
    setTimeout(() => {
      setLoader(false);
      startAnim();
    }, 300);
  }, [loader]);

  const getAnimatedValue = useCallback(
    anim => {
      if (!isPause) {
        currentAnim = anim;
      }
    },
    [isPause],
  );

  const _pauseCallBack = useCallback(
    pause => {
      setPause(pause);
    },
    [isPause],
  );

  // console.log(currentAnim);

  const _setCurrentIndex = useCallback(
    param => {
      setCurrentIndex(param);
    },
    [currentIndex],
  );

  const changeStory = useCallback(
    event => {
      if (event.locationX > width / 2) {
        newStory();
      } else {
        previousStory();
      }
    },
    [currentIndex],
  );

  const newStory = useCallback(() => {
    // currentAnim = 0;

    if (props?.storyUrl.length - 1 > currentIndex) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  }, [currentIndex]);

  const previousStory = useCallback(() => {
    // currentAnim = 0;
    if (currentIndex > 0 && props.storyUrl.length) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(0);
    }
  }, [currentIndex]);

  const pauseStory = useCallback(() => {
    setPause(true);
  }, [isPause]);

  console.log(isPause);

  const thumbnailLoader = useCallback(() => {
    return (
      <Animated.Image
        resizeMode="contain"
        source={{uri: props?.storyUrl[currentIndex]?.thumbnailUrl}}
        style={[
          styles.imageDefaultStyle,
          {
            opacity: fadeAnimation,
          },
        ]}
        onLoadEnd={_onLoadEnd}
      />
    );
  }, [currentIndex]);

  const contentLoaded = useCallback(() => {
    return (
      <>
        {console.log('ispaused to hiofjoivfjiov', isPause)}
        {props.storyUrl[currentIndex]?.type === 'video' ? (
          <AnimatedVideo
            onLoad={_onLoad}
            onLoadStart={startAnimation}
            paused={isPause}
            resizeMode={'contain'}
            style={[
              styles.videoStyle,
              {
                opacity: opacityAnimation,
              },
            ]}
            source={{uri: props.storyUrl[currentIndex]?.url}}
          />
        ) : (
          <Animated.Image
            onLoadStart={startAnimation}
            onLoad={_onLoad}
            resizeMode="contain"
            source={{uri: props.storyUrl[currentIndex]?.url}}
            style={[
              styles.imageDefaultStyle,
              {
                opacity: opacityAnimation,
              },
            ]}
          />
        )}
      </>
    );
  }, [currentIndex, isPause]);

  return (
    <GestureRecognizer
      style={{
        backgroundColor: 'black',
        height: height,
        width: width,
        // zIndex: 100,
        // elevation: 100,
      }}
      onSwipeDown={onSwipeDown}>
      <TouchableOpacity
        delayLongPress={500}
        onLongPress={pauseStory}
        onPressOut={() => {
          console.log('inside', isPause);
          setPause(false);
        }}
        onPress={event => {
          changeStory(event?.nativeEvent);
        }}
        activeOpacity={1}
        style={styles.parentContainer}>
        {loader ? thumbnailLoader() : contentLoaded()}
      </TouchableOpacity>
      {isLoading ? (
        <ActivityIndicator color={Colors.red} style={styles.indicatorStyle} />
      ) : null}
      <ProgressBar
        startAnim={startAnim}
        loader={loader}
        open={props?.open}
        handleOpen={props?.handleOpen}
        stories={props.storyUrl}
        index={props.index}
        profile={props.profile}
        userName={props.userName}
        isPause={isPause}
        setPause={_pauseCallBack}
        getAnimatedValue={getAnimatedValue}
        currentAnim={currentAnim}
        currentIndex={currentIndex}
        setCurrentIndex={_setCurrentIndex}
      />
      <StoryHeader
        open={props?.open}
        profile={props?.profile}
        userName={props?.userName}
        handleOpen={props?.handleOpen}
        createdAt={props?.storyUrl[currentIndex]?.created}
      />
    </GestureRecognizer>

    // <GestureRecognizer
    //   style={styles.parentContainer}
    //   onSwipeDown={props.onSwipeDown}>
    //   <TouchableOpacity
    //     delayLongPress={500}
    //     // onLongPress={pauseStory}
    //     // onPressOut={() => {
    //     //   setPause(false);
    //     // }}
    //     // onPress={event => changeStory(event.nativeEvent)}
    //     activeOpacity={1}
    //     style={styles.parentContainer}>

    //     {props?.loader ? props?.thumbnailLoader() : props?.contentLoaded()}
    //   </TouchableOpacity>
    // </GestureRecognizer>
  );
};

export default React.memo(RenderStoryItem);

const styles = StyleSheet.create({
  parentContainer: {
    height: height,
    width: width,
  },
  imageDefaultStyle: {height: '100%', width: '100%'},
  videoStyle: {height: '100%', width: '100%'},
  indicatorStyle: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
  },
});