import React, { forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  withTiming,
  useAnimatedRef,
} from "react-native-reanimated";
import StoryAnimation from "./Animation/index";
import StoryComponent from "./Story";

const { width } = Dimensions.get("window");

const Stories = forwardRef(
  ({ stories, setVisible, visible, currentUserIndex }, ref) => {
    const currentIndex = useSharedValue(0);
    const x = useSharedValue(0);
    const [pausedStoryIndex, setPausedStoryIndex] = useState(currentUserIndex);
    const [userId, setUserId] = useState(stories[0].user_id);
    const scrollViewRef = useAnimatedRef();

    const scrollHandler = useAnimatedScrollHandler((event) => {
      x.value = event.contentOffset.x;
      const index = Math.round(event.contentOffset.x / width);
      currentIndex.value = index;
    });

    console.log("USER FOLLOWING STORIES : ");
    const handleNextStory = () => {
      if (currentIndex.value < stories.length - 1) {
        const nextIndex = currentIndex.value + 1;
        x.value = withTiming(nextIndex * width);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
        setPausedStoryIndex(nextIndex);
      } else {
        setVisible(false);
      }
    };

    const handleScrolltoOffset = (offset) => {
      scrollViewRef.current?.scrollTo({ x: offset, animated: false });
      x.value = withTiming(offset, { duration: 1 });
    };

    useImperativeHandle(
      ref,
      () => ({
        handleScrolltoOffset,
      }),
      []
    );

    return (
      <View style={styles.container}>
        <Animated.ScrollView
          ref={scrollViewRef}
          style={StyleSheet.absoluteFillObject}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          snapToInterval={width}
          contentContainerStyle={{ width: width * stories.length }}
          onScroll={scrollHandler}
          decelerationRate="fast"
          onMomentumScrollEnd={() => {
            setPausedStoryIndex(currentIndex.value);
          }}
          horizontal
        >
          {stories.map((story, i) => (
            <StoryAnimation index={i} x={x} key={i}>
              <StoryComponent
                story={story}
                onStoryEnd={handleNextStory}
                index={i}
                onNextStory={handleNextStory}
                currentUserIndex={pausedStoryIndex}
                allStories={stories}
                currentUserID={userId}
                paused={pausedStoryIndex !== i}
              />
            </StoryAnimation>
          ))}
        </Animated.ScrollView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});

export default Stories;
