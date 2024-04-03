import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import { CurrentDate } from "./components/CurrentDate";

export default function App() {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);

  function generateUniqueId(length = 10) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      }
    } catch (err) {}
  }

  async function stopRecording() {
    setRecording(undefined);

    await recording.stopAndUnloadAsync();
    let allRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    allRecordings.push({
      // id: new Date(),
      id: generateUniqueId(),
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });

    setRecordings(allRecordings);
  }

  function getDurationFormatted(milliseconds) {
    const minutes = milliseconds / 1000 / 60;
    const seconds = Math.round((minutes - Math.floor(minutes)) * 60);
    return seconds < 10
      ? `${Math.floor(minutes)}:0${seconds}`
      : `${Math.floor(minutes)}:${seconds}`;
  }

  function clearRecordings() {
    setRecordings([]);
  }
  function clearRecordingsItem(itemId) {
    setRecordings(recordings.filter((item) => item.id !== itemId));
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording #{index + 1} | {recordingLine.duration}
          </Text>

          <TouchableOpacity
            style={styles.buttonPlay}
            activeOpacity={0.5}
            onPress={() => recordingLine.sound.replayAsync()}
          >
            <Text style={styles.buttonTitle}>PLAY</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonDelete}
            activeOpacity={0.5}
            onPress={() => clearRecordingsItem(recordingLine.id)}
          >
            <Text style={styles.buttonTitle}>DELETE</Text>
          </TouchableOpacity>
        </View>
      );
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.textAudio}>myAudio</Text>
      <Text style={styles.textAudio}>{CurrentDate()}</Text>
      <Text style={styles.textAudio}>{new Date().toLocaleDateString()}</Text>
      <View style={styles.wrapper}>
        <Button
          title={recording ? "Stop Recording" : "Start Recording\n"}
          onPress={recording ? stopRecording : startRecording}
        />
        <Button
          title={recordings.length > 0 ? "\nClear Recordings" : ""}
          onPress={clearRecordings}
        />
      </View>

      {getRecordingLines()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 26,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
    marginRight: 10,
  },

  fill: {
    flex: 1,
    margin: 15,
    borderRadius: 20,
  },
  textAudio: {
    color: "red",
  },
  wrapper: {
    flexDirection: "row",
    gap: 10,
  },
  buttonPlay: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "green",
    backgroundColor: "lightgreen",
    marginLeft: 10,
  },
  buttonDelete: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "green",
    backgroundColor: "tomato",
    marginLeft: 10,
  },
  buttonTitle: {
    color: "#301791",
    fontWeight: "700",
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
});
