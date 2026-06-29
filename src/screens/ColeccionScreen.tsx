import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, Alert, Modal, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import {
  inicializarDB, insertarDisco, obtenerDiscos,
  actualizarDisco, eliminarDisco, DiscoColeccion,
} from '../services/ColeccionDB';

// Formulario vacío reutilizable
const FORM_VACIO = { nombre: '', artista: '', genero: '', año: '', nota: '' };

export default function ColeccionScreen() {
  const [discos, setDiscos]       = useState<DiscoColeccion[]>([]);
  const [modalVisible, setModal]  = useState(false);
  const [editando, setEditando]   = useState<DiscoColeccion | null>(null);
  const [form, setForm]           = useState(FORM_VACIO);

  // Inicializar DB y cargar datos al montar
  useEffect(() => {
    inicializarDB();
    cargar();
  }, []);

  const cargar = useCallback(() => {
    setDiscos(obtenerDiscos());
  }, []);

  // Abre modal en modo "nuevo"
  const abrirNuevo = () => {
    setEditando(null);
    setForm(FORM_VACIO);
    setModal(true);
  };

  // Abre modal en modo "editar"
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
    Alert.alert(
      'Eliminar disco',
      `¿Seguro que quieres eliminar "${disco.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => { eliminarDisco(disco.id); cargar(); },
        },
      ]
    );
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
        <Text style={s.btnAgregarText}>+ Agregar disco</Text>
      </TouchableOpacity>

      {/* Lista */}
      <FlatList
        data={discos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={s.lista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.vacio}>
            <Text style={s.vacioEmoji}>🎵</Text>
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
              <TouchableOpacity style={s.btnEdit} onPress={() => abrirEditar(item)}>
                <Text style={s.btnEditText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btnDel} onPress={() => confirmarEliminar(item)}>
                <Text style={s.btnDelText}>🗑️</Text>
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
              <Text style={s.modalTitle}>
                {editando ? '✏️  Editar disco' : '➕  Nuevo disco'}
              </Text>

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
                <TouchableOpacity
                  style={s.btnCancelar}
                  onPress={() => setModal(false)}
                >
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
                    paddingVertical: 14, borderRadius: 18, alignItems: 'center' },
  btnAgregarText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  lista:          { paddingHorizontal: 25, paddingBottom: 40 },

  vacio:          { alignItems: 'center', marginTop: 60, gap: 12 },
  vacioEmoji:     { fontSize: 48 },
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
                    alignItems: 'center', justifyContent: 'center' },
  btnEditText:    { fontSize: 16 },
  btnDel:         { backgroundColor: '#2c1c1c', width: 36, height: 36, borderRadius: 10,
                    alignItems: 'center', justifyContent: 'center' },
  btnDelText:     { fontSize: 16 },

  // Modal
  modalOverlay:   { flex: 1, backgroundColor: '#000000aa', justifyContent: 'flex-end' },
  modalBox:       { backgroundColor: '#0f0f1e', borderTopLeftRadius: 28, borderTopRightRadius: 28,
                    padding: 28, maxHeight: '90%' },
  modalTitle:     { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 24 },
  inputLabel:     { color: '#8e8e93', fontSize: 12, fontWeight: '600',
                    letterSpacing: 0.5, marginBottom: 6 },
  input:          { backgroundColor: '#151525', color: '#fff', borderRadius: 14,
                    paddingHorizontal: 16, paddingVertical: 13, marginBottom: 16,
                    borderWidth: 1, borderColor: '#ffffff10', fontSize: 14 },
  inputMulti:     { height: 90, textAlignVertical: 'top' },
  modalBtns:      { flexDirection: 'row', gap: 12, marginTop: 8 },
  btnCancelar:    { flex: 1, backgroundColor: '#1c1c2e', paddingVertical: 15,
                    borderRadius: 16, alignItems: 'center' },
  btnCancelarText:{ color: '#8e8e93', fontSize: 15, fontWeight: '700' },
  btnGuardar:     { flex: 1, backgroundColor: '#bf5af2', paddingVertical: 15,
                    borderRadius: 16, alignItems: 'center' },
  btnGuardarText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});