import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';

const AudiusPlayer = () => {
  const [tracks, setTracks] = useState([]);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    const fetchTracks = async () => {
      const fetchedTracks = await fetchTrendingTracks();
      setTracks(fetchedTracks);
    };

    fetchTracks();
  }, [] );

  const playSound = async (streamUrl) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri: streamUrl });
    setSound(newSound);
    await newSound.playAsync();
  };

  return (
    <View>
      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Button title="Play" onPress={() => playSound(item.stream_url)} />
          </View>
        )}
      />
    </View>
  );
};

export default AudiusPlayer;
