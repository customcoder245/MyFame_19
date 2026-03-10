import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  StyleSheet, View, StatusBar, Pressable, ActivityIndicator
} from 'react-native';
import { ImageSourcePropType } from 'react-native';
import { useSharedValue, useDerivedValue, withTiming } from 'react-native-reanimated';
import Video, { VideoRef } from 'react-native-video';
import Avatar from './Avatar';
import Progress from './Progress';
import { PROGRESS_ACTIVE_COLOR, PROGRESS_COLOR } from './constants';

export type Story = {
  user_id: string,
  stories: Array<{ story_id: string, url: string }>,
  user_name: string,
  user_image: ImageSourcePropType,
};

type StoryProps = {
  story: Story,
  onStoryEnd: () => void,
  onNextStory: () => void,
  index: number,
  paused: boolean,
  currentUserID: number // New prop,
  currentUserIndex: number,
  allStories : Story[]
};

const StoryComponent: React.FC<StoryProps> = ({ story: { user_image, user_name, stories, user_id },story, index, onStoryEnd, onNextStory, paused, currentUserID, currentUserIndex, allStories }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state
  const videoRef = useRef<VideoRef>(null);
  const duration = useSharedValue(10000);
  const isActive = useDerivedValue(() => user_id == allStories[currentUserIndex].user_id);
  const activeStoryIndex = useDerivedValue(
    () => stories.findIndex((item) => item.story_id === stories[currentStoryIndex].story_id),
  );


  // Handle progress animation
  const animation = useSharedValue(0);

  useEffect(() => {
    // Reset animation when story index changes
    animation.value = 0;
  }, [currentStoryIndex,currentUserIndex]);

  const startAnimation = (newDuration:number) => {

    'worklet';

    if (newDuration) {
      animation.value = withTiming(1, { duration: newDuration * 1000 });

    }
    else {
      animation.value = withTiming(1, { duration: duration.value });
    }


  };

  const handlePress = useCallback(() => {
    setLoading(true);
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prevIndex) => prevIndex + 1);
    } else {
      onNextStory();
    }
  }, [currentStoryIndex, stories.length, onNextStory]);

  const handleLoadStart = () => {
    console.log("Story Loading started successfully")
    setLoading(true);
  };

  const handleLoad = (e) => {

    console.log("Story Loaded successfully")

    setLoading(false);
    startAnimation(e.duration)
  };

  const handleError = () => {
    setLoading(false);
  };


  console.log("SDDS : ",allStories[currentUserIndex].stories[currentStoryIndex]?.url)
  

  return (
    <Pressable onPress={handlePress} style={[styles.container, { paddingTop: StatusBar.currentHeight }]}>
      {loading && (
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'black', zIndex: 10 }}>
          <ActivityIndicator
            size="large"
            color="#ffffff"
            style={styles.activityIndicator}
          />
        </View>
      )}
      <Video
        source={{ uri: allStories[currentUserIndex].stories[currentStoryIndex]?.url }}
        key={currentStoryIndex}
        ref={videoRef}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
        onEnd={handlePress}
        style={styles.video}
        resizeMode="cover"
        paused={paused} // Pause video based on prop
      />
      <Progress
        active={isActive}
        activeStory={activeStoryIndex}
        progress={animation}
        length={stories.length}
        progressColor={PROGRESS_COLOR}
        progressActiveColor={PROGRESS_ACTIVE_COLOR}
      />
      <Avatar user={user_name} avatar={user_image} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  activityIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 19
  },
});

export default StoryComponent;
