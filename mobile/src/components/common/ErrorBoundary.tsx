import React, {Component, ReactNode} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error: Error): State {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // In a production app, you might want to log this to an error reporting service
    // like Sentry, Bugsnag, etc.
  }

  handleRetry = () => {
    this.setState({hasError: false, error: undefined});
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback onRetry={this.handleRetry} error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  onRetry: () => void;
  error?: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({onRetry, error}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Icon 
        name="error-outline" 
        size={64} 
        color={theme.colors.error} 
        style={styles.icon}
      />
      <Text style={[styles.title, {color: theme.colors.onBackground}]}>
        Oops! Something went wrong
      </Text>
      <Text style={[styles.message, {color: theme.colors.onSurfaceVariant}]}>
        We're sorry for the inconvenience. Please try again.
      </Text>
      {__DEV__ && error && (
        <Text style={[styles.errorDetails, {color: theme.colors.error}]}>
          {error.message}
        </Text>
      )}
      <Button
        mode="contained"
        onPress={onRetry}
        style={styles.retryButton}
        contentStyle={styles.retryButtonContent}
      >
        Try Again
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorDetails: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'monospace',
    opacity: 0.7,
  },
  retryButton: {
    paddingHorizontal: 24,
  },
  retryButtonContent: {
    paddingVertical: 8,
  },
});

export default ErrorBoundary;