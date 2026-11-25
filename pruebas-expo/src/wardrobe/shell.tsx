import React from 'react';
import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, IconName, Label, palette, s } from './ui';
import { useWardrobe } from './store';
import { Overlays } from './overlays';

const navigation = [
  { title: 'Mi armario', short: 'Armario', href: '/' as const, icon: 'hanger' as IconName },
  { title: 'Mis conjuntos', short: 'Conjuntos', href: '/outfits' as const, icon: 'grid' as IconName },
  { title: 'Armarios amigos', short: 'Amigos', href: '/community' as const, icon: 'users' as IconName },
  { title: 'Mi perfil', short: 'Perfil', href: '/profile' as const, icon: 'user' as IconName },
];
export function AppShell({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const desktop = width >= 1000;
  const path = usePathname();
  const inset = useSafeAreaInsets();
  const { profile, garments, query, setQuery, onlyFavorites, setOnlyFavorites, setOverlay, toast } = useWardrobe();
  function nav(href: typeof navigation[number]['href']) { setOnlyFavorites(false); router.push(href); }
  return <View style={[styles.app, { paddingTop: inset.top }]}>
    {desktop && <View style={styles.sidebar}>
      <View style={[s.row, { gap: 11, paddingHorizontal: 14, marginBottom: 49 }]}><View style={styles.logo}><Icon name="hanger" color="#fff" size={24} /></View><View><Label serif style={{ fontSize: 29, letterSpacing: -1 }}>cyl.</Label><Label style={{ fontSize: 8, letterSpacing: 1.4, color: palette.muted }}>CLOSET YOUR LIFE</Label></View></View>
      <Label style={[s.eyebrow, { paddingHorizontal: 16, color: '#A1A494', fontSize: 9, marginBottom: 15 }]}>TU ESPACIO</Label>
      {navigation.slice(0, 3).map(item => <Pressable key={item.href} accessibilityRole="button" onPress={() => nav(item.href)} style={[styles.nav, path === item.href && !onlyFavorites && styles.navActive]}><Icon name={item.icon} size={20} color={path === item.href && !onlyFavorites ? palette.olive : palette.muted} /><Label style={{ fontSize: 13, fontWeight: path === item.href && !onlyFavorites ? '600' : '400', flex: 1 }}>{item.title}</Label>{item.href === '/' && <Label style={styles.count}>{garments.filter(g => g.owner === 'Tú').length}</Label>}</Pressable>)}
      <Pressable accessibilityRole="button" onPress={() => { router.push('/'); setOnlyFavorites(true); }} style={[styles.nav, onlyFavorites && styles.navActive]}><Icon name="heart" color={palette.muted} /><Label style={{ fontSize: 13 }}>Favoritos</Label></Pressable>
      <View style={{ flex: 1 }} />
      <View style={styles.sideNote}><Icon name="leaf" color={palette.olive} size={25} /><Label serif style={{ fontSize: 21, lineHeight: 27 }}>Más estilo.{'\n'}Menos huella.</Label><Label muted style={{ fontSize: 11, lineHeight: 18 }}>El mejor armario es el que ya tienes. Dale otra vuelta.</Label></View>
      <View style={[s.divider, { marginVertical: 19 }]} />
      <Pressable accessibilityRole="button" onPress={() => nav('/profile')} style={[s.row, { padding: 8 }]}><View style={styles.avatar}><Label style={{ fontWeight: '600', color: palette.olive }}>{profile.name.slice(0, 2).toUpperCase()}</Label></View><View style={{ flex: 1, gap: 4 }}><Label style={{ fontSize: 12, fontWeight: '600' }}>{profile.name}</Label><Label muted style={{ fontSize: 10 }}>Mi espacio personal</Label></View><Icon name="chevron" size={14} color={palette.muted} /></Pressable>
    </View>}
    <View style={{ flex: 1, minWidth: 0 }}>
      <View style={[styles.header, { paddingHorizontal: desktop ? 38 : 20 }]}>
        {desktop ? <Label muted style={{ fontSize: 12 }}>Tu armario, con otra mirada.</Label> : <View style={s.row}><Icon name="hanger" color={palette.olive} size={25} /><Label serif style={{ fontSize: 28 }}>cyl.</Label></View>}
        <View style={[s.row, { gap: 16 }]}>
          {width >= 700 && <View style={styles.search}><Icon name="search" size={17} color={palette.muted} /><TextInput accessibilityLabel="Buscar en tu armario" placeholder="Buscar una prenda..." placeholderTextColor={palette.muted} value={query} onChangeText={text => { setQuery(text); if (path !== '/') router.push('/'); }} style={{ color: palette.ink, fontSize: 12, flex: 1 }} />{query.length > 0 && <Pressable accessibilityRole="button" accessibilityLabel="Borrar búsqueda" onPress={() => setQuery('')}><Icon name="close" size={14} /></Pressable>}</View>}
          <Pressable accessibilityRole="button" accessibilityLabel="Abrir notificaciones" onPress={() => setOverlay('notifications')} style={styles.bell}><Icon name="bell" size={21} /><View style={styles.notificationDot} /></Pressable>
          <View style={styles.headerDivider} /><Pressable accessibilityRole="button" accessibilityLabel="Ver mi perfil" onPress={() => nav('/profile')} style={[styles.avatar, { width: 34, height: 34 }]}><Label style={{ fontSize: 11, fontWeight: '600', color: palette.olive }}>{profile.name.slice(0, 2).toUpperCase()}</Label></Pressable>
        </View>
      </View>
      <View style={{ flex: 1, minHeight: 0 }}>{children}</View>
      {!desktop && <View style={[styles.bottomNav, { paddingBottom: Math.max(inset.bottom, 10) }]}>{navigation.map(item => <Pressable accessibilityRole="button" accessibilityState={{ selected: path === item.href }} key={item.href} onPress={() => nav(item.href)} style={styles.bottomItem}><Icon name={item.icon} size={22} color={path === item.href ? palette.olive : '#92968C'} /><Label style={{ fontSize: 9, fontWeight: path === item.href ? '700' : '400', color: path === item.href ? palette.olive : palette.muted }}>{item.short}</Label>{path === item.href && <View style={styles.activeDot} />}</Pressable>)}</View>}
    </View>
    <Overlays />
    {toast !== '' && <View accessibilityLiveRegion="polite" style={[styles.toast, { bottom: desktop ? 26 : 100 }]}><Icon name="check" color="#DCE7C9" size={19} /><Label style={{ color: '#fff', fontSize: 12, flexShrink: 1 }}>{toast}</Label></View>}
  </View>;
}
const styles = StyleSheet.create({
  app: { flex: 1, flexDirection: 'row', backgroundColor: palette.bg },
  sidebar: { width: 226, backgroundColor: '#F3F3EC', borderRightWidth: 1, borderRightColor: palette.line, paddingHorizontal: 18, paddingTop: 32, paddingBottom: 20 },
  logo: { backgroundColor: palette.olive, width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  nav: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 15, borderRadius: 9, marginBottom: 5 },
  navActive: { backgroundColor: '#E1E6D5' },
  count: { fontSize: 10, backgroundColor: '#D3DCC4', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5, color: palette.olive },
  sideNote: { marginHorizontal: 10, padding: 17, gap: 13, borderRadius: 12, backgroundColor: '#E8ECDD' },
  avatar: { backgroundColor: '#E2E6D7', width: 38, height: 38, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  header: { minHeight: 83, borderBottomWidth: 1, borderBottomColor: palette.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FCFCF9' },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F1F2ED', paddingHorizontal: 13, borderRadius: 8, height: 37, width: 245 },
  bell: { width: 30, height: 35, justifyContent: 'center', alignItems: 'center' },
  notificationDot: { position: 'absolute', right: 3, top: 5, height: 5, width: 5, borderRadius: 4, backgroundColor: '#B5836F', borderWidth: 1, borderColor: '#FCFCF9' },
  headerDivider: { width: 1, height: 25, backgroundColor: palette.line },
  bottomNav: { flexDirection: 'row', backgroundColor: '#FCFCF9', borderTopWidth: 1, borderTopColor: palette.line, paddingTop: 11 },
  bottomItem: { flex: 1, gap: 5, alignItems: 'center', paddingBottom: 4 },
  activeDot: { width: 3, height: 3, borderRadius: 3, backgroundColor: palette.olive, position: 'absolute', bottom: -4 },
  toast: { position: 'absolute', alignSelf: 'center', left: '8%', right: '8%', maxWidth: 520, marginHorizontal: 'auto', padding: 17, flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: '#303E2D', borderRadius: 12, boxShadow: '0 6px 25px #00000020', zIndex: 99 },
});
