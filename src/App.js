import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import StartScreen from './screens/StartScreen';

const Stack = createNativeStackNavigator();
const STORAGE_KEY = '@books-storage';

export default function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setBooks(JSON.parse(raw));
      } catch (e) {
        console.warn('Erro ao carregar livros', e);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books)).catch(() => {});
  }, [books]);

  const addBook = (book) => {
    const newBook = { ...book, id: String(Date.now()) };
    setBooks(prevBooks => [newBook, ...prevBooks]);
  };

  const removeBook = (id) => {
    // ESTE ALERTA APARECE QUANDO VOCÊ CLICA EM EXCLUIR
    Alert.alert('Excluir', 'Deseja excluir este livro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        // A MÁGICA SÓ ACONTECE SE VOCÊ CLICAR NO BOTÃO "Excluir" DO ALERTA
        onPress: () => setBooks(prev => prev.filter(b => b.id !== id)),
      },
    ]);
  };

  const clearAllBooks = () => {
    // ESTE ALERTA APARECE QUANDO VOCÊ CLICA EM LIMPAR
    Alert.alert('Limpar tudo', 'Remover todos os livros?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        // A MÁGICA SÓ ACONTECE SE VOCÊ CLICAR NO BOTÃO "Remover" DO ALERTA
        onPress: () => setBooks([]),
      },
    ]);
  };

  const toggleBookStatus = (id) => {
    setBooks(prev =>
      prev.map(b =>
        b.id === id ? { ...b, status: b.status === 'lido' ? 'não lido' : 'lido' } : b
      )
    );
  };
  
  const editBook = (updatedBook) => {
     setBooks(prev => prev.map(b => (b.id === updatedBook.id ? updatedBook : b)));
  };


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={StartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Livros" options={{ title: 'Meus Livros' }}>
          {(props) => (
            <HomeScreen
              {...props}
              books={books}
              addBook={addBook}
              removeBook={removeBook}
              clearAllBooks={clearAllBooks}
              toggleBookStatus={toggleBookStatus}
              editBook={editBook}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}