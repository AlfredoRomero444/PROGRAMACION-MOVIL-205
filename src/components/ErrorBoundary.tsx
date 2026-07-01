import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Red de seguridad para toda la app: si algo truena al renderizar
 * (un dato inesperado, un componente de tercero, etc.), en vez de
 * mostrarle al usuario la pantalla roja de error de React Native,
 * mostramos una pantalla simple con opción de reintentar.
 *
 * Uso: envolver el árbol raíz una sola vez, por ejemplo en index.ts:
 *   <ErrorBoundary><App /></ErrorBoundary>
 */

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Aquí es donde, más adelante, se puede enganchar un servicio de
    // reporte de errores (Sentry, Bugsnag, etc.) en vez de solo loggear.
    console.error('AsydCore ErrorBoundary:', error, info);
  }

  handleRetry = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Algo salió mal</Text>
          <Text style={styles.subtitle}>
            Ocurrió un error inesperado. Puedes intentar de nuevo.
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090912',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#8e8e93',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#fec3b1',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 26,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
