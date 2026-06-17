import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const proyecto = {
  nombre: 'Programación Móvil',
  version: '1.0.0',
  descripcion:
    'Aplicación funcional en React Native para evaluación parcial.',
  repositorio:
    'https://github.com/AlfredoRomero444/PROGRAMACION-MOVIL-205',
  instagram:
    'https://www.instagram.com/asyd.g1?igsh=ZG92M2V0NXlsN2du',
  facebook:
    'https://www.facebook.com/share/1Ggccb14Jk/',
  tiktok:
    'https://www.tiktok.com/@asyd.g1',
  activo: true,
};

export default function ProjectScreen() {
  const abrirRepositorio = async () => {
    const appUrl = 'https://www.github.com://AlfredoRomero444/PROGRAMACION-MOVIL-205';

    try {
      const supported = await Linking.canOpenURL(appUrl);

      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(proyecto.repositorio);
      }
    } catch (error) {
      console.error('No se pudo abrir el repositorio:', error);
    }
  };

  const abrirInstagram = async () => {
    const appUrl = 'instagram://user?username=asyd.g1';

    try {
      const supported = await Linking.canOpenURL(appUrl);

      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(proyecto.instagram);
      }
    } catch (error) {
      console.error('No se pudo abrir Instagram:', error);
    }
  };

  const abrirFacebook = async () => {
    const appUrl =
      'fb://facewebmodal/f?href=https://www.facebook.com/share/1Ggccb14Jk/';

    try {
      const supported = await Linking.canOpenURL(appUrl);

      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(proyecto.facebook);
      }
    } catch (error) {
      console.error('No se pudo abrir Facebook:', error);
    }
  };

  const abrirTiktok = async () => {
    const appUrl = 'tiktok://user?username=asyd.g1';

    try {
      const supported = await Linking.canOpenURL(appUrl);

      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(proyecto.tiktok);
      }
    } catch (error) {
      console.error('No se pudo abrir TikTok:', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionLabel}>
        DETALLES DEL PROYECTO
      </Text>

      <View style={styles.mainCard}>
        <View style={styles.neonLine} />

        <View style={styles.titleContainer}>
          <View style={styles.titleWrapper}>
            <Text style={styles.programacion}>
              Programación
            </Text>

            <Text style={styles.movil}>
              Móvil
            </Text>
          </View>

          <Image
            source={require('../../assets/upq.jpg')}
            style={styles.logoUPQ}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.description}>
          {proyecto.descripcion}
        </Text>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>VERSION</Text>
          <Text style={styles.value}>
            {proyecto.version}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>STATUS</Text>
          <Text
            style={[
              styles.value,
              styles.activeValue,
            ]}
          >
            {proyecto.activo ? 'ACTIVO' : 'OFFLINE'}
          </Text>
        </View>

        <View style={styles.githubCard}>
          <Ionicons
            name="logo-github"
            size={22}
            color="#ffffff"
          />

          <View style={styles.githubContent}>
            <Text style={styles.label}>
              REPOSITORIO
            </Text>

            <Text
              style={styles.githubLink}
              onPress={abrirRepositorio}
            >
              {proyecto.repositorio.replace('https://', '')}
            </Text>
          </View>
        </View>

        <View style={styles.instagramCard}>
          <Ionicons
            name="logo-instagram"
            size={22}
            color="#E1306C"
          />

          <View style={styles.instagramContent}>
            <Text style={styles.label}>
              INSTAGRAM
            </Text>

            <Text
              style={styles.instagramLink}
              onPress={abrirInstagram}
            >
              @asyd.g1
            </Text>
          </View>
        </View>

        <View style={styles.facebookCard}>
          <Ionicons
            name="logo-facebook"
            size={22}
            color="#1877F2"
          />

          <View style={styles.facebookContent}>
            <Text style={styles.label}>
              FACEBOOK
            </Text>

            <Text
              style={styles.facebookLink}
              onPress={abrirFacebook}
            >
              Asyd Gaze
            </Text>
          </View>
        </View>

        <View style={styles.tiktokCard}>
          <Ionicons
            name="logo-tiktok"
            size={22}
            color="#ffffff"
          />

          <View style={styles.tiktokContent}>
            <Text style={styles.label}>
              TIKTOK
            </Text>

            <Text
              style={styles.tiktokLink}
              onPress={abrirTiktok}
            >
              @asyd.g1
            </Text>
          </View>
        </View>
      </View>

      <Text
        style={[
          styles.sectionLabel,
          { marginTop: 30 },
        ]}
      >
        DEBUG DATA (JSON.stringify)
      </Text>

      <View style={styles.consoleBox}>
        <View style={styles.consoleHeader}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <Text style={styles.codeText}>
          {JSON.stringify(proyecto, null, 2)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090912',
  },

  content: {
    padding: 25,
    paddingBottom: 100,
  },

  sectionLabel: {
    color: '#bf5af2',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 15,
  },

  mainCard: {
    backgroundColor: '#151525',
    borderRadius: 30,
    padding: 25,
    paddingTop: 30,
    borderWidth: 1,
    borderColor: '#ffffff10',
  },

  neonLine: {
    width: 55,
    height: 4,
    backgroundColor: '#bf5af2',
    borderRadius: 2,
    marginBottom: 18,
  },

  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },

  titleWrapper: {
    flex: 1,
  },

  programacion: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 32,
  },

  movil: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 32,
    textAlign: 'center',
    marginTop: -2,
    marginRight: 15,
  },

  logoUPQ: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: '#fff',
    marginLeft: 15,
  },

  description: {
    color: '#8e8e93',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },

  divider: {
    height: 1,
    backgroundColor: '#ffffff10',
    marginVertical: 15,
  },

  row: {
    marginBottom: 15,
  },

  label: {
    color: '#8e8e93',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },

  value: {
    color: '#fff',
    fontSize: 15,
  },

  activeValue: {
    color: '#32d74b',
  },

  githubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff08',
    borderRadius: 15,
    padding: 12,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ffffff10',
  },

  githubContent: {
    marginLeft: 12,
  },

  githubLink: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  instagramCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff08',
    borderRadius: 15,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ffffff10',
  },

  instagramContent: {
    marginLeft: 12,
  },

  instagramLink: {
    color: '#E1306C',
    fontSize: 14,
    fontWeight: '700',
  },

  facebookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff08',
    borderRadius: 15,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ffffff10',
  },

  facebookContent: {
    marginLeft: 12,
  },

  facebookLink: {
    color: '#1877F2',
    fontSize: 14,
    fontWeight: '700',
  },

  tiktokCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff08',
    borderRadius: 15,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ffffff10',
  },

  tiktokContent: {
    marginLeft: 12,
  },

  tiktokLink: {
    color: '#25F4EE',
    fontSize: 14,
    fontWeight: '700',
    textShadowColor: '#FE2C55',
    textShadowOffset: { width: 1, height: 0 },
    textShadowRadius: 1,
  },

  consoleBox: {
    backgroundColor: '#000',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#bf5af244',
    width: '100%',
  },

  consoleHeader: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    padding: 10,
    gap: 5,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff22',
  },

  codeText: {
    color: '#bf5af2',
    fontFamily: 'monospace',
    padding: 20,
    fontSize: 12,
    lineHeight: 18,
  },
});