import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import AddBookScreen from "./src/screens/AddBookScreen";
import BookDetailScreen from "./src/screens/BookDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [books, setBooks] = useState([
    { id: "1", title: "1984", author: "George Orwell", year: "1949", status: "Lido" },
    { id: "2", title: "Dom Casmurro", author: "Machado de Assis", year: "1899", status: "Não Lido" },
  ]);

  // função para adicionar livro
  const addBook = (book) => {
    setBooks([...books, { ...book, id: Date.now().toString() }]);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} books={books} />}
        </Stack.Screen>
        <Stack.Screen name="AddBook">
          {(props) => <AddBookScreen {...props} addBook={addBook} />}
        </Stack.Screen>
        <Stack.Screen name="BookDetail" component={BookDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
