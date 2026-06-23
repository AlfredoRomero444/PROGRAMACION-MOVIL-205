import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

type LoginScreenProps = {
  onLogin: () => void;
};

export default function LoginScreen({
  onLogin,
}: LoginScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    // Aquí podrás agregar validaciones más adelante
    onLogin();
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    // Limpiamos los campos al cambiar de modo
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Asyd Core.✧⋆
      </Text>

      <Text style={styles.subtitle}>
        {isRegister
          ? 'Crea una cuenta para descubrir música'
          : 'Inicia sesión para descubrir música'}
      </Text>

      {isRegister && (
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          placeholderTextColor="#8e8e93"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#8e8e93"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#8e8e93"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {isRegister && (
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          placeholderTextColor="#8e8e93"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>
          {isRegister ? 'Registrarse' : 'Iniciar sesión'}
        </Text>
      </TouchableOpacity>

      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
        </Text>
        <TouchableOpacity onPress={toggleMode}>
          <Text style={styles.switchLink}>
            {isRegister ? 'Inicia sesión' : 'Regístrate'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090912',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  title: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    color: '#8e8e93',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
  },

  input: {
    backgroundColor: '#151525',
    color: '#fff',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffffff10',
  },

  button: {
    backgroundColor: '#bf5af2',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },

  switchText: {
    color: '#8e8e93',
    fontSize: 14,
  },

  switchLink: {
    color: '#bf5af2',
    fontSize: 14,
    fontWeight: '700',
  },
});