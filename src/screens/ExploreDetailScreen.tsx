import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
} from 'react-native';
import { ExploreDetailProps } from '../navigation/ExploreStack';
import { formatPrecio, calcularDescuento, resolveImagen, formatFechaCorta } from '../utils/formatters';

export default function ExploreDetailScreen({ route }: ExploreDetailProps) {
  const { disco, artista } = route.params;   // params tipados con TypeScript
  const descuento = calcularDescuento(disco.precioInicial, disco.precioActual);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>

      {/* Portada */}
      <Image
        source={resolveImagen(disco.imagen)}
        style={s.cover}
        resizeMode="cover"
      />

      {descuento > 0 && (
        <View style={s.badge}>
          <Text style={s.badgeText}>-{descuento}% OFERTA</Text>
        </View>
      )}

      {/* Info principal */}
      <Text style={s.title}>{disco.nombre}</Text>

      {artista && (
        <View style={s.artistaRow}>
          <Image source={resolveImagen(artista.imagen)} style={s.artistaAvatar} />
          <View>
            <Text style={s.artistaNombre}>{artista.nombre}</Text>
            <Text style={s.artistaPais}>{artista.genero} · {artista.pais}</Text>
          </View>
        </View>
      )}

      <Text style={s.descripcion}>{disco.descripcion}</Text>

      {/* Precios */}
      <View style={s.card}>
        <Text style={s.cardTitle}>PRECIO</Text>
        <View style={s.precioRow}>
          <Text style={s.precioActual}>{formatPrecio(disco.precioActual)}</Text>
          {descuento > 0 && (
            <Text style={s.precioOriginal}>{formatPrecio(disco.precioInicial)}</Text>
          )}
        </View>

        <View style={s.divider} />

        {/* Detalles */}
        <Fila label="ID del disco"   valor={String(disco.id)} />
        <Fila label="Oferta hasta"   valor={formatFechaCorta(disco.fechaFin)} />
        {artista && <Fila label="Artista" valor={artista.nombre} />}
        {artista && <Fila label="País"    valor={artista.pais} />}
      </View>

    </ScrollView>
  );
}

function Fila({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={s.fila}>
      <Text style={s.filaLabel}>{label}</Text>
      <Text style={s.filaValor}>{valor}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#090912' },
  content:        { padding: 24, paddingBottom: 50 },
  cover:          { width: '100%', aspectRatio: 1, borderRadius: 24, marginBottom: 12,
                    backgroundColor: '#151525' },
  badge:          { alignSelf: 'flex-start', backgroundColor: '#bf5af2',
                    paddingHorizontal: 12, paddingVertical: 5,
                    borderRadius: 12, marginBottom: 16 },
  badgeText:      { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  title:          { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  artistaRow:     { flexDirection: 'row', alignItems: 'center', gap: 12,
                    marginTop: 14, marginBottom: 16 },
  artistaAvatar:  { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1c1c2e' },
  artistaNombre:  { color: '#fff', fontWeight: '700', fontSize: 14 },
  artistaPais:    { color: '#8e8e93', fontSize: 12, marginTop: 2 },
  descripcion:    { color: '#8e8e93', fontSize: 14, lineHeight: 22, marginBottom: 24 },
  card:           { backgroundColor: '#151525', borderRadius: 20, padding: 20,
                    borderWidth: 1, borderColor: '#ffffff10' },
  cardTitle:      { color: '#bf5af2', fontSize: 11, fontWeight: '800',
                    letterSpacing: 2, marginBottom: 10 },
  precioRow:      { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  precioActual:   { color: '#32d74b', fontSize: 28, fontWeight: '900' },
  precioOriginal: { color: '#5e5e66', fontSize: 16, textDecorationLine: 'line-through' },
  divider:        { height: 1, backgroundColor: '#ffffff10', marginVertical: 16 },
  fila:           { flexDirection: 'row', justifyContent: 'space-between',
                    alignItems: 'center', paddingVertical: 8 },
  filaLabel:      { color: '#8e8e93', fontSize: 13 },
  filaValor:      { color: '#fff', fontSize: 13, fontWeight: '600' },
});