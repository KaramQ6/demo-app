import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  useTheme,
  Snackbar,
} from 'react-native-paper';

import {useI18n} from '@/contexts/I18nContext';
import {authService} from '@/services/authService';
import {VALIDATION} from '@/config/constants';

const ForgotPasswordScreen: React.FC = () => {
  const theme = useTheme();
  const {t} = useI18n();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError(t('auth.emailRequired'));
      return false;
    }
    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      setError(t('auth.emailInvalid'));
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    setLoading(true);
    try {
      const result = await authService.resetPassword(email);
      
      if (result.success) {
        setEmailSent(true);
        setSnackbarMessage(t('auth.resetEmailSent') || 'Password reset email sent successfully');
        setSnackbarVisible(true);
      } else {
        setSnackbarMessage(result.error || t('errors.unknownError'));
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage(t('errors.networkError'));
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.successContainer}>
          <Text style={[styles.successTitle, {color: theme.colors.onBackground}]}>
            {t('auth.checkYourEmail') || 'Check Your Email'}
          </Text>
          <Text style={[styles.successMessage, {color: theme.colors.onSurfaceVariant}]}>
            {t('auth.resetEmailSentMessage') || 
             'We have sent password recovery instructions to your email address.'}
          </Text>
          <Button
            mode="contained"
            onPress={() => setEmailSent(false)}
            style={styles.backButton}>
            {t('common.back')}
          </Button>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={[styles.title, {color: theme.colors.onBackground}]}>
            {t('auth.resetPassword')}
          </Text>
          <Text style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
            {t('auth.resetPasswordInstructions') || 
             'Enter your email address and we\'ll send you a link to reset your password.'}
          </Text>

          <TextInput
            label={t('auth.email')}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError('');
            }}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={!!error}
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />
          {error && (
            <Text style={[styles.errorText, {color: theme.colors.error}]}>
              {error}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleResetPassword}
            loading={loading}
            disabled={loading}
            style={styles.resetButton}
            contentStyle={styles.buttonContent}>
            {t('auth.sendResetLink') || 'Send Reset Link'}
          </Button>
        </View>
      </ScrollView>

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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  form: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },
  resetButton: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  backButton: {
    paddingHorizontal: 32,
  },
});

export default ForgotPasswordScreen;