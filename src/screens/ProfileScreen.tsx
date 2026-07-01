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
import { useTheme } from '../context/ThemeContext';
import { Svg, Path, Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';
import { Pencil, LogOut } from 'lucide-react-native';
import { glowCard, glowCircle } from '../utils/glow';

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
  </Svg>
);

const SOCIAL_LINKS = [
  { id: 'instagram', username: '@asyd.g1',        url: 'https://www.instagram.com/asyd.g1?igsh=ZG92M2V0NXlsN2du', Icon: InstagramIcon },
  { id: 'facebook',  username: 'Asyd Gaze',        url: 'https://www.facebook.com/share/1Ggccb14Jk/',              Icon: FacebookIcon  },
  { id: 'tiktok',    username: '@asyd.g1',          url: 'https://www.tiktok.com/@asyd.g1',                         Icon: TikTokIcon    },
  { id: 'github',    username: 'AlfredoRomero444',  url: 'https://github.com/AlfredoRomero444',                     Icon: GitHubIcon    },
];

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const { colors, theme, toggleTheme } = useTheme();

  const [usuario, setUsuario] = useState<UserData>({
    nombre: 'Asyd G.✧⋆',
    correo: 'asydg1@gmail.com',
    cancionesEscuchadas: 1284,
    artistasSeguidos: 36,
    playlists: 8,
  });

  const [editModalVisible,  setEditModalVisible]  = useState(false);
  const [editForm,          setEditForm]           = useState<UserData>({ ...usuario });
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [errorModalVisible,  setErrorModalVisible]  = useState(false);

  const openEditModal = () => { setEditForm({ ...usuario }); setEditModalVisible(true); };
  const saveEdit = () => {
    if (!editForm.nombre.trim() || !editForm.correo.trim()) { setErrorModalVisible(true); return; }
    setUsuario({ ...editForm });
    setEditModalVisible(false);
  };
  const handleLogout = () => setLogoutModalVisible(true);

  const artistasFavoritos = [
    { id: '1', nombre: 'The Weeknd',      imagen: 'https://i.pinimg.com/736x/80/e0/3c/80e03c0a7c6ed8a83f09c77a49b70e5e.jpg' },
    { id: '2', nombre: 'OPYI',            imagen: 'https://i.pinimg.com/736x/b7/a0/62/b7a0627eacddc949efa2d52aa5486b87.jpg' },
    { id: '3', nombre: 'Rels B',          imagen: 'https://i.pinimg.com/1200x/dc/e5/01/dce50160eaa721cd44507f9e6e8b21e7.jpg' },
    { id: '4', nombre: 'Charles Ans',     imagen: 'https://i.pinimg.com/736x/fa/6c/5d/fa6c5d722769ad2bfe24643eb36dfadc.jpg' },
    { id: '5', nombre: 'Samantha Barron', imagen: 'https://i.pinimg.com/1200x/f4/b0/c2/f4b0c21857157685233273b8ff1533b1.jpg' },
    { id: '6', nombre: 'Gera MX',         imagen: 'https://i.pinimg.com/736x/59/6b/2a/596b2aa28086534e972c16851ec4dfa2.jpg' },
  ];
  const generosFavoritos = ['Pop', 'Hip-Hop', 'Rap', 'R&B soul'];

  // API Monitor
  const [apiResponse, setApiResponse] = useState<ApiPayload | null>(null);
  const [apiStatus,   setApiStatus]   = useState<ApiStatus>('idle');
  const [ping,        setPing]        = useState<number | null>(null);
  const [requestCount, setRequestCount] = useState(0);
  const [uptime,      setUptime]      = useState(0);
  const [blink,       setBlink]       = useState(true);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const uptimeTimer = setInterval(() => setUptime(Math.floor((Date.now() - startTime.current) / 1000)), 1000);
    const blinkTimer  = setInterval(() => setBlink(b => !b), 800);
    return () => { clearInterval(uptimeTimer); clearInterval(blinkTimer); };
  }, []);

  const fetchApi = async () => {
    setApiStatus('loading');
    const t0 = Date.now();
    try {
      const response = await fetch('https://api.github.com/repos/AlfredoRomero444/PROGRAMACION-MOVIL-205', {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });
      const measuredPing = Date.now() - t0;
      setPing(measuredPing);
      setRequestCount(r => r + 1);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setApiResponse({
        status: 'success', code: response.status,
        endpoint: 'https://api.github.com/repos/AlfredoRomero444/PROGRAMACION-MOVIL-205',
        data: {
          userId: 'asydg_001', nombre: usuario.nombre,
          canciones: usuario.cancionesEscuchadas, artistas: usuario.artistasSeguidos, playlists: usuario.playlists,
          repo: { nombre: data.name, estrellas: data.stargazers_count, forks: data.forks_count, lenguaje: data.language, visibilidad: data.visibility, ultimoCommit: data.pushed_at },
        },
        meta: { ping: `${measuredPing}ms`, requests: requestCount + 1, uptime: `${uptime}s` },
      });
      setApiStatus('success');
    } catch (error: unknown) {
      setRequestCount(r => r + 1);
      const msg = error instanceof Error ? error.message : 'Unknown error';
      setApiResponse({ status: 'error', code: 0, message: msg, meta: { ping: ping !== null ? `${ping}ms` : 'N/A', requests: requestCount + 1, uptime: `${uptime}s` } });
      setApiStatus('error');
    }
  };

  useEffect(() => { fetchApi(); }, []);

  const badgeLabel = apiStatus === 'loading' ? 'CARGANDO' : apiStatus === 'success' ? 'ACTIVO' : 'ERROR';
  const isDark = theme === 'dark';

  // ── Render ───────────────────────────────────────────────────
  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} showsVerticalScrollIndicator={false}>

        {/* Portada */}
        <View style={styles.cover}>
          <Image source={require('../../assets/HasleyLuke.jpg')} style={styles.coverImage} resizeMode="cover" />

          {/* ── Botón toggle de tema con fondo sólido siempre visible ── */}
          <TouchableOpacity
            style={styles.themeButton}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            {/* Fondo sólido garantizado: blanco semi-opaco en modo oscuro, oscuro en modo claro */}
            <View style={[
              styles.themeButtonInner,
              isDark
                ? { backgroundColor: '#2a160d', borderColor: '#fec3b1' }
                : { backgroundColor: '#ffffff', borderColor: '#fec3b1' },
            ]}>
              <Text style={[styles.themeSymbol, { color: colors.accent }]}>
                .✧⋆
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={[styles.avatarWrapper, { borderColor: colors.bg }]}>
          <View
            style={[
              styles.avatarRing,
              { backgroundColor: colors.accent },
              glowCircle(colors.accent, { opacity: 0.5, radius: 14, elevation: 10 }),
            ]}
          >
            <Image source={require('../../assets/perfil.jpg')} style={[styles.avatar, { borderColor: colors.bg }]} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.nombre, { color: colors.textPrimary }]}>{usuario.nombre}</Text>
          <Text style={[styles.correo, { color: colors.textSecondary }]}>{usuario.correo}</Text>

          {/* Redes sociales */}
          <View
            style={[
              styles.socialColumn,
              { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
              glowCard(colors.accent, { opacity: 0.1, radius: 10, elevation: 3 }),
            ]}
          >
            {SOCIAL_LINKS.map(({ id, username, url, Icon }) => (
              <TouchableOpacity key={id} style={[styles.socialRow, { borderColor: colors.border }]} onPress={() => Linking.openURL(url)} activeOpacity={0.7}>
                <View style={[styles.socialIconWrap, { backgroundColor: colors.border }]}><Icon size={22} /></View>
                <Text style={[styles.socialUsername, { color: colors.textPrimary }]}>{username}</Text>
                <Text style={[styles.socialArrow, { color: colors.textSecondary }]}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Estadísticas */}
          <View
            style={[
              styles.statsRow,
              { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
              glowCard(colors.accent, { opacity: 0.1, radius: 10, elevation: 3 }),
            ]}
          >
            <View style={styles.statBox}>
              <Text style={[styles.statNumero, { color: colors.textPrimary }]}>{usuario.cancionesEscuchadas.toLocaleString()}</Text>
              <Text style={[styles.statLabel,  { color: colors.textSecondary }]}>canciones</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.borderMid }]} />
            <View style={styles.statBox}>
              <Text style={[styles.statNumero, { color: colors.textPrimary }]}>{usuario.artistasSeguidos}</Text>
              <Text style={[styles.statLabel,  { color: colors.textSecondary }]}>artistas</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.borderMid }]} />
            <View style={styles.statBox}>
              <Text style={[styles.statNumero, { color: colors.textPrimary }]}>{usuario.playlists}</Text>
              <Text style={[styles.statLabel,  { color: colors.textSecondary }]}>playlists</Text>
            </View>
          </View>

          {/* Top artistas */}
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Top artistas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.artistasScroll}>
            {artistasFavoritos.map(artista => (
              <View key={artista.id} style={styles.artistaItem}>
                <Image source={{ uri: artista.imagen }} style={styles.artistaAvatar} />
                <Text style={[styles.artistaNombre, { color: colors.textSecondary }]} numberOfLines={1}>{artista.nombre}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Géneros */}
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Géneros favoritos</Text>
          <View style={styles.generosContainer}>
            {generosFavoritos.map(genero => (
              <View key={genero} style={[styles.generoBadge, { backgroundColor: colors.accentFaint }]}>
                <Text style={[styles.generoText, { color: colors.accentLight }]}>{genero}</Text>
              </View>
            ))}
          </View>

          {/* API Monitor */}
          <View
            style={[
              styles.apiCard,
              { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
              glowCard(colors.accent, { opacity: 0.1, radius: 10, elevation: 3 }),
            ]}
          >
            <View style={[styles.apiHeader, { borderColor: colors.accentBorder, backgroundColor: isDark ? '#2a160d' : '#fdf0ea' }]}>
              <View style={styles.apiHeaderLeft}>
                <View style={[styles.apiDot, { opacity: blink ? 1 : 0.2, backgroundColor: apiStatus === 'error' ? '#e24b4a' : colors.accent }]} />
                <Text style={[styles.apiTitle, { color: colors.accent }]}>API STATUS</Text>
              </View>
              <View style={[styles.apiBadge, { backgroundColor: colors.accentFaint, borderColor: colors.accentBorder }, apiStatus === 'error' && { borderColor: '#e24b4a50', backgroundColor: '#e24b4a20' }]}>
                <Text style={[styles.apiBadgeText, { color: colors.accentLight }, apiStatus === 'error' && { color: '#e24b4a' }]}>{badgeLabel}</Text>
              </View>
            </View>
            <View style={[styles.apiMetrics, { borderColor: colors.accentBorder }]}>
              <View style={styles.apiMetricBox}>
                <Text style={[styles.apiMetricValue, { color: colors.accentLight }]}>{ping !== null ? `${ping}ms` : '—'}</Text>
                <Text style={[styles.apiMetricLabel, { color: colors.textMuted }]}>PING</Text>
              </View>
              <View style={[styles.apiMetricDivider, { backgroundColor: colors.accentBorder }]} />
              <View style={styles.apiMetricBox}>
                <Text style={[styles.apiMetricValue, { color: colors.accentLight }]}>{requestCount}</Text>
                <Text style={[styles.apiMetricLabel, { color: colors.textMuted }]}>REQUESTS</Text>
              </View>
              <View style={[styles.apiMetricDivider, { backgroundColor: colors.accentBorder }]} />
              <View style={styles.apiMetricBox}>
                <Text style={[styles.apiMetricValue, { color: colors.accentLight }]}>{uptime}s</Text>
                <Text style={[styles.apiMetricLabel, { color: colors.textMuted }]}>UPTIME</Text>
              </View>
            </View>
            <View style={[styles.apiJsonBox, { backgroundColor: isDark ? '#190d08' : '#fffaf6' }]}>
              {apiStatus === 'loading' && (
                <View style={styles.apiLoading}>
                  <ActivityIndicator size="small" color={colors.accent} />
                  <Text style={[styles.apiLoadingText, { color: colors.textMuted }]}>Fetching endpoint...</Text>
                </View>
              )}
              {(apiStatus === 'success' || apiStatus === 'error') && apiResponse && (
                <>
                  <TouchableOpacity onPress={() => Linking.openURL('https://github.com/AlfredoRomero444/PROGRAMACION-MOVIL-205')}>
                    <Text style={[styles.apiEndpointLine, { color: colors.accent }, styles.apiLink]}>{'> '}GET /repos/AlfredoRomero444/PROGRAMACION-MOVIL-205</Text>
                  </TouchableOpacity>
                  <Text style={[styles.apiJsonRaw, { color: isDark ? '#a8d8a8' : '#2d6a2d' }]}>{JSON.stringify(apiResponse, null, 2)}</Text>
                </>
              )}
            </View>
            <TouchableOpacity
              style={[styles.apiRefetchBtn, { backgroundColor: isDark ? '#2a160d' : '#fdf0ea' }, apiStatus === 'loading' && { opacity: 0.5 }]}
              onPress={fetchApi}
              disabled={apiStatus === 'loading'}
            >
              <Text style={[styles.apiRefetchText, { color: colors.accent }]}>↻  Actualizar</Text>
            </TouchableOpacity>
          </View>

          {/* Opciones */}
          <View
            style={[
              styles.optionsContainer,
              { backgroundColor: colors.bgCard, borderColor: colors.accentBorder },
              glowCard(colors.accent, { opacity: 0.1, radius: 10, elevation: 3 }),
            ]}
          >
            <TouchableOpacity style={[styles.optionRow, { borderColor: colors.borderMid }]} onPress={openEditModal} activeOpacity={0.7}>
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.optionIconWrap,
                    { backgroundColor: colors.accentFaint, borderColor: colors.accentBorder },
                    glowCircle(colors.accent, { opacity: 0.3, radius: 8 }),
                  ]}
                >
                  <Pencil color={colors.accent} size={16} strokeWidth={2} />
                </View>
                <Text style={[styles.optionText, { color: colors.textPrimary }]}>Editar perfil</Text>
              </View>
              <Text style={[styles.optionArrow, { color: colors.textSecondary }]}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionRow, styles.logoutRow]} onPress={handleLogout} activeOpacity={0.7}>
              <View style={styles.optionLeft}>
                <View style={[styles.optionIconWrap, { backgroundColor: '#e24b4a18', borderColor: '#e24b4a40' }]}>
                  <LogOut color="#e24b4a" size={16} strokeWidth={2} />
                </View>
                <Text style={styles.logoutText}>Cerrar sesión</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal — Editar perfil */}
      <Modal visible={editModalVisible} animationType="slide" transparent onRequestClose={() => setEditModalVisible(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.modalSheet, { backgroundColor: colors.bgDeep, borderColor: colors.accentBorder }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Editar perfil</Text>

            {(['nombre', 'correo'] as const).map(field => (
              <View key={field}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{field === 'nombre' ? 'Nombre' : 'Correo electrónico'}</Text>
                <TextInput
                  style={[styles.fieldInput, { backgroundColor: colors.bgInput, color: colors.textPrimary, borderColor: colors.accentBorder }]}
                  value={editForm[field]}
                  onChangeText={t => setEditForm(f => ({ ...f, [field]: t }))}
                  keyboardType={field === 'correo' ? 'email-address' : 'default'}
                  autoCapitalize={field === 'correo' ? 'none' : 'words'}
                  placeholderTextColor={colors.textMuted}
                  selectionColor={colors.accent}
                />
              </View>
            ))}

            {[
              { key: 'cancionesEscuchadas', label: 'Canciones escuchadas' },
              { key: 'artistasSeguidos',    label: 'Artistas seguidos' },
              { key: 'playlists',           label: 'Playlists' },
            ].map(({ key, label }) => (
              <View key={key}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
                <TextInput
                  style={[styles.fieldInput, { backgroundColor: colors.bgInput, color: colors.textPrimary, borderColor: colors.accentBorder }]}
                  value={String(editForm[key as keyof UserData])}
                  onChangeText={t => setEditForm(f => ({ ...f, [key]: Number(t) || 0 }))}
                  keyboardType="numeric"
                  placeholderTextColor={colors.textMuted}
                  selectionColor={colors.accent}
                />
              </View>
            ))}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={() => setEditModalVisible(false)}>
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.accent }]} onPress={saveEdit}>
                <Text style={styles.saveBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal — Cerrar sesión */}
      <Modal visible={logoutModalVisible} animationType="fade" transparent onRequestClose={() => setLogoutModalVisible(false)}>
        <View style={styles.logoutOverlay}>
          <View style={[styles.logoutDialog, { backgroundColor: colors.bgDeep, borderColor: colors.accentBorder }]}>
            <View style={styles.logoutIconWrap}>
              <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                <Path d="M12 3v9" stroke="#e24b4a" strokeWidth={2.2} strokeLinecap="round" />
                <Path d="M6.34 6.34A9 9 0 1 0 17.66 6.34" stroke="#e24b4a" strokeWidth={2.2} strokeLinecap="round" />
              </Svg>
            </View>
            <Text style={[styles.logoutDialogTitle,    { color: colors.textPrimary }]}>Cerrar sesión</Text>
            <Text style={[styles.logoutDialogSubtitle, { color: colors.textSecondary }]}>¿Seguro que quieres salir?{'\n'}Tendrás que volver a iniciar sesión.</Text>
            <View style={[styles.logoutDivider, { backgroundColor: colors.border }]} />
            <View style={styles.logoutButtons}>
              <TouchableOpacity style={styles.logoutCancelBtn} onPress={() => setLogoutModalVisible(false)} activeOpacity={0.7}>
                <Text style={[styles.logoutCancelText, { color: colors.textSecondary }]}>Cancelar</Text>
              </TouchableOpacity>
              <View style={[styles.logoutBtnDivider, { backgroundColor: colors.border }]} />
              <TouchableOpacity style={styles.logoutConfirmBtn} onPress={() => { setLogoutModalVisible(false); onLogout(); }} activeOpacity={0.7}>
                <Text style={styles.logoutConfirmText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal — Error validación */}
      <Modal visible={errorModalVisible} animationType="fade" transparent onRequestClose={() => setErrorModalVisible(false)}>
        <View style={styles.logoutOverlay}>
          <View style={[styles.logoutDialog, { backgroundColor: colors.bgDeep, borderColor: colors.accentBorder }]}>
            <View style={[styles.logoutIconWrap, { backgroundColor: colors.accentFaint, borderColor: colors.accentBorder }]}>
              <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                <Path d="M12 8v5" stroke="#fec3b1" strokeWidth={2.2} strokeLinecap="round" />
                <Path d="M12 16.5v.5" stroke="#fec3b1" strokeWidth={2.5} strokeLinecap="round" />
              </Svg>
            </View>
            <Text style={[styles.logoutDialogTitle,    { color: colors.textPrimary }]}>Campos requeridos</Text>
            <Text style={[styles.logoutDialogSubtitle, { color: colors.textSecondary }]}>El nombre y el correo{'\n'}no pueden estar vacíos.</Text>
            <View style={[styles.logoutDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={{ width: '100%', paddingVertical: 16, alignItems: 'center' }} onPress={() => setErrorModalVisible(false)} activeOpacity={0.7}>
              <Text style={{ color: colors.accent, fontSize: 14, fontWeight: '700' }}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const AVATAR_SIZE = 84;

const styles = StyleSheet.create({
  container:    { flex: 1 },
  cover:        { height: 150, overflow: 'hidden' },
  coverImage:   { width: '100%', height: '100%' },

  // ── Botón de tema: posicionado absolutamente sobre la portada ──
  themeButton: {
    position: 'absolute',
    top: 14,
    right: 16,
    // Sin fondo aquí — el inner lo maneja
  },
  themeButtonInner: {
    width: 44,
    height: 38,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    // Sombra para que resalte sobre cualquier imagen
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 6,
  },
  themeSymbol: {
    fontSize: 18,
    fontWeight: '400',
  },

  avatarWrapper: { marginTop: -AVATAR_SIZE / 2, paddingLeft: 20 },
  avatarRing: { width: AVATAR_SIZE + 6, height: AVATAR_SIZE + 6, borderRadius: (AVATAR_SIZE + 6) / 2, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2, borderWidth: 3 },

  content:      { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40 },
  nombre:       { fontSize: 19, fontWeight: '700', fontFamily: 'monospace' },
  correo:       { fontSize: 13, marginTop: 2, marginBottom: 14 },

  socialColumn: { marginBottom: 20, borderRadius: 22, overflow: 'hidden', borderWidth: 1 },
  socialRow:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 0.5, gap: 12 },
  socialIconWrap: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  socialUsername: { flex: 1, fontSize: 13, fontWeight: '500' },
  socialArrow:  { fontSize: 18 },

  statsRow:     { flexDirection: 'row', paddingVertical: 16, borderRadius: 22, borderWidth: 1, marginBottom: 22 },
  statBox:      { flex: 1, alignItems: 'center' },
  statDivider:  { width: 0.5 },
  statNumero:   { fontSize: 17, fontWeight: '700' },
  statLabel:    { fontSize: 11, marginTop: 3 },

  sectionTitle: { fontSize: 13, fontWeight: '700', marginBottom: 10 },

  artistasScroll: { gap: 14, paddingBottom: 22 },
  artistaItem:    { width: 64, alignItems: 'center' },
  artistaAvatar:  { width: 56, height: 56, borderRadius: 28, marginBottom: 6 },
  artistaNombre:  { fontSize: 11, textAlign: 'center' },

  generosContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  generoBadge:      { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  generoText:       { fontSize: 12, fontWeight: '600' },

  optionsContainer: { marginTop: 14, borderRadius: 22, borderWidth: 1, paddingHorizontal: 16, overflow: 'hidden' },
  optionRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderTopWidth: 0.5 },
  optionLeft:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionIconWrap:   { width: 34, height: 34, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  optionText:       { fontSize: 14, fontWeight: '600' },
  optionArrow:      { fontSize: 18 },
  logoutRow:        { paddingBottom: 14, borderTopWidth: 0.5, borderColor: '#e24b4a20' },
  logoutText:       { color: '#e24b4a', fontSize: 14, fontWeight: '600' },

  apiCard:          { marginTop: 28, borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  apiHeader:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
  apiHeaderLeft:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  apiDot:           { width: 8, height: 8, borderRadius: 4 },
  apiTitle:         { fontSize: 11, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 2 },
  apiBadge:         { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  apiBadgeText:     { fontSize: 10, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 1 },
  apiMetrics:       { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1 },
  apiMetricBox:     { flex: 1, alignItems: 'center' },
  apiMetricDivider: { width: 1 },
  apiMetricValue:   { fontSize: 16, fontWeight: '700', fontFamily: 'monospace' },
  apiMetricLabel:   { fontSize: 9, fontFamily: 'monospace', letterSpacing: 1, marginTop: 2 },
  apiJsonBox:       { padding: 14, borderBottomWidth: 1, borderColor: '#fec3b115' },
  apiLoading:       { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  apiLoadingText:   { fontSize: 11, fontFamily: 'monospace' },
  apiEndpointLine:  { fontSize: 10, fontFamily: 'monospace', marginBottom: 10 },
  apiJsonRaw:       { fontSize: 10, fontFamily: 'monospace', lineHeight: 16 },
  apiLink:          { textDecorationLine: 'underline' },
  apiRefetchBtn:    { paddingVertical: 11, alignItems: 'center' },
  apiRefetchText:   { fontSize: 12, fontWeight: '700', fontFamily: 'monospace', letterSpacing: 1 },

  modalOverlay:  { flex: 1, justifyContent: 'flex-end', backgroundColor: '#000000aa' },
  modalSheet:    { borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 36, borderTopWidth: 1 },
  modalHandle:   { width: 40, height: 4, borderRadius: 2, backgroundColor: '#ffffff30', alignSelf: 'center', marginBottom: 18 },
  modalTitle:    { fontSize: 17, fontWeight: '700', fontFamily: 'monospace', marginBottom: 20 },
  fieldLabel:    { fontSize: 11, fontFamily: 'monospace', letterSpacing: 1, marginBottom: 4, textTransform: 'uppercase' },
  fieldInput:    { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 14, borderWidth: 1, fontSize: 14 },
  modalButtons:  { flexDirection: 'row', gap: 12, marginTop: 6 },
  cancelBtn:     { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontWeight: '600' },
  saveBtn:       { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  saveBtnText:   { color: '#fff', fontSize: 14, fontWeight: '700' },

  logoutOverlay:        { flex: 1, backgroundColor: '#000000b0', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  logoutDialog:         { width: '100%', borderRadius: 20, borderWidth: 1, overflow: 'hidden', alignItems: 'center', paddingTop: 28 },
  logoutIconWrap:       { width: 52, height: 52, borderRadius: 26, backgroundColor: '#e24b4a18', borderWidth: 1, borderColor: '#e24b4a40', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoutDialogTitle:    { fontSize: 17, fontWeight: '700', fontFamily: 'monospace', marginBottom: 8 },
  logoutDialogSubtitle: { fontSize: 13, textAlign: 'center', lineHeight: 20, paddingHorizontal: 12, marginBottom: 24 },
  logoutDivider:        { width: '100%', height: 1 },
  logoutButtons:        { flexDirection: 'row', width: '100%' },
  logoutBtnDivider:     { width: 1 },
  logoutCancelBtn:      { flex: 1, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  logoutCancelText:     { fontSize: 14, fontWeight: '600' },
  logoutConfirmBtn:     { flex: 1, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  logoutConfirmText:    { color: '#e24b4a', fontSize: 14, fontWeight: '700' },
});