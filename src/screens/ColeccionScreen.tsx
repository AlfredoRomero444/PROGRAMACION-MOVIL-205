import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, Alert, Modal, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Pencil, Trash2, Plus, Music2 } from 'lucide-react-native';
import {
  inicializarDB, insertarDisco, obtenerDiscos,
  actualizarDisco, eliminarDisco, DiscoColeccion,
} from '../services/ColeccionDB';
import { useTheme } from '../context/ThemeContext';
import { glowCard, glowCircle } from '../utils/glow';

// Formulario vacío reutilizable
const FORM_VACIO = { nombre: '', artista: '', genero: '', año: '', nota: '' };

export default function ColeccionScreen() {
  const { colors } = useTheme();

  const [discos, setDiscos]               = useState<DiscoColeccion[]>([]);
  const [modalVisible, setModal]          = useState(false);
  const [editando, setEditando]           = useState<DiscoColeccion | null>(null);
  const [form, setForm]                   = useState(FORM_VACIO);
  const [modalEliminar, setModalEliminar] = useState<DiscoColeccion | null>(null);

  useEffect(() => {
    inicializarDB();
    cargar();
  }, []);

  const cargar = useCallback(() => {
    setDiscos(obtenerDiscos());
  }, []);

  const abrirNuevo = () => {
    setEditando(null);
    setForm(FORM_VACIO);
    setModal(true);
  };

  const abrirEditar = (disco: DiscoColeccion) => {
    setEditando(disco);
    setForm({
      nombre:  disco.nombre,
      artista: disco.artista,
      genero:  disco.genero,
      año:     String(disco.año),
      nota:    disco.nota,
    });
    setModal(true);
  };

  const guardar = () => {
    const { nombre, artista, genero, año, nota } = form;
    if (!nombre.trim() || !artista.trim() || !genero.trim() || !año.trim()) {
      Alert.alert('Campos requeridos', 'Llena nombre, artista, género y año.');
      return;
    }
    const añoNum = parseInt(año, 10);
    if (isNaN(añoNum) || añoNum < 1900 || añoNum > 2030) {
      Alert.alert('Año inválido', 'Ingresa un año entre 1900 y 2030.');
      return;
    }

    if (editando) {
      actualizarDisco(editando.id, nombre.trim(), artista.trim(), genero.trim(), añoNum, nota.trim());
    } else {
      insertarDisco(nombre.trim(), artista.trim(), genero.trim(), añoNum, nota.trim());
    }

    setModal(false);
    cargar();
  };

  const confirmarEliminar = (disco: DiscoColeccion) => {
    setModalEliminar(disco);
  };

  return (
    <View style={[s.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={s.header}>
        <Text style={[s.label, { color: colors.accent }]}>MI COLECCIÓN</Text>
        <Text style={[s.title, { color: colors.textPrimary }]}>SQLite Local</Text>
        <Text style={[s.subtitle, { color: colors.textSecondary }]}>{discos.length} discos guardados en el dispositivo</Text>
      </View>

      {/* Lista */}
      <FlatList
        data={discos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={s.lista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.vacio}>
            <View
              style={[
                s.vacioIconWrapper,
                { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
                glowCircle(colors.accent, { opacity: 0.18, radius: 10 }),
              ]}
            >
              <Music2 color={colors.textMuted} size={36} strokeWidth={1.5} />
            </View>
            <Text style={[s.vacioTexto, { color: colors.textMuted }]}>Tu colección está vacía.{'\n'}Agrega tu primer disco.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              s.card,
              { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
              glowCard(colors.accent, { opacity: 0.12, radius: 10, elevation: 3 }),
            ]}
          >
            <View style={s.cardLeft}>
              <View style={[s.dot, { backgroundColor: colors.accent }]} />
            </View>
            <View style={s.cardInfo}>
              <Text style={[s.cardNombre, { color: colors.textPrimary }]} numberOfLines={1}>{item.nombre}</Text>
              <Text style={[s.cardArtista, { color: colors.textSecondary }]}>{item.artista}</Text>
              <View style={s.cardMeta}>
                <View style={[s.genreBadge, { backgroundColor: colors.accentFaint }]}>
                  <Text style={[s.genreText, { color: colors.accentLight }]}>{item.genero}</Text>
                </View>
                <Text style={[s.cardAño, { color: colors.textMuted }]}>{item.año}</Text>
              </View>
              {item.nota ? <Text style={[s.cardNota, { color: colors.textMuted }]} numberOfLines={1}>"{item.nota}"</Text> : null}
            </View>
            <View style={s.cardActions}>
              <TouchableOpacity style={[s.btnEdit, { backgroundColor: colors.bgDeep, borderColor: colors.accentBorder }]} onPress={() => abrirEditar(item)} activeOpacity={0.7}>
                <Pencil color="#fec3b1" size={16} strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity style={[s.btnDel, { backgroundColor: colors.bgDeep, borderColor: '#ff453a20' }]} onPress={() => confirmarEliminar(item)} activeOpacity={0.7}>
                <Trash2 color="#ff453a" size={16} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Botón flotante circular — agregar disco */}
      <TouchableOpacity
        style={[
          s.fab,
          { backgroundColor: colors.accent },
          glowCircle(colors.accent, { opacity: 0.6, radius: 14, elevation: 10 }),
        ]}
        onPress={abrirNuevo}
        activeOpacity={0.85}
      >
        <Plus color="#fff" size={26} strokeWidth={2.4} />
      </TouchableOpacity>

      {/* Modal formulario */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={s.modalOverlay}
        >
          <View style={[s.modalBox, { backgroundColor: colors.bgDeep, borderColor: colors.accentBorder }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Título del modal con ícono */}
              <View style={s.modalTitleRow}>
                <View
                  style={[
                    editando ? s.modalIconEdit : s.modalIconNew,
                    { backgroundColor: colors.accentFaint, borderColor: colors.accentBorder, borderWidth: 1 },
                    glowCircle(colors.accent, { opacity: 0.3, radius: 8 }),
                  ]}
                >
                  {editando
                    ? <Pencil color="#fec3b1" size={18} strokeWidth={2} />
                    : <Plus   color="#fec3b1" size={18} strokeWidth={2} />
                  }
                </View>
                <Text style={[s.modalTitle, { color: colors.textPrimary }]}>
                  {editando ? 'Editar disco' : 'Nuevo disco'}
                </Text>
              </View>

              <Text style={[s.inputLabel, { color: colors.textSecondary }]}>Nombre del álbum *</Text>
              <TextInput
                style={[s.input, { backgroundColor: colors.bgInput, color: colors.textPrimary, borderColor: colors.borderMid }]}
                placeholder="Ej: After Hours"
                placeholderTextColor={colors.textMuted}
                value={form.nombre}
                onChangeText={(v) => setForm({ ...form, nombre: v })}
              />

              <Text style={[s.inputLabel, { color: colors.textSecondary }]}>Artista *</Text>
              <TextInput
                style={[s.input, { backgroundColor: colors.bgInput, color: colors.textPrimary, borderColor: colors.borderMid }]}
                placeholder="Ej: The Weeknd"
                placeholderTextColor={colors.textMuted}
                value={form.artista}
                onChangeText={(v) => setForm({ ...form, artista: v })}
              />

              <Text style={[s.inputLabel, { color: colors.textSecondary }]}>Género *</Text>
              <TextInput
                style={[s.input, { backgroundColor: colors.bgInput, color: colors.textPrimary, borderColor: colors.borderMid }]}
                placeholder="Ej: R&B / Pop"
                placeholderTextColor={colors.textMuted}
                value={form.genero}
                onChangeText={(v) => setForm({ ...form, genero: v })}
              />

              <Text style={[s.inputLabel, { color: colors.textSecondary }]}>Año *</Text>
              <TextInput
                style={[s.input, { backgroundColor: colors.bgInput, color: colors.textPrimary, borderColor: colors.borderMid }]}
                placeholder="Ej: 2020"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                maxLength={4}
                value={form.año}
                onChangeText={(v) => setForm({ ...form, año: v })}
              />

              <Text style={[s.inputLabel, { color: colors.textSecondary }]}>Nota personal</Text>
              <TextInput
                style={[s.input, s.inputMulti, { backgroundColor: colors.bgInput, color: colors.textPrimary, borderColor: colors.borderMid }]}
                placeholder="¿Qué te parece este álbum?"
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                value={form.nota}
                onChangeText={(v) => setForm({ ...form, nota: v })}
              />

              <View style={s.modalBtns}>
                <TouchableOpacity style={[s.btnCancelar, { backgroundColor: colors.bgCard, borderColor: colors.border }]} onPress={() => setModal(false)}>
                  <Text style={[s.btnCancelarText, { color: colors.textSecondary }]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.btnGuardar, glowCircle(colors.accent, { opacity: 0.4, radius: 12 })]}
                  onPress={guardar}
                >
                  <Text style={s.btnGuardarText}>
                    {editando ? 'Actualizar' : 'Guardar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal confirmar eliminar */}
      <Modal visible={modalEliminar !== null} animationType="fade" transparent>
        <View style={s.deleteOverlay}>
          <View style={[s.deleteBox, { backgroundColor: colors.bgDeep }]}>
            <View style={[s.deleteIconWrapper, { backgroundColor: colors.accentFaint, borderColor: '#ff453a50' }]}>
              <Trash2 color="#ff453a" size={26} strokeWidth={1.8} />
            </View>

            <Text style={[s.deleteTitle, { color: colors.textPrimary }]}>Eliminar disco</Text>

            <Text style={[s.deleteMsg, { color: colors.textSecondary }]}>
              ¿Seguro que quieres eliminar{'\n'}
              <Text style={[s.deleteNombre, { color: colors.textPrimary }]}>"{modalEliminar?.nombre}"</Text>?{'\n'}
              Esta acción no se puede deshacer.
            </Text>

            <View style={[s.deleteDivider, { backgroundColor: colors.border }]} />

            <View style={s.deleteBtns}>
              <TouchableOpacity
                style={s.deleteCancelar}
                activeOpacity={0.7}
                onPress={() => setModalEliminar(null)}
              >
                <Text style={[s.deleteCancelarText, { color: colors.textSecondary }]}>Cancelar</Text>
              </TouchableOpacity>

              <View style={[s.deleteBtnDivider, { backgroundColor: colors.border }]} />

              <TouchableOpacity
                style={s.deleteConfirmar}
                activeOpacity={0.7}
                onPress={() => {
                  if (modalEliminar) {
                    eliminarDisco(modalEliminar.id);
                    cargar();
                    setModalEliminar(null);
                  }
                }}
              >
                <Text style={s.deleteConfirmarText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container:      { flex: 1, paddingTop: 25 },
  header:         { paddingHorizontal: 25, marginBottom: 20 },
  label:          { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  title:          { fontSize: 32, fontWeight: '900', marginTop: 8, letterSpacing: -1 },
  subtitle:       { fontSize: 14, marginTop: 6 },

  fab:            { position: 'absolute', right: 24, bottom: 24,
                    width: 60, height: 60, borderRadius: 30,
                    alignItems: 'center', justifyContent: 'center' },

  lista:          { paddingHorizontal: 25, paddingTop: 6, paddingBottom: 100 },

  vacio:          { alignItems: 'center', marginTop: 60, gap: 16 },
  vacioIconWrapper: { width: 72, height: 72, borderRadius: 36,
                      alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  vacioTexto:     { fontSize: 15, textAlign: 'center', lineHeight: 24 },

  card:           { flexDirection: 'row', borderRadius: 22,
                    padding: 14, marginBottom: 12, borderWidth: 1, alignItems: 'center' },
  cardLeft:       { marginRight: 12 },
  dot:            { width: 10, height: 10, borderRadius: 5 },
  cardInfo:       { flex: 1 },
  cardNombre:     { fontSize: 15, fontWeight: '700' },
  cardArtista:    { fontSize: 13, marginTop: 2 },
  cardMeta:       { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  genreBadge:     { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  genreText:      { fontSize: 11, fontWeight: '600' },
  cardAño:        { fontSize: 12 },
  cardNota:       { fontSize: 12, fontStyle: 'italic', marginTop: 4 },
  cardActions:    { gap: 8 },
  btnEdit:        { width: 36, height: 36, borderRadius: 18,
                    alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  btnDel:         { width: 36, height: 36, borderRadius: 18,
                    alignItems: 'center', justifyContent: 'center', borderWidth: 1 },

  // Modal formulario
  modalOverlay:     { flex: 1, backgroundColor: '#000000aa', justifyContent: 'flex-end' },
  modalBox:         { borderTopLeftRadius: 28, borderTopRightRadius: 28,
                      padding: 28, maxHeight: '90%', borderTopWidth: 1 },
  modalTitleRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  modalIconEdit:    { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  modalIconNew:     { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  modalTitle:       { fontSize: 20, fontWeight: '800' },
  inputLabel:       { fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 6 },
  input:            { borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, marginBottom: 16,
                      borderWidth: 1, fontSize: 14 },
  inputMulti:       { height: 90, textAlignVertical: 'top' },
  modalBtns:        { flexDirection: 'row', gap: 12, marginTop: 8 },
  btnCancelar:      { flex: 1, paddingVertical: 15, borderRadius: 16, alignItems: 'center', borderWidth: 1 },
  btnCancelarText:  { fontSize: 15, fontWeight: '700' },
  btnGuardar:       { flex: 1, backgroundColor: '#fec3b1', paddingVertical: 15,
                      borderRadius: 16, alignItems: 'center' },
  btnGuardarText:   { color: '#fff', fontSize: 15, fontWeight: '800' },

  // Modal eliminar — respeta el tema oscuro/claro, mismo diseño que cerrar sesión
  deleteOverlay:      { flex: 1, backgroundColor: '#000000b0',
                        justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  deleteBox:          { width: '100%', borderRadius: 20,
                        overflow: 'hidden', alignItems: 'center', paddingTop: 28 },
  deleteIconWrapper:  { width: 56, height: 56, borderRadius: 28,
                        borderWidth: 1.5,
                        alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  deleteTitle:        { fontSize: 17, fontWeight: '700',
                        marginBottom: 8, textAlign: 'center' },
  deleteMsg:          { fontSize: 13, textAlign: 'center',
                        lineHeight: 20, paddingHorizontal: 12, marginBottom: 24 },
  deleteNombre:       { fontWeight: '700' },
  deleteDivider:      { width: '100%', height: 1 },
  deleteBtns:         { flexDirection: 'row', width: '100%' },
  deleteBtnDivider:   { width: 1 },
  deleteCancelar:     { flex: 1, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  deleteCancelarText: { fontSize: 14, fontWeight: '600' },
  deleteConfirmar:    { flex: 1, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  deleteConfirmarText:{ color: '#ff453a', fontSize: 14, fontWeight: '700' },
});