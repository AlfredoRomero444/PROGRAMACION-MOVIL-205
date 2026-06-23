import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Svg, Path, G, Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';

type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

interface ApiPayload {
  status: string;
  code: number;
  endpoint?: string;
  message?: string;
  data?: {
    userId: string;
    nombre: string;
    canciones: number;
    artistas: number;
    playlists: number;
    repo?: {
      nombre: string;
      estrellas: number;
      forks: number;
      lenguaje: string | null;
      visibilidad: string;
      ultimoCommit: string;
    };
  };
  meta: {
    ping: string;
    requests: number;
    uptime: string;
  };
}

interface UserData {
  nombre: string;
  correo: string;
  cancionesEscuchadas: number;
  artistasSeguidos: number;
  playlists: number;
}

// ── Props ────────────────────────────────────────────────────────
interface ProfileScreenProps {
  onLogout: () => void;
}

// ── Íconos SVG ──────────────────────────────────────────────────
const GitHubIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect width="24" height="24" rx="5" fill="#24292e" />
    <Path
      d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"
      fill="#fff"
    />
  </Svg>
);

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Defs>
      <LinearGradient id="igBg1" x1="0%" y1="100%" x2="100%" y2="0%">
        <Stop offset="0%"   stopColor="#FFDC80" />
        <Stop offset="15%"  stopColor="#FCAF45" />
        <Stop offset="30%"  stopColor="#F77737" />
        <Stop offset="45%"  stopColor="#F56040" />
        <Stop offset="60%"  stopColor="#FD1D1D" />
        <Stop offset="75%"  stopColor="#E1306C" />
        <Stop offset="88%"  stopColor="#C13584" />
        <Stop offset="100%" stopColor="#833AB4" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width="24" height="24" rx="6" fill="url(#igBg1)" />
    <Rect x="3.5" y="3.5" width="17" height="17" rx="4.5" fill="none" stroke="#fff" strokeWidth="1.6" />
    <Circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.6" />
    <Circle cx="17" cy="7" r="1.1" fill="#fff" />
  </Svg>
);

