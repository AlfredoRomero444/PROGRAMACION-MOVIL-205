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

// Formulario vacío reutilizable
const FORM_VACIO = { nombre: '', artista: '', genero: '', año: '', nota: '' };

export default function ColeccionScreen() {
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
    <View style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.label}>MI COLECCIÓN</Text>
        <Text style={s.title}>SQLite Local</Text>
        <Text style={s.subtitle}>{discos.length} discos guardados en el dispositivo</Text>
      </View>

      {/* Botón agregar */}
      <TouchableOpacity style={s.btnAgregar} onPress={abrirNuevo} activeOpacity={0.85}>
        <Plus color="#fff" size={18} strokeWidth={2} />
        <Text style={s.btnAgregarText}>Agregar disco</Text>
      </TouchableOpacity>

      {/* Lista */}
      <FlatList
        data={discos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={s.lista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.vacio}>
            <View style={s.vacioIconWrapper}>
              <Music2 color="#5e5e66" size={36} strokeWidth={1.5} />
            </View>
            <Text style={s.vacioTexto}>Tu colección está vacía.{'\n'}Agrega tu primer disco.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.cardLeft}>
              <View style={s.dot} />
            </View>
            <View style={s.cardInfo}>
              <Text style={s.cardNombre} numberOfLines={1}>{item.nombre}</Text>
              <Text style={s.cardArtista}>{item.artista}</Text>
              <View style={s.cardMeta}>
                <View style={s.genreBadge}>
                  <Text style={s.genreText}>{item.genero}</Text>
                </View>
                <Text style={s.cardAño}>{item.año}</Text>
              </View>
              {item.nota ? <Text style={s.cardNota} numberOfLines={1}>"{item.nota}"</Text> : null}
            </View>
            <View style={s.cardActions}>
              <TouchableOpacity style={s.btnEdit} onPress={() => abrirEditar(item)} activeOpacity={0.7}>
                <Pencil color="#bf5af2" size={16} strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity style={s.btnDel} onPress={() => confirmarEliminar(item)} activeOpacity={0.7}>
                <Trash2 color="#ff453a" size={16} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal formulario */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={s.modalOverlay}
        >
          <View style={s.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Título del modal con ícono */}
              <View style={s.modalTitleRow}>
                <View style={editando ? s.modalIconEdit : s.modalIconNew}>
                  {editando
                    ? <Pencil color="#bf5af2" size={18} strokeWidth={2} />
                    : <Plus   color="#bf5af2" size={18} strokeWidth={2} />
                  }
                </View>
                <Text style={s.modalTitle}>
                  {editando ? 'Editar disco' : 'Nuevo disco'}
                </Text>
              </View>

              <Text style={s.inputLabel}>Nombre del álbum *</Text>
              <TextInput
                style={s.input}
                placeholder="Ej: After Hours"
                placeholderTextColor="#5e5e66"
                value={form.nombre}
                onChangeText={(v) => setForm({ ...form, nombre: v })}
              />

              <Text style={s.inputLabel}>Artista *</Text>
              <TextInput
                style={s.input}
                placeholder="Ej: The Weeknd"
                placeholderTextColor="#5e5e66"
                value={form.artista}
                onChangeText={(v) => setForm({ ...form, artista: v })}
              />

              <Text style={s.inputLabel}>Género *</Text>
              <TextInput
                style={s.input}
                placeholder="Ej: R&B / Pop"
                placeholderTextColor="#5e5e66"
                value={form.genero}
                onChangeText={(v) => setForm({ ...form, genero: v })}
              />

              <Text style={s.inputLabel}>Año *</Text>
              <TextInput
                style={s.input}
                placeholder="Ej: 2020"
                placeholderTextColor="#5e5e66"
                keyboardType="numeric"
                maxLength={4}
                value={form.año}
                onChangeText={(v) => setForm({ ...form, año: v })}
              />

              <Text style={s.inputLabel}>Nota personal</Text>
              <TextInput
                style={[s.input, s.inputMulti]}
                placeholder="¿Qué te parece este álbum?"
                placeholderTextColor="#5e5e66"
                multiline
                numberOfLines={3}
                value={form.nota}
                onChangeText={(v) => setForm({ ...form, nota: v })}
              />

              <View style={s.modalBtns}>
                <TouchableOpacity style={s.btnCancelar} onPress={() => setModal(false)}>
                  <Text style={s.btnCancelarText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnGuardar} onPress={guardar}>
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
          <View style={s.deleteBox}>
            <View style={s.deleteIconWrapper}>
              <Trash2 color="#ff453a" size={30} strokeWidth={1.5} />
            </View>

            <Text style={s.deleteTitle}>Eliminar disco</Text>

            <Text style={s.deleteMsg}>
              ¿Seguro que quieres eliminar{'\n'}
              <Text style={s.deleteNombre}>"{modalEliminar?.nombre}"</Text>?
              {'\n'}Esta acción no se puede deshacer.
            </Text>

            <View style={s.deleteDivider} />

            <View style={s.deleteBtns}>
              <TouchableOpacity
                style={s.deleteCancelar}
                activeOpacity={0.8}
                onPress={() => setModalEliminar(null)}
              >
                <Text style={s.deleteCancelarText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={s.deleteConfirmar}
                activeOpacity={0.8}
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
  container:      { flex: 1, backgroundColor: '#090912', paddingTop: 25 },
  header:         { paddingHorizontal: 25, marginBottom: 20 },
  label:          { color: '#bf5af2', fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  title:          { color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 8, letterSpacing: -1 },
  subtitle:       { color: '#8e8e93', fontSize: 14, marginTop: 6 },

  btnAgregar:     { marginHorizontal: 25, marginBottom: 20, backgroundColor: '#bf5af2',
                    paddingVertical: 14, borderRadius: 18, alignItems: 'center',
                    flexDirection: 'row', justifyContent: 'center', gap: 8 },
  btnAgregarText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  lista:          { paddingHorizontal: 25, paddingBottom: 40 },

  vacio:          { alignItems: 'center', marginTop: 60, gap: 16 },
  vacioIconWrapper: { width: 72, height: 72, borderRadius: 22, backgroundColor: '#151525',
                      alignItems: 'center', justifyContent: 'center',
                      borderWidth: 1, borderColor: '#ffffff10' },
  vacioTexto:     { color: '#5e5e66', fontSize: 15, textAlign: 'center', lineHeight: 24 },

  card:           { flexDirection: 'row', backgroundColor: '#151525', borderRadius: 18,
                    padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#ffffff10',
                    alignItems: 'center' },
  cardLeft:       { marginRight: 12 },
  dot:            { width: 10, height: 10, borderRadius: 5, backgroundColor: '#bf5af2' },
  cardInfo:       { flex: 1 },
  cardNombre:     { color: '#fff', fontSize: 15, fontWeight: '700' },
  cardArtista:    { color: '#8e8e93', fontSize: 13, marginTop: 2 },
  cardMeta:       { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  genreBadge:     { backgroundColor: '#bf5af220', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  genreText:      { color: '#d4a8f5', fontSize: 11, fontWeight: '600' },
  cardAño:        { color: '#5e5e66', fontSize: 12 },
  cardNota:       { color: '#5e5e66', fontSize: 12, fontStyle: 'italic', marginTop: 4 },
  cardActions:    { gap: 8 },
  btnEdit:        { backgroundColor: '#1c1c2e', width: 36, height: 36, borderRadius: 10,
                    alignItems: 'center', justifyContent: 'center',
                    borderWidth: 1, borderColor: '#bf5af220' },
  btnDel:         { backgroundColor: '#2c1c1c', width: 36, height: 36, borderRadius: 10,
                    alignItems: 'center', justifyContent: 'center',
                    borderWidth: 1, borderColor: '#ff453a20' },

  // Modal formulario
  modalOverlay:     { flex: 1, backgroundColor: '#000000aa', justifyContent: 'flex-end' },
  modalBox:         { backgroundColor: '#0f0f1e', borderTopLeftRadius: 28, borderTopRightRadius: 28,
                      padding: 28, maxHeight: '90%' },
  modalTitleRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  modalIconEdit:    { width: 36, height: 36, borderRadius: 10, backgroundColor: '#bf5af220',
                      alignItems: 'center', justifyContent: 'center' },
  modalIconNew:     { width: 36, height: 36, borderRadius: 10, backgroundColor: '#bf5af220',
                      alignItems: 'center', justifyContent: 'center' },
  modalTitle:       { color: '#fff', fontSize: 20, fontWeight: '800' },
  inputLabel:       { color: '#8e8e93', fontSize: 12, fontWeight: '600',
                      letterSpacing: 0.5, marginBottom: 6 },
  input:            { backgroundColor: '#151525', color: '#fff', borderRadius: 14,
                      paddingHorizontal: 16, paddingVertical: 13, marginBottom: 16,
                      borderWidth: 1, borderColor: '#ffffff10', fontSize: 14 },
  inputMulti:       { height: 90, textAlignVertical: 'top' },
  modalBtns:        { flexDirection: 'row', gap: 12, marginTop: 8 },
  btnCancelar:      { flex: 1, backgroundColor: '#1c1c2e', paddingVertical: 15,
                      borderRadius: 16, alignItems: 'center' },
  btnCancelarText:  { color: '#8e8e93', fontSize: 15, fontWeight: '700' },
  btnGuardar:       { flex: 1, backgroundColor: '#bf5af2', paddingVertical: 15,
                      borderRadius: 16, alignItems: 'center' },
  btnGuardarText:   { color: '#fff', fontSize: 15, fontWeight: '800' },

  // Modal eliminar
  deleteOverlay:      { flex: 1, backgroundColor: '#000000bb',
                        justifyContent: 'center', alignItems: 'center' },
  deleteBox:          { backgroundColor: '#0f0f1e', borderRadius: 24, padding: 28,
                        marginHorizontal: 30, borderWidth: 1, borderColor: '#ffffff10',
                        alignItems: 'center', width: '85%' },
  deleteIconWrapper:  { width: 64, height: 64, borderRadius: 20, backgroundColor: '#2c1c1c',
                        alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                        borderWidth: 1, borderColor: '#ff453a20' },
  deleteTitle:        { color: '#fff', fontSize: 18, fontWeight: '800',
                        marginBottom: 10, textAlign: 'center' },
  deleteMsg:          { color: '#8e8e93', fontSize: 14, textAlign: 'center',
                        lineHeight: 22, marginBottom: 20 },
  deleteNombre:       { color: '#ffffff', fontWeight: '700' },
  deleteDivider:      { height: 1, backgroundColor: '#ffffff10', width: '100%', marginBottom: 20 },
  deleteBtns:         { flexDirection: 'row', gap: 12, width: '100%' },
  deleteCancelar:     { flex: 1, backgroundColor: '#1c1c2e', paddingVertical: 15,
                        borderRadius: 16, alignItems: 'center',
                        borderWidth: 1, borderColor: '#ffffff08' },
  deleteCancelarText: { color: '#8e8e93', fontSize: 15, fontWeight: '700' },
  deleteConfirmar:    { flex: 1, backgroundColor: '#2c1c1c', paddingVertical: 15,
                        borderRadius: 16, alignItems: 'center',
                        borderWidth: 1, borderColor: '#ff453a30' },
  deleteConfirmarText:{ color: '#ff453a', fontSize: 15, fontWeight: '800' },
});