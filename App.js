import { useEffect, useState } from "react";
import { Button, SafeAreaView } from "react-native";

import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";

import styled from "styled-components/native";

export const getCounter = async () => {
  return parseInt((await AsyncStorage.getItem("counter")) || "0");
};

export const incrementCounter = async () => {
  const updatedValue = (await getCounter()) + 1;

  await AsyncStorage.setItem("counter", updatedValue.toString());
};

const BACKGROUND_FETCH_TASK = "background-fetch";
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  console.log(
    `Got background fetch call at date: ${new Date(now).toISOString()}`
  );

  // NOTE: increment counter by 1 each time background fetch is called
  await incrementCounter();

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// registering task in global state too?
BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
  minimumInterval: 60 * 15, // 15 minutes
});

export default function App() {
  const [timesRan, setTimesRan] = useState(0);

  const checkTimesRan = () => {
    getCounter().then(setTimesRan);
  };

  useEffect(() => {
    checkTimesRan();
  }, []);

  return (
    <SafeAreaView>
      <Section>
        <HeadingText>Keep App in background</HeadingText>
        <Text>Background fetch ran {timesRan} times.</Text>
        <Button title="Refresh" onPress={checkTimesRan} />
        <Text>Tap button to refresh count</Text>
      </Section>
    </SafeAreaView>
  );
}

const Section = styled.View`
  width: 100%;

  padding: 8px;
`;

const HeadingText = styled.Text`
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 10px;
`;
const Text = styled.Text`
  text-align: center;
  margin-bottom: 18px;
`;
