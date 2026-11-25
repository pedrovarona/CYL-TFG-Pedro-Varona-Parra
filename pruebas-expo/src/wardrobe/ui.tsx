import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions, type TextStyle, type ViewStyle } from 'react-native';
import { Garment } from './data';
import { useWardrobe } from './store';

export const palette = { bg: '#FAF9F6', paper: '#FFFFFF', ink: '#272D27', muted: '#7D8278', olive: '#53644A', sage: '#E9EDDF', line: '#E9E9E2', peach: '#F4E9DE' };
const iconSources = {
  hanger: require('../../assets/wardrobe/icons/hanger.png'), grid: require('../../assets/wardrobe/icons/grid.png'),
  heart: require('../../assets/wardrobe/icons/heart.png'), users: require('../../assets/wardrobe/icons/users.png'),
  user: require('../../assets/wardrobe/icons/user.png'), plus: require('../../assets/wardrobe/icons/plus.png'),
  search: require('../../assets/wardrobe/icons/search.png'), bell: require('../../assets/wardrobe/icons/bell.png'),
  arrow: require('../../assets/wardrobe/icons/arrow.png'), chevron: require('../../assets/wardrobe/icons/chevron.png'),
  close: require('../../assets/wardrobe/icons/close.png'), check: require('../../assets/wardrobe/icons/check.png'),
  filter: require('../../assets/wardrobe/icons/filter.png'), list: require('../../assets/wardrobe/icons/list.png'),
  spark: require('../../assets/wardrobe/icons/spark.png'), leaf: require('../../assets/wardrobe/icons/leaf.png'),
  sun: require('../../assets/wardrobe/icons/sun.png'), share: require('../../assets/wardrobe/icons/share.png'),
  settings: require('../../assets/wardrobe/icons/settings.png'), lock: require('../../assets/wardrobe/icons/lock.png'),
  camera: require('../../assets/wardrobe/icons/camera.png'), trash: require('../../assets/wardrobe/icons/trash.png'),
};
export type IconName = keyof typeof iconSources;
export function Icon({ name, size = 21, color = palette.ink }: { name: IconName; size?: number; color?: string }) {
  return <Image accessible={false} source={iconSources[name]} style={{ width: size, height: size, tintColor: color }} />;
}
export function Label({ children, style, serif = false, muted = false }: { children: React.ReactNode; style?: TextStyle | TextStyle[]; serif?: boolean; muted?: boolean }) {
  return <Text style={[s.text, muted && { color: palette.muted }, serif && s.serif, style]}>{children}</Text>;
}
export function Button({ title, onPress, icon, secondary = false, disabled = false, style }: { title: string; onPress: () => void; icon?: IconName; secondary?: boolean; disabled?: boolean; style?: ViewStyle }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.secondaryButton, disabled && { opacity: .4 }, pressed && { opacity: .75 }, style]}>
    {icon && <Icon name={icon} size={18} color={secondary ? palette.olive : '#fff'} />}<Label style={{ color: secondary ? palette.olive : '#fff', fontWeight: '600', fontSize: 13 }}>{title}</Label>
  </Pressable>;
}
export function IconButton({ name, onPress, label, active = false }: { name: IconName; onPress: () => void; label: string; active?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: active }} onPress={onPress} style={({ pressed }) => [s.iconButton, active && { backgroundColor: palette.sage }, pressed && { opacity: .5 }]}><Icon name={name} size={19} color={active ? palette.olive : palette.muted} /></Pressable>;
}
export function Chip({ title, active, onPress }: { title: string; active: boolean; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={[s.chip, active && s.chipActive]}><Label style={{ fontSize: 12, fontWeight: active ? '600' : '400', color: active ? '#fff' : palette.muted }}>{title}</Label></Pressable>;
}
export function Field({ label, value, onChangeText, placeholder }: { label: string; value: string; onChangeText: (text: string) => void; placeholder?: string }) {
  return <View style={{ gap: 8 }}><Label style={s.fieldLabel}>{label}</Label><TextInput accessibilityLabel={label} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={palette.muted} style={s.input} /></View>;
}
export function Page({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  return <ScrollView style={{ flex: 1 }} contentContainerStyle={[s.page, { paddingHorizontal: width < 700 ? 20 : 38 }]} keyboardShouldPersistTaps="handled"><View style={{ width: '100%', maxWidth: 1280, alignSelf: 'center', gap: 28 }}>{children}</View></ScrollView>;
}
export function PageTitle({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle: string; action?: React.ReactNode }) {
  const { width } = useWindowDimensions();
  return <View style={[s.row, { justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18 }]}><View style={{ gap: 9, flexShrink: 1 }}><Label style={s.eyebrow}>{eyebrow}</Label><Label serif style={{ fontSize: width < 700 ? 32 : 39, lineHeight: width < 700 ? 40 : 47 }}>{title}</Label><Label muted style={{ fontSize: 13, lineHeight: 21 }}>{subtitle}</Label></View>{action}</View>;
}
export function EmptyState({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return <View style={s.empty}><Icon name="hanger" size={42} color={palette.olive} /><Label serif style={{ fontSize: 26 }}>{title}</Label><Label muted style={{ textAlign: 'center', lineHeight: 22 }}>{subtitle}</Label>{action}</View>;
}
export function GarmentCard({ garment, width }: { garment: Garment; width: number }) {
  const { setSelected, toggleFavorite } = useWardrobe();
  return <View style={{ width, gap: 12 }}>
    <View style={s.garmentPhoto}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Ver ${garment.name}`} onPress={() => setSelected(garment.id)} style={{ flex: 1 }}><Image source={garment.image} resizeMode="cover" style={{ width: '100%', height: '100%' }} /></Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={`${garment.favorite ? 'Quitar de' : 'Añadir a'} favoritos: ${garment.name}`} accessibilityState={{ selected: garment.favorite }} onPress={() => toggleFavorite(garment.id)} style={s.favorite}><Icon name="heart" size={17} color={garment.favorite ? '#A76D58' : palette.ink} />{garment.favorite && <View style={s.favoriteDot} />}</Pressable>
      {garment.shared && <View style={s.sharedBadge}><Icon name="users" size={12} color={palette.olive} /><Label style={{ fontSize: 9, color: palette.olive }}>{garment.owner === 'Tú' ? 'Compartida' : `De ${garment.owner}`}</Label></View>}
    </View>
    <Pressable accessibilityRole="button" onPress={() => setSelected(garment.id)}><Label style={{ fontSize: 14, fontWeight: '600' }}>{garment.name}</Label><View style={[s.row, { justifyContent: 'space-between', marginTop: 5 }]}><Label muted style={{ fontSize: 11 }}>{garment.brand} · {garment.category}</Label><View style={[s.colorDot, { backgroundColor: colorHex[garment.color] || '#b4b5a2' }]} /></View></Pressable>
  </View>;
}
export const colorHex: Record<string, string> = { Crudo: '#D6C9B6', Azul: '#697D94', Blanco: '#F0ECE3', Marrón: '#9C7454', Verde: '#899278', Negro: '#343635' };
export function GarmentGrid({ garments, compact = false }: { garments: Garment[]; compact?: boolean }) {
  const [availableWidth, setAvailableWidth] = React.useState(0);
  const columns = availableWidth < 500 ? 2 : availableWidth < 760 ? 3 : compact ? 5 : 4;
  const gap = availableWidth < 500 ? 14 : 20;
  return <View onLayout={e => setAvailableWidth(e.nativeEvent.layout.width)} style={{ flexDirection: 'row', flexWrap: 'wrap', gap, rowGap: 27 }}>{availableWidth > 0 && garments.map(garment => <GarmentCard key={garment.id} garment={garment} width={(availableWidth - gap * (columns - 1)) / columns} />)}</View>;
}
export const s = StyleSheet.create({
  text: { fontSize: 14, color: palette.ink, fontFamily: 'System' },
  serif: { fontFamily: 'Georgia', fontWeight: '400', letterSpacing: -.8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  page: { paddingTop: 30, paddingBottom: 42 },
  eyebrow: { fontSize: 10, fontWeight: '600', letterSpacing: 2, color: palette.olive },
  button: { minHeight: 44, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: palette.olive, borderRadius: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  secondaryButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#D1D8C7' },
  iconButton: { width: 38, height: 38, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  chip: { paddingHorizontal: 17, paddingVertical: 10, borderRadius: 22, backgroundColor: '#F0F0EB' },
  chipActive: { backgroundColor: palette.olive },
  fieldLabel: { fontSize: 12, fontWeight: '600' },
  input: { backgroundColor: '#F6F6F1', borderRadius: 9, paddingHorizontal: 14, paddingVertical: 14, minHeight: 46, color: palette.ink, fontSize: 14, borderWidth: 1, borderColor: palette.line },
  empty: { alignItems: 'center', padding: 36, gap: 16, backgroundColor: '#F1F2EA', borderRadius: 16 },
  garmentPhoto: { aspectRatio: .87, backgroundColor: '#EEEDE8', borderRadius: 13, overflow: 'hidden' },
  favorite: { position: 'absolute', right: 10, top: 10, width: 31, height: 31, backgroundColor: '#FFFFFFEE', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  favoriteDot: { position: 'absolute', right: 5, top: 5, width: 4, height: 4, borderRadius: 3, backgroundColor: '#A76D58' },
  sharedBadge: { position: 'absolute', bottom: 10, left: 10, backgroundColor: '#FAFBF2F0', paddingHorizontal: 9, paddingVertical: 6, borderRadius: 5, flexDirection: 'row', alignItems: 'center', gap: 5 },
  colorDot: { width: 10, height: 10, borderRadius: 10, borderColor: '#00000010', borderWidth: 1 },
  card: { padding: 24, borderWidth: 1, borderColor: palette.line, borderRadius: 16, backgroundColor: '#fff', gap: 16 },
  divider: { height: 1, backgroundColor: palette.line },
});
