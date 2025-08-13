import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  useTheme,
  Snackbar,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

import {useAuth} from '@/contexts/AuthContext';
import {useI18n} from '@/contexts/I18nContext';
import {VALIDATION} from '@/config/constants';

const {width, height} = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {login, loading} = useAuth();
  const {t} = useI18n();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = t('auth.emailRequired');
    } else if (!VALIDATION.EMAIL_REGEX.test(formData.email)) {
      newErrors.email = t('auth.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('auth.passwordRequired');
    } else if (formData.password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      newErrors.password = t('auth.passwordMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const success = await login({
        email: formData.email,
        password: formData.password,
      });

      if (success) {
        setSnackbarMessage(t('auth.loginSuccess'));
        setSnackbarVisible(true);
      } else {
        setSnackbarMessage(t('auth.invalidCredentials'));
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage(t('errors.unknownError'));
      setSnackbarVisible(true);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    // Implement social login
    setSnackbarMessage(`${provider} login coming soon!`);
    setSnackbarVisible(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.header}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        
        <View style={styles.logoContainer}>
          <View style={[styles.logo, {backgroundColor: theme.colors.surface}]}>
            <Text style={[styles.logoText, {color: theme.colors.primary}]}>
              ST
            </Text>
          </View>
          <Text style={[styles.appName, {color: theme.colors.surface}]}>
            SmartTour.Jo
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.formContainer}>
        <View style={styles.form}>
          <Text style={[styles.title, {color: theme.colors.onBackground}]}>
            {t('auth.welcomeBack')}
          </Text>
          <Text style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
            {t('auth.loginToYourAccount') || 'Sign in to your account'}
          </Text>

          {/* Email Input */}
          <TextInput
            label={t('auth.email')}
            value={formData.email}
            onChangeText={(text) => {
              setFormData({...formData, email: text});
              if (errors.email) {
                setErrors({...errors, email: ''});
              }
            }}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={!!errors.email}
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />
          {errors.email && (
            <Text style={[styles.errorText, {color: theme.colors.error}]}>
              {errors.email}
            </Text>
          )}

          {/* Password Input */}
          <TextInput
            label={t('auth.password')}
            value={formData.password}
            onChangeText={(text) => {
              setFormData({...formData, password: text});
              if (errors.password) {
                setErrors({...errors, password: ''});
              }
            }}
            mode="outlined"
            secureTextEntry={!showPassword}
            autoComplete="password"
            error={!!errors.password}
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          {errors.password && (
            <Text style={[styles.errorText, {color: theme.colors.error}]}>
              {errors.password}
            </Text>
          )}

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword' as never)}
            style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, {color: theme.colors.primary}]}>
              {t('auth.forgotPassword')}
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            contentStyle={styles.buttonContent}>
            {t('auth.login')}
          </Button>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, {backgroundColor: theme.colors.outline}]} />
            <Text style={[styles.dividerText, {color: theme.colors.onSurfaceVariant}]}>
              {t('auth.orContinueWith')}
            </Text>
            <View style={[styles.dividerLine, {backgroundColor: theme.colors.outline}]} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtons}>
            <Button
              mode="outlined"
              onPress={() => handleSocialLogin('google')}
              style={styles.socialButton}
              icon={() => <Icon name="google" size={20} color={theme.colors.onSurface} />}>
              Google
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleSocialLogin('facebook')}
              style={styles.socialButton}
              icon={() => <Icon name="facebook" size={20} color={theme.colors.onSurface} />}>
              Facebook
            </Button>
          </View>

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, {color: theme.colors.onSurfaceVariant}]}>
              {t('auth.dontHaveAccount')} 
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
              <Text style={[styles.registerLink, {color: theme.colors.primary}]}>
                {t('auth.register')}
              </Text>
            </TouchableOpacity>
          </View>
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
  header: {
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  form: {
    padding: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 24,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  socialButton: {
    flex: 0.48,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default LoginScreen;