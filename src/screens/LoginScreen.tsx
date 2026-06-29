import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';

type LoginScreenProps = {
  onLogin: () => void;
};

type AlertData = {
  titulo: string;
  mensaje: string;
};

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alerta, setAlerta] = useState<AlertData | null>(null);

  const mostrarAlerta = (titulo: string, mensaje: string) => {
    setAlerta({ titulo, mensaje });
  };

  const handleSubmit = () => {
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();
    const nameTrimmed = name.trim();

    if (isRegister) {
      if (!nameTrimmed) {
        mostrarAlerta('Campo requerido', 'Ingresa tu nombre completo.');
        return;
      }
      if (!emailTrimmed) {
        mostrarAlerta('Campo requerido', 'Ingresa tu correo electrónico.');
        return;
      }
      if (!emailTrimmed.includes('@') || !emailTrimmed.includes('.')) {
        mostrarAlerta('Correo inválido', 'Ingresa un correo electrónico válido.');
        return;
      }
      if (!passwordTrimmed) {
        mostrarAlerta('Campo requerido', 'Ingresa una contraseña.');
        return;
      }
      if (passwordTrimmed.length < 6) {
        mostrarAlerta('Contraseña muy corta', 'La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (passwordTrimmed !== confirmPassword.trim()) {
        mostrarAlerta('Error', 'Las contraseñas no coinciden.');
        return;
      }
    }

    if (!isRegister) {
      if (!emailTrimmed) {
        mostrarAlerta('Campo requerido', 'Ingresa tu correo electrónico.');
        return;
      }
      if (!emailTrimmed.includes('@') || !emailTrimmed.includes('.')) {
        mostrarAlerta('Correo inválido', 'Ingresa un correo electrónico válido.');
        return;
      }
      if (!passwordTrimmed) {
        mostrarAlerta('Campo requerido', 'Ingresa tu contraseña.');
        return;
      }
      if (passwordTrimmed.length < 6) {
        mostrarAlerta('Contraseña incorrecta', 'La contraseña debe tener al menos 6 caracteres.');
        return;
      }
    }

    onLogin();
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asyd Core.✧⋆</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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

      {/* Modal de alerta personalizado */}
      <Modal visible={alerta !== null} animationType="fade" transparent>
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <View style={styles.alertIconWrapper}>
              <AlertCircle color="#bf5af2" size={30} strokeWidth={1.5} />
            </View>

            <Text style={styles.alertTitle}>{alerta?.titulo}</Text>
            <Text style={styles.alertMsg}>{alerta?.mensaje}</Text>

            <View style={styles.alertDivider} />

            <TouchableOpacity
              style={styles.alertBtn}
              activeOpacity={0.8}
              onPress={() => setAlerta(null)}
            >
              <Text style={styles.alertBtnText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // Modal alerta
  alertOverlay: {
    flex: 1,
    backgroundColor: '#000000bb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#0f0f1e',
    borderRadius: 24,
    padding: 28,
    width: '85%',
    borderWidth: 1,
    borderColor: '#ffffff10',
    alignItems: 'center',
  },
  alertIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#bf5af215',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bf5af230',
  },
  alertTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  alertMsg: {
    color: '#8e8e93',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  alertDivider: {
    height: 1,
    backgroundColor: '#ffffff10',
    width: '100%',
    marginBottom: 20,
  },
  alertBtn: {
    width: '100%',
    backgroundColor: '#bf5af2',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
  },
  alertBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
});