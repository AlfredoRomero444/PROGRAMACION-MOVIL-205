import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { discos, artistas } from '../services/DiscosService';
import { Disco } from '../types/index';

export default function HomeScreen() {
  const getArtista = (id: number) => {
    return artistas.find(
      artista => artista.id === id
    );
  };

  const handleOferta = (disco: Disco) => {
    const nuevaOferta =
      disco.precioActual + 100;

    Alert.alert(
      'Confirmar oferta',
      `¿Deseas ofertar $${nuevaOferta} por ${disco.nombre}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Ofertar',
          onPress: () =>
            Alert.alert(
              'Oferta enviada',
              `Tu oferta de $${nuevaOferta} fue registrada correctamente.`
            ),
        },
      ]
    );
  };

  const renderDisco = ({
    item,
  }: {
    item: Disco;
  }) => {
    const artista = getArtista(
      item.artistaId
    );

    return (
      <View style={styles.card}>
        <Image
          source={
            typeof item.imagen === 'string'
              ? { uri: item.imagen }
              : item.imagen
          }
          style={styles.imagen}
        />

        <View style={styles.content}>
          <Text style={styles.nombre}>
            {item.nombre}
          </Text>

          <Text style={styles.artista}>
            {artista?.nombre}
          </Text>

          <Text style={styles.genero}>
            {artista?.genero} •{' '}
            {artista?.pais}
          </Text>

          <Text style={styles.descripcion}>
            {item.descripcion}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>
                PRECIO INICIAL
              </Text>

              <Text style={styles.statValue}>
                ${item.precioInicial}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>
                OFERTA ACTUAL
              </Text>

              <Text style={styles.statValue}>
                ${item.precioActual}
              </Text>
            </View>
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>
              SUBASTA ACTIVA
            </Text>

            <Text style={styles.price}>
              ${item.precioActual}
            </Text>
          </View>

          <Text style={styles.fecha}>
            FINALIZA: {item.fechaFin}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              handleOferta(item)
            }
          >
            <Text
              style={styles.buttonText}
            >
              OFERTAR +$100
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>
        Albums / Singles
      </Text>

      <Text style={styles.subtitle}>
        Catálogo Premium Álbumes & Singles
      </Text>

      <FlatList
        data={discos}
        keyExtractor={item =>
          item.id.toString()
        }
        renderItem={renderDisco}
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.list
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090912',
    paddingTop: 20,
  },

  sectionLabel: {
    color: '#bf5af2',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginHorizontal: 25,
  },

  subtitle: {
    color: '#8e8e93',
    fontSize: 14,
    marginHorizontal: 25,
    marginTop: 5,
    marginBottom: 20,
  },

  list: {
    paddingHorizontal: 25,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: '#151525',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffffff10',
  },

  imagen: {
    width: '100%',
    height: 220,
  },

  content: {
    padding: 20,
  },

  nombre: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  artista: {
    color: '#bf5af2',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },

  genero: {
    color: '#8e8e93',
    fontSize: 12,
    marginTop: 4,
  },

  descripcion: {
    color: '#fff',
    marginTop: 15,
    lineHeight: 22,
    fontSize: 14,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  statBox: {
    width: '48%',
    backgroundColor: '#090912',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },

  statLabel: {
    color: '#bf5af2',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 5,
  },

  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  priceBox: {
    marginTop: 18,
    backgroundColor: '#090912',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bf5af230',
  },

  priceLabel: {
    color: '#bf5af2',
    fontSize: 10,
    fontWeight: '700',
  },

  price: {
    color: '#32d74b',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 5,
  },

  fecha: {
    color: '#8e8e93',
    fontSize: 12,
    marginTop: 15,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#bf5af2',
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
});