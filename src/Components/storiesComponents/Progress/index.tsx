import React, { FC, memo } from 'react';
import { View } from 'react-native';
import ProgressItem from './item';
import { WIDTH } from '../constants';
import ProgressStyles from './Progress.styles';
import { StoryProgressProps } from '../componentsDTO';

const Progress: FC<StoryProgressProps> = ( {
  progress, active, activeStory, length,
  progressActiveColor, progressColor, progressContainerStyle,
} ) => {

  // console.log(active.value,activeStory.value)

  const width = ( (
    WIDTH - ProgressStyles.container.left * 2 ) - ( length - 1 )
    * ProgressStyles.container.gap ) / length;

  return (
    <View style={[ ProgressStyles.container, progressContainerStyle, { width: WIDTH } ]}>
      {[ ...Array( length ).keys() ].map( ( val ) => (
        <ProgressItem
          active={active}
          activeStory={activeStory}
          progress={progress}
          index={val}
          width={width}
          key={val}
          progressActiveColor={progressActiveColor}
          progressColor={progressColor}
        />
      ) )}
    </View>
  );

};

export default memo( Progress );
