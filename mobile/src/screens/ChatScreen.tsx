import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  TextInput,
  IconButton,
  useTheme,
  Chip,
  Card,
  Snackbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useI18n} from '@/contexts/I18nContext';
import {useAuth} from '@/contexts/AuthContext';
import {useOffline} from '@/contexts/OfflineContext';
import {apiService} from '@/services/apiService';
import {databaseService} from '@/services/databaseService';
import {offlineService} from '@/services/offlineService';
import {ChatMessage, ChatResponse} from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ChatScreen: React.FC = () => {
  const theme = useTheme();
  const {t} = useI18n();
  const {user} = useAuth();
  const {isOnline} = useOffline();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const flatListRef = useRef<FlatList>(null);

  const suggestions = [
    t('chat.suggestions.0'),
    t('chat.suggestions.1'),
    t('chat.suggestions.2'),
    t('chat.suggestions.3'),
    t('chat.suggestions.4'),
  ].filter(s => s && !s.startsWith('chat.suggestions'));

  useEffect(() => {
    loadChatHistory();
    
    // Add welcome message if no messages
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: t('chat.welcomeMessage'),
        type: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const loadChatHistory = async () => {
    try {
      const cachedMessages = await databaseService.getChatMessages(20);
      if (cachedMessages.length > 0) {
        setMessages(cachedMessages);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      text: messageText,
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    // Save user message locally
    await databaseService.saveChatMessage(userMessage);

    try {
      let botResponse: ChatResponse;

      if (isOnline) {
        // Send to AI chat API
        const response = await apiService.sendChatMessage(messageText);
        botResponse = response.data || {
          reply: t('chat.errorMessage'),
          status: 'error'
        };
      } else {
        // Offline response
        botResponse = {
          reply: t('chat.offlineResponse') || 'I\'m currently offline. Please try again when you have an internet connection.',
          status: 'offline'
        };
      }

      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        text: botResponse.reply,
        type: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Save bot message locally
      await databaseService.saveChatMessage(botMessage);

      // If offline, save for later sync
      if (!isOnline) {
        await offlineService.saveChatMessageOffline(userMessage);
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        text: t('chat.errorMessage'),
        type: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      setSnackbarMessage(t('errors.chatSendFailed') || 'Failed to send message');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const clearChatHistory = async () => {
    try {
      setMessages([]);
      // Clear from local database
      await databaseService.delete('chat_messages', '1=1');
      
      // Add welcome message back
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        text: t('chat.welcomeMessage'),
        type: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      
      setSnackbarMessage(t('chat.historyCleared') || 'Chat history cleared');
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage(t('errors.clearHistoryFailed') || 'Failed to clear history');
      setSnackbarVisible(true);
    }
  };

  const renderMessage = ({item}: {item: ChatMessage}) => (
    <View style={[
      styles.messageContainer,
      item.type === 'user' ? styles.userMessageContainer : styles.botMessageContainer
    ]}>
      <Card style={[
        styles.messageCard,
        {backgroundColor: item.type === 'user' ? theme.colors.primary : theme.colors.surface}
      ]}>
        <Card.Content style={styles.messageContent}>
          <Text style={[
            styles.messageText,
            {color: item.type === 'user' ? theme.colors.surface : theme.colors.onSurface}
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            {color: item.type === 'user' ? theme.colors.surface + '80' : theme.colors.onSurfaceVariant}
          ]}>
            {item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );

  if (initialLoading) {
    return <LoadingSpinner text={t('chat.loadingChat') || 'Loading chat...'} />;
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      
      {/* Header */}
      <View style={[styles.header, {backgroundColor: theme.colors.surface}]}>
        <View style={styles.headerContent}>
          <Icon name="smart-toy" size={24} color={theme.colors.primary} />
          <Text style={[styles.headerTitle, {color: theme.colors.onSurface}]}>
            {t('chat.title')}
          </Text>
        </View>
        
        {!isOnline && (
          <View style={[styles.offlineIndicator, {backgroundColor: theme.colors.errorContainer}]}>
            <Icon name="offline-bolt" size={16} color={theme.colors.onErrorContainer} />
            <Text style={[styles.offlineText, {color: theme.colors.onErrorContainer}]}>
              {t('offline.offlineMode')}
            </Text>
          </View>
        )}
        
        <IconButton
          icon="delete-sweep"
          size={20}
          onPress={clearChatHistory}
          iconColor={theme.colors.onSurfaceVariant}
        />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Typing Indicator */}
      {loading && (
        <View style={styles.typingContainer}>
          <Card style={[styles.typingCard, {backgroundColor: theme.colors.surface}]}>
            <Card.Content style={styles.typingContent}>
              <Text style={[styles.typingText, {color: theme.colors.onSurfaceVariant}]}>
                {t('chat.typing')}
              </Text>
              <View style={styles.typingDots}>
                <View style={[styles.typingDot, {backgroundColor: theme.colors.primary}]} />
                <View style={[styles.typingDot, {backgroundColor: theme.colors.primary}]} />
                <View style={[styles.typingDot, {backgroundColor: theme.colors.primary}]} />
              </View>
            </Card.Content>
          </Card>
        </View>
      )}

      {/* Suggestions */}
      {messages.length <= 1 && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={[styles.suggestionsTitle, {color: theme.colors.onSurfaceVariant}]}>
            {t('chat.quickSuggestions') || 'Quick suggestions:'}
          </Text>
          <View style={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                mode="outlined"
                onPress={() => handleSuggestionPress(suggestion)}
                style={styles.suggestionChip}>
                {suggestion}
              </Chip>
            ))}
          </View>
        </View>
      )}

      {/* Input */}
      <View style={[styles.inputContainer, {backgroundColor: theme.colors.surface}]}>
        <TextInput
          mode="outlined"
          placeholder={t('chat.placeholder')}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          style={styles.textInput}
          contentStyle={styles.textInputContent}
          right={
            <TextInput.Icon
              icon="send"
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim() || loading || (!isOnline && !!inputText.trim())}
              iconColor={inputText.trim() && !loading && (isOnline || !inputText.trim()) 
                ? theme.colors.primary 
                : theme.colors.onSurfaceVariant
              }
            />
          }
        />
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}>
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  offlineText: {
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 4,
  },
  messagesList: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageCard: {
    borderRadius: 16,
    elevation: 1,
  },
  messageContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 10,
    textAlign: 'right',
  },
  typingContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  typingCard: {
    borderRadius: 16,
    elevation: 1,
  },
  typingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  typingText: {
    fontSize: 14,
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  suggestionsContainer: {
    padding: 16,
  },
  suggestionsTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  suggestionChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  inputContainer: {
    padding: 16,
    elevation: 8,
  },
  textInput: {
    maxHeight: 100,
  },
  textInputContent: {
    paddingTop: 8,
  },
});

export default ChatScreen;