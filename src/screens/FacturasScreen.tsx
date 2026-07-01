import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Receipt, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useFacturas } from '../context/FacturasContext';
import { formatPrecio, formatFechaHora } from '../utils/formatters';
import { Factura } from '../types';

export default function FacturasScreen() {
  const { colors } = useTheme();
  const { facturas } = useFacturas();
  const [abierta, setAbierta] = useState<string | null>(null);

  const renderFactura = ({ item }: { item: Factura }) => {
    const expandida = abierta === item.id;
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.accentBorder }]}
        activeOpacity={0.85}
        onPress={() => setAbierta(expandida ? null : item.id)}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.folio, { color: colors.accent }]}>{item.folio}</Text>
            <Text style={[styles.fecha, { color: colors.textSecondary }]}>{formatFechaHora(item.fecha)}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={[styles.total, { color: colors.textPrimary }]}>{formatPrecio(item.total)}</Text>
            {expandida ? (
              <ChevronUp color={colors.textSecondary} size={18} />
            ) : (
              <ChevronDown color={colors.textSecondary} size={18} />
            )}
          </View>
        </View>

        {expandida && (
          <View style={[styles.detalle, { borderTopColor: colors.border }]}>
            {item.items.map((it) => (
              <View key={it.discoId} style={styles.itemRow}>
                <Text style={[styles.itemNombre, { color: colors.textPrimary }]} numberOfLines={1}>
                  {it.cantidad}× {it.nombre}
                </Text>
                <Text style={[styles.itemPrecio, { color: colors.textSecondary }]}>
                  {formatPrecio(it.cantidad * it.precioUnitario)}
                </Text>
              </View>
            ))}

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.itemRow}>
              <Text style={[styles.resumenLabel, { color: colors.textSecondary }]}>Subtotal</Text>
              <Text style={[styles.resumenValor, { color: colors.textPrimary }]}>{formatPrecio(item.subtotal)}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={[styles.resumenLabel, { color: colors.textSecondary }]}>IVA (16%)</Text>
              <Text style={[styles.resumenValor, { color: colors.textPrimary }]}>{formatPrecio(item.impuestos)}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={[styles.resumenLabelTotal, { color: colors.textPrimary }]}>Total</Text>
              <Text style={[styles.resumenValorTotal, { color: colors.green }]}>{formatPrecio(item.total)}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.sectionLabel, { color: colors.accent }]}>HISTORIAL</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Facturas</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {facturas.length} compra{facturas.length !== 1 ? 's' : ''} realizada{facturas.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {facturas.length === 0 ? (
        <View style={styles.vacioContainer}>
          <Receipt color={colors.textMuted} size={48} strokeWidth={1.5} />
          <Text style={[styles.vacioTexto, { color: colors.textSecondary }]}>
            Aún no tienes facturas.{'\n'}Compra algo desde la tienda para generar una.
          </Text>
        </View>
      ) : (
        <FlatList
          data={facturas}
          keyExtractor={(item) => item.id}
          renderItem={renderFactura}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 25, paddingHorizontal: 25 },

  header:       { marginBottom: 20 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  title:        { fontSize: 32, fontWeight: '900', marginTop: 8, letterSpacing: -1 },
  subtitle:     { fontSize: 14, marginTop: 6 },

  vacioContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingBottom: 80 },
  vacioTexto:     { fontSize: 14, textAlign: 'center', lineHeight: 20 },

  lista: { paddingBottom: 30 },

  card: { borderRadius: 20, borderWidth: 1, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  folio: { fontSize: 14, fontWeight: '800', fontFamily: 'monospace' },
  fecha: { fontSize: 12, marginTop: 3 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  total: { fontSize: 16, fontWeight: '800' },

  detalle: { marginTop: 14, paddingTop: 14, borderTopWidth: 1 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  itemNombre: { fontSize: 13, flex: 1, marginRight: 10 },
  itemPrecio: { fontSize: 13, fontWeight: '600' },

  divider: { height: 1, marginVertical: 10 },

  resumenLabel: { fontSize: 12 },
  resumenValor: { fontSize: 12, fontWeight: '600' },
  resumenLabelTotal: { fontSize: 14, fontWeight: '800', marginTop: 4 },
  resumenValorTotal: { fontSize: 14, fontWeight: '800', marginTop: 4 },
});
