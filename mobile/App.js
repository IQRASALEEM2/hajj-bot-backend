import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import Constants from 'expo-constants';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';

const VOICE_LANG_MAP = {
  en: 'en-US',
  ur: 'ur-PK',
  ar: 'ar-SA',
  sd: 'sd-PK',
};

// Beautiful color palette matching web design
const COLORS = {
  background: '#F5F4F0', // Soft beige
  card: '#FAF9F5', // Cream white
  primary: '#7EC8E3', // Sky blue
  primaryDark: '#5BA8C4',
  secondary: '#A8D5BA', // Sage green
  accent: '#F4C430', // Gold
  text: '#2C2C2C',
  textMuted: '#6B6B6B',
  border: '#E5E3DD',
  userBubble: '#7EC8E3',
  botBubble: '#FAF9F5',
  online: '#10B981', // Green for online status
};

export default function App() {
  const apiUrl = useMemo(
    () =>
      Constants?.expoConfig?.extra?.apiUrl ??
      process.env.EXPO_PUBLIC_API_URL ??
      'http://192.168.0.105:5000',
    [],
  );
  const brandTitle =
    Constants?.expoConfig?.extra?.brandTitle ?? 'ZiyaulHarmayn';

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Assalamu Alaikum! 🌙 Welcome to ZiyaulHarmayn. I'm here to help you with your Hajj and Umrah journey. How can I assist you today?",
      createdAt: Date.now(),
    },
  ]);
  const [pendingText, setPendingText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const [lastAssistantLang, setLastAssistantLang] = useState('en');
  const [userPreferredLang, setUserPreferredLang] = useState('en');
  const [selectedLang, setSelectedLang] = useState('en');
  const [isTyping, setIsTyping] = useState(false);

  const listRef = useRef(null);
  const dictatedRef = useRef('');
  const sendMessageRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0)),
    [messages],
  );

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);

  const stopSpeaking = useCallback(() => {
    Speech.stop();
    setAssistantSpeaking(false);
  }, []);

  const speakAnswer = useCallback(
    (text, languageCode) => {
      if (!text) return;
      const locale = VOICE_LANG_MAP[languageCode] ?? VOICE_LANG_MAP.en;
      Speech.stop();
      setAssistantSpeaking(true);
      Speech.speak(text, {
        language: locale,
        rate: languageCode === 'ar' ? 0.9 : 1,
        onDone: () => setAssistantSpeaking(false),
        onStopped: () => setAssistantSpeaking(false),
        onError: () => setAssistantSpeaking(false),
      });
    },
    [],
  );

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      const timestamp = Date.now();
      const userMessage = {
        id: `${timestamp}-user`,
        sender: 'user',
        text: trimmed,
        createdAt: timestamp,
      };

      setMessages((prev) => [...prev, userMessage]);
      setPendingText('');
      setIsSending(true);
      setIsTyping(true);

      try {
        const response = await fetch(`${apiUrl}/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: trimmed, language: selectedLang }),
        });

        if (!response.ok) {
          throw new Error('Server error');
        }

        const data = await response.json();
        const botText = data?.answer ?? 'No response received.';
        const lang = data?.language ?? 'en';
        const botMessage = {
          id: `${Date.now()}-bot`,
          sender: 'bot',
          text: botText,
          createdAt: Date.now(),
        };

        setMessages((prev) => [...prev, botMessage]);
        setLastAssistantLang(lang);
        setUserPreferredLang(lang);
        setIsTyping(false);
        // Auto-speak answer
        speakAnswer(botText, lang);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-error`,
            sender: 'bot',
            text: 'Could not reach the assistant. Please try again.',
            createdAt: Date.now(),
          },
        ]);
        setIsTyping(false);
      } finally {
        setIsSending(false);
      }
    },
    [apiUrl, isSending, selectedLang, speakAnswer],
  );

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  const handleSend = useCallback(() => {
    sendMessage(pendingText);
  }, [pendingText, sendMessage]);

  const startVoiceInput = useCallback(async () => {
    if (isRecording) return;
    setVoiceError(null);
    dictatedRef.current = '';
    try {
      await Voice.start(VOICE_LANG_MAP[userPreferredLang] ?? VOICE_LANG_MAP.en);
      setIsRecording(true);
    } catch (error) {
      setVoiceError(
        error instanceof Error
          ? error.message
          : 'Unable to start the microphone.',
      );
    }
  }, [isRecording, userPreferredLang]);

  const stopVoiceInput = useCallback(async () => {
    if (!isRecording) return;
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (error) {
      setVoiceError(
        error instanceof Error ? error.message : 'Unable to stop recording.',
      );
      setIsRecording(false);
    }
  }, [isRecording]);

  useEffect(() => {
    Voice.onSpeechStart = () => setVoiceError(null);
    Voice.onSpeechResults = (event) => {
      const heard = event.value?.[0] ?? '';
      dictatedRef.current = heard;
      setPendingText(heard);
    };
    Voice.onSpeechError = (event) => {
      setIsRecording(false);
      setVoiceError(event.error?.message ?? 'Voice recognition error.');
    };
    Voice.onSpeechEnd = () => {
      setIsRecording(false);
      const captured = dictatedRef.current.trim();
      dictatedRef.current = '';
      if (captured && sendMessageRef.current) {
        sendMessageRef.current(captured);
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const renderItem = ({ item, index }) => {
    const isUser = item.sender === 'user';
    return (
      <View
        style={[
          styles.messageContainer,
          isUser && styles.messageContainerUser,
        ]}
      >
        {!isUser && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>🕌</Text>
            </View>
            <View style={styles.onlineIndicator} />
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.botBubble,
          ]}
        >
          <Text style={[styles.messageText, isUser && styles.userText]}>
            {item.text}
          </Text>
          {!isUser && (
            <TouchableOpacity
              style={styles.playAudioButton}
              onPress={() => speakAnswer(item.text, lastAssistantLang)}
            >
              <Text style={styles.playAudioText}>🔊 Play audio</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0.4)).current;
    const dot2 = useRef(new Animated.Value(0.4)).current;
    const dot3 = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
      const animate = (dot, delay) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0.4,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
        );
      };
      const anim1 = animate(dot1, 0);
      const anim2 = animate(dot2, 200);
      const anim3 = animate(dot3, 400);
      anim1.start();
      anim2.start();
      anim3.start();
      return () => {
        anim1.stop();
        anim2.stop();
        anim3.stop();
      };
    }, []);

    return (
      <View style={styles.messageContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🕌</Text>
          </View>
          <View style={styles.onlineIndicator} />
        </View>
        <View style={[styles.bubble, styles.botBubble]}>
          <View style={styles.typingIndicator}>
            <Animated.View style={[styles.typingDot, { opacity: dot1 }]} />
            <Animated.View style={[styles.typingDot, { opacity: dot2 }]} />
            <Animated.View style={[styles.typingDot, { opacity: dot3 }]} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Beautiful Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.headerAvatarContainer}>
                <View style={styles.headerAvatar}>
                  <Text style={styles.headerAvatarText}>🕌</Text>
                </View>
                <View style={styles.headerOnlineIndicator} />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>{brandTitle}</Text>
                <Text style={styles.headerSubtitle}>Online • Ready to help</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Messages List */}
        <FlatList
          ref={listRef}
          data={sortedMessages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chat}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => listRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        {/* Voice Error */}
        {voiceError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>🎙️ {voiceError}</Text>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type your question..."
              placeholderTextColor={COLORS.textMuted}
              value={pendingText}
              onChangeText={setPendingText}
              editable={!isSending}
              multiline
              maxLength={500}
            />
            <View style={styles.inputActions}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  style={[
                    styles.iconButton,
                    isRecording && styles.iconButtonActive,
                  ]}
                  onPress={isRecording ? stopVoiceInput : startVoiceInput}
                >
                  <Text style={styles.iconButtonText}>
                    {isRecording ? '⏹️' : '🎤'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!pendingText.trim() || isSending) && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={!pendingText.trim() || isSending}
              >
                {isSending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.sendButtonText}>Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Language Switcher */}
          <View style={styles.languageSwitcher}>
            <TouchableOpacity
              style={[
                styles.langButton,
                selectedLang === 'en' && styles.langButtonActive,
              ]}
              onPress={() => {
                setSelectedLang('en');
                setUserPreferredLang('en');
              }}
            >
              <Text
                style={[
                  styles.langButtonText,
                  selectedLang === 'en' && styles.langButtonTextActive,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.langButton,
                selectedLang === 'ur' && styles.langButtonActive,
              ]}
              onPress={() => {
                setSelectedLang('ur');
                setUserPreferredLang('ur');
              }}
            >
              <Text
                style={[
                  styles.langButtonText,
                  selectedLang === 'ur' && styles.langButtonTextActive,
                ]}
              >
                اردو
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.langButton,
                selectedLang === 'ar' && styles.langButtonActive,
              ]}
              onPress={() => {
                setSelectedLang('ar');
                setUserPreferredLang('ar');
              }}
            >
              <Text
                style={[
                  styles.langButtonText,
                  selectedLang === 'ar' && styles.langButtonTextActive,
                ]}
              >
                العربية
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingTop: Platform.OS === 'ios' ? 10 : 15,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  headerAvatarText: {
    fontSize: 20,
  },
  headerOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.online,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  chat: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  messageContainerUser: {
    flexDirection: 'row-reverse',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.online,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  botBubble: {
    backgroundColor: COLORS.botBubble,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: COLORS.userBubble,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text,
  },
  userText: {
    color: '#fff',
  },
  playAudioButton: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  playAudioText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textMuted,
    opacity: 0.6,
  },
  errorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    paddingHorizontal: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 15,
    color: COLORS.text,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonActive: {
    backgroundColor: '#EF4444',
  },
  iconButtonText: {
    fontSize: 20,
  },
  sendButton: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  languageSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  langButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  langButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  langButtonText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  langButtonTextActive: {
    color: '#fff',
  },
});
