import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ShoppingCart, Minus, Plus, Trash2, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useFacturas } from '../context/FacturasContext';
import { formatPrecio, resolveImagen } from '../utils/formatters';
import { CartItem } from '../types';

export default function CartScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { items, totalPrecio, updateCantidad, removeFromCart, clearCart } = useCart();
  const { crearFactura } = useFacturas();
  const [folioGenerado, setFolioGenerado] = useState<string | null>(null);

  const handlePagar = () => {
    if (items.length === 0) return;
    const factura = crearFactura(
      items.map((i) => ({
        discoId: i.disco.id,
        nombre: i.disco.nombre,
        cantidad: i.cantidad,
        precioUnitario: i.disco.precioActual,
      }))
    );
    clearCart();
    setFolioGenerado(factura.folio);
  };

  const cerrarConfirmacion = () => {
    setFolioGenerado(null);
    navigation.navigate('Facturas' as never);
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={[styles.itemCard, { backgroundColor: colors.bgCard, borderColor: colors.accentBorder }]}>
      <Image source={resolveImagen(item.disco.imagen)} style={styles.itemImage} resizeMode="cover" />

      <View style={styles.itemInfo}>
        <Text style={[styles.itemNombre, { color: colors.textPrimary }]} numberOfLines={1}>
          {item.disco.nombre}
        </Text>
        <Text style={[styles.itemPrecio, { color: colors.accentLight }]}>
          {formatPrecio(item.disco.precioActual)} c/u
        </Text>

        <View style={styles.stepperRow}>
          <TouchableOpacity
            style={[styles.stepperBtn, { borderColor: colors.accentBorder }]}
            onPress={() => updateCantidad(item.disco.id, item.cantidad - 1)}
          >
            <Minus color={colors.accent} size={14} strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={[styles.stepperValue, { color: colors.textPrimary }]}>{item.cantidad}</Text>
          <TouchableOpacity
            style={[styles.stepperBtn, { borderColor: colors.accentBorder }]}
            onPress={() => updateCantidad(item.disco.id, item.cantidad + 1)}
          >
            <Plus color={colors.accent} size={14} strokeWidth={2.5} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.trashBtn} onPress={() => removeFromCart(item.disco.id)}>
            <Trash2 color="#e24b4a" size={16} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.itemSubtotal, { color: colors.green }]}>
        {formatPrecio(item.disco.precioActual * item.cantidad)}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.sectionLabel, { color: colors.accent }]}>MI CARRITO</Text>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Carrito</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.vacioContainer}>
          <ShoppingCart color={colors.textMuted} size={48} strokeWidth={1.5} />
          <Text style={[styles.vacioTexto, { color: colors.textSecondary }]}>
            Tu carrito está vacío.{'\n'}Agrega discos desde la tienda.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.disco.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
        />
      )}

      {items.length > 0 && (
        <View style={[styles.footer, { backgroundColor: colors.bgCard, borderColor: colors.accentBorder }]}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total</Text>
            <Text style={[styles.totalValor, { color: colors.textPrimary }]}>{formatPrecio(totalPrecio)}</Text>
          </View>
          <TouchableOpacity style={[styles.pagarBtn, { backgroundColor: colors.accent }]} onPress={handlePagar} activeOpacity={0.85}>
            <Text style={styles.pagarBtnText}>Generar factura y pagar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Confirmación de compra */}
      <Modal visible={folioGenerado !== null} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.bgDeep, borderColor: colors.accentBorder }]}>
            <View style={[styles.modalIconWrap, { backgroundColor: colors.accentFaint, borderColor: colors.accentBorder }]}>
              <CheckCircle2 color={colors.green} size={30} strokeWidth={1.8} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>¡Compra realizada!</Text>
            <Text style={[styles.modalMsg, { color: colors.textSecondary }]}>
              Se generó la factura {folioGenerado}.{'\n'}Puedes revisarla en la pestaña Facturas.
            </Text>
            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.accent }]} onPress={cerrarConfirmacion} activeOpacity={0.8}>
              <Text style={styles.modalBtnText}>Ver factura</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 25, paddingHorizontal: 25 },

  header:       { marginBottom: 20 },
  sectionLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  title:        { fontSize: 32, fontWeight: '900', marginTop: 8, letterSpacing: -1 },

  vacioContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingBottom: 80 },
  vacioTexto:     { fontSize: 14, textAlign: 'center', lineHeight: 20 },

  lista: { paddingBottom: 20 },

  itemCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 20, borderWidth: 1, padding: 10, marginBottom: 12,
  },
  itemImage: { width: 60, height: 60, borderRadius: 14 },
  itemInfo:  { flex: 1 },
  itemNombre: { fontSize: 14, fontWeight: '700' },
  itemPrecio: { fontSize: 12, marginTop: 2 },

  stepperRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  stepperBtn:   { width: 26, height: 26, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepperValue: { fontSize: 14, fontWeight: '700', minWidth: 16, textAlign: 'center' },
  trashBtn:     { marginLeft: 'auto', padding: 4 },

  itemSubtotal: { fontSize: 13, fontWeight: '800' },

  footer: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderWidth: 1, borderBottomWidth: 0,
    padding: 20, marginHorizontal: -25,
  },
  totalRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 },
  totalLabel: { fontSize: 14 },
  totalValor: { fontSize: 24, fontWeight: '900' },
  pagarBtn:      { paddingVertical: 16, borderRadius: 26, alignItems: 'center' },
  pagarBtnText:  { color: '#fff', fontSize: 15, fontWeight: '800' },

  modalOverlay: { flex: 1, backgroundColor: '#000000bb', justifyContent: 'center', alignItems: 'center' },
  modalBox: { borderRadius: 28, padding: 28, width: '85%', borderWidth: 1, alignItems: 'center' },
  modalIconWrap: {
    width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, borderWidth: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 10, textAlign: 'center' },
  modalMsg:   { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 22 },
  modalBtn:   { width: '100%', paddingVertical: 15, borderRadius: 20, alignItems: 'center' },
  modalBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
