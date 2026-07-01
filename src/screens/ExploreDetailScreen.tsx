import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { ExploreDetailProps } from '../navigation/ExploreStack';
import {
  formatPrecio,
  calcularDescuento,
  resolveImagen,
  formatFechaCorta,
} from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';

export default function ExploreDetailScreen({ route }: ExploreDetailProps) {
  const { colors } = useTheme();
  const { disco, artista } = route.params;
  const descuento = calcularDescuento(disco.precioInicial, disco.precioActual);

  return (
    <ScrollView
      style={[s.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={s.content}
    >
      {/* Portada */}
      <View style={s.coverWrapper}>
        <Image source={resolveImagen(disco.imagen)} style={s.cover} resizeMode="cover" />
        <View style={s.coverOverlay} />
        {descuento > 0 && (
          <View style={s.badgeOnImage}>
            <Text style={s.badgeText}>-{descuento}% OFERTA</Text>
          </View>
        )}
      </View>

      <Text style={[s.title, { color: colors.textPrimary }]}>{disco.nombre}</Text>

      {artista && (
        <View style={[s.artistaRow, { backgroundColor: colors.bgCard, borderColor: colors.accentBorder }]}>
          <Image source={resolveImagen(artista.imagen)} style={s.artistaAvatar} resizeMode="cover" />
          <View>
            <Text style={[s.artistaNombre, { color: colors.textPrimary }]}>{artista.nombre}</Text>
            <Text style={[s.artistaPais, { color: colors.textSecondary }]}>{artista.genero} · {artista.pais}</Text>
          </View>
        </View>
      )}

      <Text style={[s.descripcion, { color: colors.textSecondary }]}>{disco.descripcion}</Text>

      <View style={[s.card, { backgroundColor: colors.bgCard, borderColor: colors.accentBorder, shadowColor: colors.accent }]}>
        <Text style={[s.cardLabel, { color: colors.accent }]}>PRECIO</Text>
        <View style={s.precioRow}>
          <Text style={[s.precioActual, { color: colors.green }]}>{formatPrecio(disco.precioActual)}</Text>
          {descuento > 0 && (
            <Text style={[s.precioOriginal, { color: colors.textMuted }]}>{formatPrecio(disco.precioInicial)}</Text>
          )}
        </View>

        <View style={[s.divider, { backgroundColor: colors.border }]} />

        <Fila label="ID del disco" valor={String(disco.id)} colors={colors} />
        <Fila label="Oferta hasta" valor={formatFechaCorta(disco.fechaFin)} colors={colors} />
        {artista && <Fila label="Artista" valor={artista.nombre} colors={colors} />}
        {artista && <Fila label="País"    valor={artista.pais}   colors={colors} />}
      </View>
    </ScrollView>
  );
}

function Fila({ label, valor, colors }: { label: string; valor: string; colors: any }) {
  return (
    <View style={s.fila}>
      <Text style={[s.filaLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[s.filaValor, { color: colors.textPrimary }]}>{valor}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  content:   { padding: 24, paddingBottom: 50 },

  coverWrapper: {
    width: '100%', height: 320, borderRadius: 32,
    marginBottom: 20, overflow: 'hidden', backgroundColor: '#1c1c2e',
  },
  cover:        { width: '100%', height: '100%' },
  coverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#00000020' },
  badgeOnImage: {
    position: 'absolute', top: 14, left: 14,
    backgroundColor: '#fec3b1', paddingHorizontal: 12,
    paddingVertical: 5, borderRadius: 16,
  },
  badgeText:    { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1 },

  title:        { fontSize: 26, fontWeight: '900', letterSpacing: -0.5, marginBottom: 14 },

  artistaRow:   {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginBottom: 16, padding: 14, borderRadius: 22, borderWidth: 1,
  },
  artistaAvatar:  { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1c1c2e' },
  artistaNombre:  { fontWeight: '700', fontSize: 15 },
  artistaPais:    { fontSize: 12, marginTop: 3 },

  descripcion:  { fontSize: 14, lineHeight: 22, marginBottom: 24 },

  card:         {
    borderRadius: 28, padding: 22, borderWidth: 1,
    shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.16, shadowRadius: 20, elevation: 4,
  },
  cardLabel:    { fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 10 },
  precioRow:    { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  precioActual: { fontSize: 32, fontWeight: '900' },
  precioOriginal: { fontSize: 16, textDecorationLine: 'line-through' },
  divider:      { height: 1, marginVertical: 16 },
  fila:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  filaLabel:    { fontSize: 13 },
  filaValor:    { fontSize: 13, fontWeight: '600' },
});