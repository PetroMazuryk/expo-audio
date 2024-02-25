import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";

export const CurrentDate = () => {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      setCurrentDate(date.toLocaleDateString(undefined, options));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      <Text>Поточна дата: {currentDate}</Text>
    </View>
  );
};
