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
import {useNavigation} from '@react-navigation/native';

import {useAuth} from '@/contexts/AuthContext';
import {useI18n} from '@/contexts/I18nContext';
import {VALIDATION} from '@/config/constants';

const {height} = Dimensions.get('window');

const RegisterScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {register, loading} = useAuth();
  const {t} = useI18n();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('auth.fullNameRequired') || 'Full name is required';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.confirmPasswordRequired') || 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordsNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const success = await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
      });

      if (success) {
        setSnackbarMessage(t('auth.registrationSuccess'));
        setSnackbarVisible(true);
      } else {
        setSnackbarMessage(t('auth.registrationFailed') || 'Registration failed');
        setSnackbarVisible(true);
      }
    } catch (error) {
      setSnackbarMessage(t('errors.unknownError'));
      setSnackbarVisible(true);
    }
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
            {t('auth.createYourAccount')}
          </Text>
          <Text style={[styles.subtitle, {color: theme.colors.onSurfaceVariant}]}>
            {t('auth.joinSmartTour') || 'Join SmartTour.Jo today'}
          </Text>

          {/* Full Name Input */}
          <TextInput
            label={t('auth.fullName')}
            value={formData.fullName}
            onChangeText={(text) => {
              setFormData({...formData, fullName: text});
              if (errors.fullName) {
                setErrors({...errors, fullName: ''});
              }
            }}
            mode="outlined"
            autoCapitalize="words"
            autoComplete="name"
            error={!!errors.fullName}
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />
          {errors.fullName && (
            <Text style={[styles.errorText, {color: theme.colors.error}]}>
              {errors.fullName}
            </Text>
          )}

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
            autoComplete="password-new"
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

          {/* Confirm Password Input */}
          <TextInput
            label={t('auth.confirmPassword')}
            value={formData.confirmPassword}
            onChangeText={(text) => {
              setFormData({...formData, confirmPassword: text});
              if (errors.confirmPassword) {
                setErrors({...errors, confirmPassword: ''});
              }
            }}
            mode="outlined"
            secureTextEntry={!showConfirmPassword}
            autoComplete="password-new"
            error={!!errors.confirmPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock-check" />}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
          {errors.confirmPassword && (
            <Text style={[styles.errorText, {color: theme.colors.error}]}>
              {errors.confirmPassword}
            </Text>
          )}

          {/* Register Button */}
          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.registerButton}
            contentStyle={styles.buttonContent}>
            {t('auth.createAccount')}
          </Button>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, {color: theme.colors.onSurfaceVariant}]}>
              {t('auth.alreadyHaveAccount')} 
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
              <Text style={[styles.loginLink, {color: theme.colors.primary}]}>
                {t('auth.login')}
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
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 20,
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
    fontSize: 24,
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
  registerButton: {
    marginBottom: 24,
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default RegisterScreen;