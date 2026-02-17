import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ListRenderItemInfo,
  StyleSheet,
} from 'react-native';
import { sendMessageToRasa } from '../services/rasa';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

type Message = {
  id: string;
  text: string;
  from: 'user' | 'bot';
};

export default function ChatBotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, from: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const botResponses = await sendMessageToRasa(input);

      const botMessages: Message[] = botResponses.map((text, index) => ({
        id: `${Date.now()}-${index}`,
        text,
        from: 'bot',
      }));

      setMessages(prev => [...prev, ...botMessages]);

      // Leer en voz alta solo las respuestas del bot
      botResponses.forEach(text => Speech.speak(text, { language: 'es', rate: 1 }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderItem = ({ item }: ListRenderItemInfo<Message>) => (
    <View style={[styles.messageContainer, item.from === 'user' ? styles.userMessage : styles.botMessage]}>
      <Text style={[styles.messageText, item.from === 'user' ? styles.userText : styles.botText]}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <FlatList ref={flatListRef} data={messages} renderItem={renderItem} keyExtractor={item => item.id} contentContainerStyle={styles.messagesList} showsVerticalScrollIndicator={false} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor="#94a3b8"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]} onPress={sendMessage} disabled={!input.trim()}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },

  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },

  messageContainer: {
    maxWidth: '80%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 6,
    borderRadius: 22,
  },

  userMessage: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
  },

  botMessage: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },

  userText: {
    color: '#ffffff',
  },

  botText: {
    color: '#1e293b',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },

  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0f172a',
    marginRight: 10,
  },

  sendButton: {
    backgroundColor: '#2563eb',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sendButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
});