const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect width="24" height="24" rx="5" fill="#1877F2" />
    <Path d="M16 8h-2a1 1 0 0 0-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 0 1 4-4h2v3z" fill="#fff" />
  </Svg>
);

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect width="24" height="24" rx="5" fill="#010101" />
    <Path
      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.2 8.2 0 0 0 4.79 1.53V7.05a4.85 4.85 0 0 1-1.02-.36z"
      fill="#69C9D0"
    />
    <Path
      d="M18.57 6.33a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.2 8.2 0 0 0 4.79 1.53V7.05a4.85 4.85 0 0 1-1.02-.36z"
      fill="#EE1D52"
      opacity="0.6"
    />
    <Path
      d="M16.57 6.33a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.2 8.2 0 0 0 4.79 1.53V7.05a4.85 4.85 0 0 1-1.02-.36z"
      fill="#fff"
      opacity="0.9"
    />
  </Svg>
);
// ────────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  {
    id: 'instagram',
    username: '@asyd.g1',
    url: 'https://www.instagram.com/asyd.g1?igsh=ZG92M2V0NXlsN2du',
    Icon: InstagramIcon,
  },
  {
    id: 'facebook',
    username: 'Asyd Gaze',
    url: 'https://www.facebook.com/share/1Ggccb14Jk/',
    Icon: FacebookIcon,
  },
  {
    id: 'tiktok',
    username: '@asyd.g1',
    url: 'https://www.tiktok.com/@asyd.g1',
    Icon: TikTokIcon,
  },
  {
    id: 'github',
    username: 'AlfredoRomero444',
    url: 'https://github.com/AlfredoRomero444',
    Icon: GitHubIcon,
  },
];

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  // ── Estado del usuario (editable) ───────────────────────────
  const [usuario, setUsuario] = useState<UserData>({
    nombre: 'Asyd G.✧⋆',
    correo: 'asydg1@gmail.com',
    cancionesEscuchadas: 1284,
    artistasSeguidos: 36,
    playlists: 8,
  });

  // ── Estado del modal de edición ─────────────────────────────
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState<UserData>({ ...usuario });

  // ── Estado del modal de logout ───────────────────────────────
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const openEditModal = () => {
    setEditForm({ ...usuario }); // pre-cargar con datos actuales
    setEditModalVisible(true);
  };

  // ── Estado del modal de error de validación ─────────────────
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const saveEdit = () => {
    if (!editForm.nombre.trim() || !editForm.correo.trim()) {
      setErrorModalVisible(true);
      return;
    }
    setUsuario({ ...editForm });
    setEditModalVisible(false);
  };

  // ── Logout con confirmación ──────────────────────────────────
  const handleLogout = () => setLogoutModalVisible(true);

  // ── Artistas / géneros (estáticos) ───────────────────────────
  const artistasFavoritos = [
    { id: '1', nombre: 'The Weeknd',      imagen: 'https://i.pinimg.com/736x/80/e0/3c/80e03c0a7c6ed8a83f09c77a49b70e5e.jpg' },
    { id: '2', nombre: 'OPYI',            imagen: 'https://i.pinimg.com/736x/b7/a0/62/b7a0627eacddc949efa2d52aa5486b87.jpg' },
    { id: '3', nombre: 'Rels B',          imagen: 'https://i.pinimg.com/1200x/dc/e5/01/dce50160eaa721cd44507f9e6e8b21e7.jpg' },
    { id: '4', nombre: 'Charles Ans',     imagen: 'https://i.pinimg.com/736x/fa/6c/5d/fa6c5d722769ad2bfe24643eb36dfadc.jpg' },
    { id: '5', nombre: 'Samantha Barron', imagen: 'https://i.pinimg.com/1200x/f4/b0/c2/f4b0c21857157685233273b8ff1533b1.jpg' },
    { id: '6', nombre: 'Gera MX',         imagen: 'https://i.pinimg.com/736x/59/6b/2a/596b2aa28086534e972c16851ec4dfa2.jpg' },
  ];

  const generosFavoritos = ['Pop', 'Hip-Hop', 'Rap', 'R&B soul'];

  // ── API Monitor ──────────────────────────────────────────────
  const [apiResponse, setApiResponse] = useState<ApiPayload | null>(null);
  const [apiStatus, setApiStatus]     = useState<ApiStatus>('idle');
  const [ping, setPing]               = useState<number | null>(null);
  const [requestCount, setRequestCount] = useState(0);
  const [uptime, setUptime]           = useState(0);
  const [blink, setBlink]             = useState(true);
  const startTime                     = useRef(Date.now());

  useEffect(() => {
    const uptimeTimer = setInterval(() => setUptime(Math.floor((Date.now() - startTime.current) / 1000)), 1000);
    const blinkTimer  = setInterval(() => setBlink((b) => !b), 800);
    return () => { clearInterval(uptimeTimer); clearInterval(blinkTimer); };
  }, []);

  const fetchApi = async () => {
    setApiStatus('loading');
    const t0 = Date.now();
    try {
      const response = await fetch(
        'https://api.github.com/repos/AlfredoRomero444/PROGRAMACION-MOVIL-205',
        { headers: { Accept: 'application/vnd.github.v3+json' } }
      );
      const measuredPing = Date.now() - t0;
      setPing(measuredPing);
      setRequestCount((r) => r + 1);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const payload: ApiPayload = {
        status: 'success', code: response.status,
        endpoint: 'https://api.github.com/repos/AlfredoRomero444/PROGRAMACION-MOVIL-205',
        data: {
          userId: 'asydg_001',
          nombre: usuario.nombre,
          canciones: usuario.cancionesEscuchadas,
          artistas: usuario.artistasSeguidos,
          playlists: usuario.playlists,
          repo: {
            nombre: data.name, estrellas: data.stargazers_count,
            forks: data.forks_count, lenguaje: data.language,
            visibilidad: data.visibility, ultimoCommit: data.pushed_at,
          },
        },
        meta: { ping: `${measuredPing}ms`, requests: requestCount + 1, uptime: `${uptime}s` },
      };
      setApiResponse(payload); setApiStatus('success');
    } catch (error: unknown) {
      setRequestCount((r) => r + 1);
      const msg = error instanceof Error ? error.message : 'Unknown error';
      setApiResponse({
        status: 'error', code: 0, message: msg,
        meta: { ping: ping !== null ? `${ping}ms` : 'N/A', requests: requestCount + 1, uptime: `${uptime}s` },
      });
      setApiStatus('error');
    }
  };

  useEffect(() => { fetchApi(); }, []);

  const badgeLabel = apiStatus === 'loading' ? 'CARGANDO' : apiStatus === 'success' ? 'ACTIVO' : 'ERROR';

  // ── Render ───────────────────────────────────────────────────
  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Portada */}
        <View style={styles.cover}>
          <Image source={require('../../assets/HasleyLuke.jpg')} style={styles.coverImage} resizeMode="cover" />
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Image source={require('../../assets/perfil.jpg')} style={styles.avatar} />
        </View>

        <View style={styles.content}>
          <Text style={styles.nombre}>{usuario.nombre}</Text>
          <Text style={styles.correo}>{usuario.correo}</Text>

          {/* Redes sociales */}
          <View style={styles.socialColumn}>
            {SOCIAL_LINKS.map(({ id, username, url, Icon }) => (
              <TouchableOpacity key={id} style={styles.socialRow} onPress={() => Linking.openURL(url)} activeOpacity={0.7}>
                <View style={styles.socialIconWrap}><Icon size={22} /></View>
                <Text style={styles.socialUsername}>{username}</Text>
                <Text style={styles.socialArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Estadísticas */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumero}>{usuario.cancionesEscuchadas.toLocaleString()}</Text>
              <Text style={styles.statLabel}>canciones</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumero}>{usuario.artistasSeguidos}</Text>
              <Text style={styles.statLabel}>artistas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumero}>{usuario.playlists}</Text>
              <Text style={styles.statLabel}>playlists</Text>
            </View>
          </View>

          {/* Top artistas */}
          <Text style={styles.sectionTitle}>Top artistas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.artistasScroll}>
            {artistasFavoritos.map((artista) => (
              <View key={artista.id} style={styles.artistaItem}>
                <Image source={{ uri: artista.imagen }} style={styles.artistaAvatar} />
                <Text style={styles.artistaNombre} numberOfLines={1}>{artista.nombre}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Géneros */}
          <Text style={styles.sectionTitle}>Géneros favoritos</Text>
          <View style={styles.generosContainer}>
            {generosFavoritos.map((genero) => (
              <View key={genero} style={styles.generoBadge}>
                <Text style={styles.generoText}>{genero}</Text>
              </View>
            ))}
          </View>

          {/* API Monitor */}
          <View style={styles.apiCard}>
            <View style={styles.apiHeader}>
              <View style={styles.apiHeaderLeft}>
                <View style={[styles.apiDot, { opacity: blink ? 1 : 0.2, backgroundColor: apiStatus === 'error' ? '#e24b4a' : '#bf5af2' }]} />
                <Text style={styles.apiTitle}>API STATUS</Text>
              </View>
              <View style={[styles.apiBadge, apiStatus === 'error' && { borderColor: '#e24b4a50', backgroundColor: '#e24b4a20' }]}>
                <Text style={[styles.apiBadgeText, apiStatus === 'error' && { color: '#e24b4a' }]}>{badgeLabel}</Text>
              </View>
            </View>
            <View style={styles.apiMetrics}>
              <View style={styles.apiMetricBox}>
                <Text style={styles.apiMetricValue}>{ping !== null ? `${ping}ms` : '—'}</Text>
                <Text style={styles.apiMetricLabel}>PING</Text>
              </View>
              <View style={styles.apiMetricDivider} />
              <View style={styles.apiMetricBox}>
                <Text style={styles.apiMetricValue}>{requestCount}</Text>
                <Text style={styles.apiMetricLabel}>REQUESTS</Text>
              </View>
              <View style={styles.apiMetricDivider} />
              <View style={styles.apiMetricBox}>
                <Text style={styles.apiMetricValue}>{uptime}s</Text>
                <Text style={styles.apiMetricLabel}>UPTIME</Text>
              </View>
            </View>
            <View style={styles.apiJsonBox}>
              {apiStatus === 'loading' && (
                <View style={styles.apiLoading}>
                  <ActivityIndicator size="small" color="#bf5af2" />
                  <Text style={styles.apiLoadingText}>Fetching endpoint...</Text>
                </View>
              )}
              {(apiStatus === 'success' || apiStatus === 'error') && apiResponse && (
                <>
                  <TouchableOpacity onPress={() => Linking.openURL('https://github.com/AlfredoRomero444/PROGRAMACION-MOVIL-205')}>
                    <Text style={[styles.apiEndpointLine, styles.apiLink]}>{'> '}GET /repos/AlfredoRomero444/PROGRAMACION-MOVIL-205</Text>
                  </TouchableOpacity>
                  <Text style={styles.apiJsonRaw}>{JSON.stringify(apiResponse, null, 2)}</Text>
                </>
              )}
            </View>
            <TouchableOpacity style={[styles.apiRefetchBtn, apiStatus === 'loading' && { opacity: 0.5 }]} onPress={fetchApi} disabled={apiStatus === 'loading'}>
              <Text style={styles.apiRefetchText}>↻  Actualizar</Text>
            </TouchableOpacity>
          </View>

          {/* Opciones */}
          <View style={styles.optionsContainer}>
            {/* ── EDITAR PERFIL ── */}
            <TouchableOpacity style={styles.optionRow} onPress={openEditModal}>
              <Text style={styles.optionText}>Editar perfil</Text>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>

            {/* ── CERRAR SESIÓN ── */}
            <TouchableOpacity style={[styles.optionRow, styles.logoutRow]} onPress={handleLogout}>
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ══════════════════════════════════════════════════════════
          MODAL — Editar perfil
      ══════════════════════════════════════════════════════════ */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalSheet}>
            {/* Handle */}
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Editar perfil</Text>

            {/* Campo: Nombre */}
            <Text style={styles.fieldLabel}>Nombre</Text>
            <TextInput
              style={styles.fieldInput}
              value={editForm.nombre}
              onChangeText={(t) => setEditForm((f) => ({ ...f, nombre: t }))}
              placeholderTextColor="#8e8e93"
              selectionColor="#bf5af2"
            />

            {/* Campo: Correo */}
            <Text style={styles.fieldLabel}>Correo electrónico</Text>
            <TextInput
              style={styles.fieldInput}
              value={editForm.correo}
              onChangeText={(t) => setEditForm((f) => ({ ...f, correo: t }))}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#8e8e93"
              selectionColor="#bf5af2"
            />

            {/* Campo: Canciones */}
            <Text style={styles.fieldLabel}>Canciones escuchadas</Text>
            <TextInput
              style={styles.fieldInput}
              value={String(editForm.cancionesEscuchadas)}
              onChangeText={(t) => setEditForm((f) => ({ ...f, cancionesEscuchadas: Number(t) || 0 }))}
              keyboardType="numeric"
              placeholderTextColor="#8e8e93"
              selectionColor="#bf5af2"
            />

            {/* Campo: Artistas */}
            <Text style={styles.fieldLabel}>Artistas seguidos</Text>
            <TextInput
              style={styles.fieldInput}
              value={String(editForm.artistasSeguidos)}
              onChangeText={(t) => setEditForm((f) => ({ ...f, artistasSeguidos: Number(t) || 0 }))}
              keyboardType="numeric"
              placeholderTextColor="#8e8e93"
              selectionColor="#bf5af2"
            />

            {/* Campo: Playlists */}
            <Text style={styles.fieldLabel}>Playlists</Text>
            <TextInput
              style={styles.fieldInput}
              value={String(editForm.playlists)}
              onChangeText={(t) => setEditForm((f) => ({ ...f, playlists: Number(t) || 0 }))}
              keyboardType="numeric"
              placeholderTextColor="#8e8e93"
              selectionColor="#bf5af2"
            />

            {/* Botones */}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                <Text style={styles.saveBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ══════════════════════════════════════════════════════════
          MODAL — Confirmar cerrar sesión
      ══════════════════════════════════════════════════════════ */}
      <Modal
        visible={logoutModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.logoutOverlay}>
          <View style={styles.logoutDialog}>
            {/* Ícono decorativo — SVG power button */}
            <View style={styles.logoutIconWrap}>
              <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 3v9"
                  stroke="#e24b4a"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                />
                <Path
                  d="M6.34 6.34A9 9 0 1 0 17.66 6.34"
                  stroke="#e24b4a"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                />
              </Svg>
            </View>

            <Text style={styles.logoutDialogTitle}>Cerrar sesión</Text>
            <Text style={styles.logoutDialogSubtitle}>
              ¿Seguro que quieres salir?{'\n'}Tendrás que volver a iniciar sesión.
            </Text>

            {/* Divisor */}
            <View style={styles.logoutDivider} />

            {/* Botones */}
            <View style={styles.logoutButtons}>
              <TouchableOpacity
                style={styles.logoutCancelBtn}
                onPress={() => setLogoutModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.logoutCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <View style={styles.logoutBtnDivider} />

              <TouchableOpacity
                style={styles.logoutConfirmBtn}
                onPress={() => { setLogoutModalVisible(false); onLogout(); }}
                activeOpacity={0.7}
              >
                <Text style={styles.logoutConfirmText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ══════════════════════════════════════════════════════════
          MODAL — Error de validación
      ══════════════════════════════════════════════════════════ */}
      <Modal
        visible={errorModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={styles.logoutOverlay}>
          <View style={styles.logoutDialog}>
            <View style={[styles.logoutIconWrap, { backgroundColor: '#bf5af218', borderColor: '#bf5af240' }]}>
              <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 8v5"
                  stroke="#bf5af2"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                />
                <Path
                  d="M12 16.5v.5"
                  stroke="#bf5af2"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              </Svg>
            </View>

            <Text style={styles.logoutDialogTitle}>Campos requeridos</Text>
            <Text style={styles.logoutDialogSubtitle}>
              El nombre y el correo{'\n'}no pueden estar vacíos.
            </Text>

            <View style={styles.logoutDivider} />

            <TouchableOpacity
              style={{ width: '100%', paddingVertical: 16, alignItems: 'center' }}
              onPress={() => setErrorModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={{ color: '#bf5af2', fontSize: 14, fontWeight: '700' }}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const AVATAR_SIZE = 84;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090912' },

  cover: { height: 150, overflow: 'hidden' },
  coverImage: { width: '100%', height: '100%' },

  settingsButton: {
    position: 'absolute', top: 14, right: 16,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#ffffff20', alignItems: 'center', justifyContent: 'center',
  },
  settingsIcon: { color: '#fff', fontSize: 16 },

  avatarWrapper: { marginTop: -AVATAR_SIZE / 2, paddingLeft: 20 },
  avatar: {
    width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2,
    borderWidth: 3, borderColor: '#090912',
  },

  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },

  nombre: { color: '#fff', fontSize: 19, fontWeight: '700', fontFamily: 'monospace' },
  correo: { color: '#8e8e93', fontSize: 13, marginTop: 2, marginBottom: 14 },

  socialColumn: {
    marginBottom: 20, borderRadius: 12, overflow: 'hidden',
    borderWidth: 1, borderColor: '#ffffff10', backgroundColor: '#0e0b1a',
  },
  socialRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 11,
    borderBottomWidth: 0.5, borderColor: '#ffffff10', gap: 12,
  },
  socialIconWrap: {
    width: 34, height: 34, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff08',
  },
  socialUsername: { flex: 1, color: '#d3d1c7', fontSize: 13, fontWeight: '500' },
  socialArrow: { color: '#8e8e93', fontSize: 18 },

  statsRow: {
    flexDirection: 'row', paddingVertical: 14,
    borderTopWidth: 0.5, borderBottomWidth: 0.5,
    borderColor: '#ffffff1a', marginBottom: 22,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 0.5, backgroundColor: '#ffffff1a' },
  statNumero: { color: '#fff', fontSize: 17, fontWeight: '700' },
  statLabel: { color: '#8e8e93', fontSize: 11, marginTop: 3 },

  sectionTitle: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 10 },

  artistasScroll: { gap: 14, paddingBottom: 22 },
  artistaItem: { width: 64, alignItems: 'center' },
  artistaAvatar: { width: 56, height: 56, borderRadius: 28, marginBottom: 6, backgroundColor: '#1a1a2e' },
  artistaNombre: { color: '#d3d1c7', fontSize: 11, textAlign: 'center' },

  generosContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  generoBadge: { backgroundColor: '#bf5af226', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  generoText: { color: '#d4a8f5', fontSize: 12, fontWeight: '600' },

  optionsContainer: { marginTop: 14 },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderTopWidth: 0.5, borderColor: '#ffffff1a',
  },
  optionText: { color: '#fff', fontSize: 14 },
  optionArrow: { color: '#8e8e93', fontSize: 18 },
  logoutRow: { paddingBottom: 4 },
  logoutText: { color: '#e24b4a', fontSize: 14 },

  // API Monitor
  apiCard: {
    marginTop: 28, backgroundColor: '#0e0b1a', borderRadius: 14,
    borderWidth: 1, borderColor: '#bf5af230', overflow: 'hidden',
  },
  apiHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, borderColor: '#bf5af220', backgroundColor: '#160d26',
  },
  apiHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  apiDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#bf5af2' },
  apiTitle: { color: '#bf5af2', fontSize: 11, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 2 },
  apiBadge: {
    backgroundColor: '#bf5af220', paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 20, borderWidth: 1, borderColor: '#bf5af250',
  },
  apiBadgeText: { color: '#d4a8f5', fontSize: 10, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 1 },
  apiMetrics: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#bf5af215' },
  apiMetricBox: { flex: 1, alignItems: 'center' },
  apiMetricDivider: { width: 1, backgroundColor: '#bf5af220' },
  apiMetricValue: { color: '#d4a8f5', fontSize: 16, fontWeight: '700', fontFamily: 'monospace' },
  apiMetricLabel: { color: '#7a5a99', fontSize: 9, fontFamily: 'monospace', letterSpacing: 1, marginTop: 2 },
  apiJsonBox: { padding: 14, backgroundColor: '#0a0714', borderBottomWidth: 1, borderColor: '#bf5af215' },
  apiLoading: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  apiLoadingText: { color: '#7a5a99', fontSize: 11, fontFamily: 'monospace' },
  apiEndpointLine: { fontSize: 10, fontFamily: 'monospace', color: '#7a5a99', marginBottom: 10 },
  apiJsonRaw: { color: '#a8d8a8', fontSize: 10, fontFamily: 'monospace', lineHeight: 16 },
  apiLink: { textDecorationLine: 'underline', color: '#bf5af2' },
  apiRefetchBtn: { paddingVertical: 11, alignItems: 'center', backgroundColor: '#160d26' },
  apiRefetchText: { color: '#bf5af2', fontSize: 12, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 1 },

  // ── Modal ─────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#000000aa',
  },
  modalSheet: {
    backgroundColor: '#0e0b1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderColor: '#bf5af230',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#ffffff30', alignSelf: 'center', marginBottom: 18,
  },
  modalTitle: {
    color: '#fff', fontSize: 17, fontWeight: '700',
    fontFamily: 'monospace', marginBottom: 20,
  },
  fieldLabel: {
    color: '#8e8e93', fontSize: 11,
    fontFamily: 'monospace', letterSpacing: 1,
    marginBottom: 4, textTransform: 'uppercase',
  },
  fieldInput: {
    backgroundColor: '#151525',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#bf5af230',
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row', gap: 12, marginTop: 6,
  },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1, borderColor: '#ffffff20',
    alignItems: 'center',
  },
  cancelBtnText: { color: '#8e8e93', fontSize: 14, fontWeight: '600' },
  saveBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: '#bf5af2', alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  // ── Modal logout ──────────────────────────────────────────────
  logoutOverlay: {
    flex: 1,
    backgroundColor: '#000000b0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoutDialog: {
    width: '100%',
    backgroundColor: '#0e0b1a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bf5af230',
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: 28,
  },
  logoutIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e24b4a18',
    borderWidth: 1,
    borderColor: '#e24b4a40',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  logoutDialogTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  logoutDialogSubtitle: {
    color: '#8e8e93',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  logoutDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ffffff10',
  },
  logoutButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  logoutBtnDivider: {
    width: 1,
    backgroundColor: '#ffffff10',
  },
  logoutCancelBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutCancelText: {
    color: '#8e8e93',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutConfirmBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutConfirmText: {
    color: '#e24b4a',
    fontSize: 14,
    fontWeight: '700',
  },
});