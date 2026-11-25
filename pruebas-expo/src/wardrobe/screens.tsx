import React, { useState } from 'react';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Switch, TextInput, View, useWindowDimensions } from 'react-native';
import { categories, friends, photos } from './data';
import { Button, Chip, EmptyState, GarmentGrid, Icon, IconButton, Label, Page, PageTitle, palette, s } from './ui';
import { useWardrobe } from './store';

export function WardrobeScreen() {
  const { garments, query, setQuery, onlyFavorites, setOnlyFavorites, setOverlay, profile, outfits } = useWardrobe();
  const [category, setCategory] = useState('Todo');
  const [scope, setScope] = useState('Todas mis prendas');
  const [filters, setFilters] = useState(false);
  const [season, setSeason] = useState('Todas');
  const [sort, setSort] = useState('Recientes');
  const [compact, setCompact] = useState(false);
  const { width } = useWindowDimensions();
  const mobile = width < 700;
  const own = garments.filter(g => g.owner === 'Tú');
  const normalizedQuery = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const visible = own.filter(g => (category === 'Todo' || g.category === category) && (!onlyFavorites || g.favorite)
    && (scope !== 'Compartidas' || g.shared) && (season === 'Todas' || g.season === season)
    && `${g.name} ${g.brand} ${g.color} ${g.category}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(normalizedQuery));
  if (sort === 'Más usadas') visible.sort((a, b) => b.wears - a.wears);
  if (sort === 'A → Z') visible.sort((a, b) => a.name.localeCompare(b.name));
  return <Page>
    <PageTitle eyebrow={`UN POCO MÁS TÚ, ${profile.name.toUpperCase()}`} title={onlyFavorites ? 'Tus prendas favoritas.' : 'Tu estilo, en un solo lugar.'} subtitle="Redescubre lo que tienes. Imagina lo que puedes crear." action={<Button title="Añadir prenda" icon="plus" onPress={() => setOverlay('add')} />} />
    {!onlyFavorites && <View style={[styles.heroRow, mobile && { flexDirection: 'column' }]}>
      <View style={[styles.hero, { flex: mobile ? undefined : 1.7 }]}>
        <View style={{ flex: 1, gap: 15, zIndex: 1, padding: mobile ? 23 : 28, paddingRight: mobile ? 100 : 130 }}><View style={s.row}><Icon name="spark" size={15} color={palette.olive} /><Label style={[s.eyebrow, { fontSize: 9, letterSpacing: 1.5 }]}>MENOS «NO TENGO QUÉ PONERME»</Label></View><Label serif style={{ fontSize: mobile ? 29 : 33, lineHeight: 39 }}>Un armario lleno{'\n'}de posibilidades.</Label><Label style={{ fontSize: 12, lineHeight: 20, color: '#6E7862' }}>Tus prendas de siempre.{'\n'}Combinaciones que aún no conoces.</Label><Pressable accessibilityRole="button" onPress={() => setOverlay('outfit')} style={[s.row, { alignSelf: 'flex-start', marginTop: 2 }]}><Label style={{ fontSize: 12, fontWeight: '600', color: palette.olive }}>Crear un conjunto</Label><Icon name="arrow" color={palette.olive} size={18} /></Pressable></View>
        <View style={styles.heroCircle} /><Image source={photos.look} style={styles.heroPhoto} resizeMode="cover" />
        <View style={styles.heroTag}><Icon name="leaf" size={13} color={palette.olive} /><Label style={{ fontSize: 9, color: palette.olive }}>Repite prendas, no ideas.</Label></View>
      </View>
      <Pressable accessibilityRole="button" onPress={() => router.push('/community')} style={[styles.communityHero, { flex: mobile ? undefined : 1 }]}>
        <View style={s.row}><View style={styles.avatarStack}><Image source={photos.avatar} style={styles.tinyAvatar} /><Image source={photos.friend} style={[styles.tinyAvatar, { marginLeft: -10 }]} /><View style={[styles.tinyAvatar, { marginLeft: -10, backgroundColor: '#E5D8C7', justifyContent: 'center', alignItems: 'center' }]}><Label style={{ fontSize: 10 }}>AG</Label></View></View><View style={{ flex: 1 }} /><Icon name="arrow" color={palette.olive} size={20} /></View><View style={{ gap: 8 }}><Label serif style={{ fontSize: 25, lineHeight: 30 }}>Lo bueno,{'\n'}si se comparte...</Label><Label muted style={{ fontSize: 11, lineHeight: 19 }}>El próximo flechazo puede estar{'\n'}en el armario de tus amigos.</Label></View><Label style={{ fontSize: 10, color: palette.olive }}>3 amigos · 4 prendas por descubrir</Label>
      </Pressable>
    </View>}
    <View style={styles.statsStrip}>{[{ icon: 'hanger' as const, count: own.length, label: 'prendas en tu armario' }, { icon: 'grid' as const, count: outfits.length, label: 'conjuntos con tu esencia' }, { icon: 'users' as const, count: own.filter(g => g.shared).length, label: 'prendas para compartir' }].map((stat, i) => <View key={stat.label} style={[s.row, { flex: 1, paddingHorizontal: mobile ? 8 : 18, gap: mobile ? 8 : 13 }, i > 0 && { borderLeftWidth: 1, borderLeftColor: palette.line }]}><View style={[styles.statIcon, mobile && { display: 'none' }]}><Icon name={stat.icon} color={palette.olive} size={20} /></View><View style={{ gap: 4 }}><Label serif style={{ fontSize: 25 }}>{stat.count.toString().padStart(2, '0')}</Label><Label muted style={{ fontSize: mobile ? 9 : 10 }}>{stat.label}</Label></View></View>)}</View>
    <View style={{ gap: 19 }}>
      <View style={[s.row, { justifyContent: 'space-between', flexWrap: 'wrap', gap: 15 }]}><View style={[s.row, { gap: 23 }]}>{['Todas mis prendas', 'Compartidas'].map(tab => <Pressable accessibilityRole="button" accessibilityState={{ selected: scope === tab }} key={tab} onPress={() => setScope(tab)} style={{ paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: scope === tab ? palette.olive : 'transparent' }}><Label style={{ fontSize: 13, fontWeight: scope === tab ? '600' : '400', color: scope === tab ? palette.ink : palette.muted }}>{tab}{tab === 'Todas mis prendas' ? ` (${own.length})` : ''}</Label></Pressable>)}</View><Label muted style={{ fontSize: 11 }}>{visible.length} prendas · a tu manera</Label></View>
      {mobile && <View style={[s.input, s.row]}><Icon name="search" size={17} color={palette.muted} /><TextInput accessibilityLabel="Buscar prendas" value={query} onChangeText={setQuery} placeholder="Busca una prenda, marca o color..." placeholderTextColor={palette.muted} style={{ flex: 1, fontSize: 12, color: palette.ink }} /></View>}
      <View style={[s.row, { gap: 12 }]}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7, paddingVertical: 2 }} style={{ flex: 1 }}>{categories.map(c => <Chip title={c} key={c} active={category === c} onPress={() => setCategory(c)} />)}</ScrollView><View style={[s.row, { gap: 2 }]}><IconButton name="filter" label="Mostrar filtros" active={filters} onPress={() => setFilters(!filters)} />{!mobile && <IconButton name={compact ? 'list' : 'grid'} label="Cambiar densidad de la cuadrícula" active={compact} onPress={() => setCompact(!compact)} />}</View></View>
      {filters && <View style={[s.card, { backgroundColor: '#F1F3E9', gap: 16 }]}><Label style={s.fieldLabel}>Hazlo más tuyo</Label><View style={[s.row, { flexWrap: 'wrap' }]}><Chip title="Solo favoritos" active={onlyFavorites} onPress={() => setOnlyFavorites(!onlyFavorites)} />{['Todas', 'Todo el año', 'Otoño / Invierno', 'Primavera / Verano'].map(item => <Chip key={item} title={item === 'Todas' ? 'Todas las temporadas' : item} active={season === item} onPress={() => setSeason(item)} />)}</View><View style={[s.row, { flexWrap: 'wrap' }]}><Label muted style={{ fontSize: 12 }}>Ordenar:</Label>{['Recientes', 'Más usadas', 'A → Z'].map(item => <Chip key={item} title={item} active={sort === item} onPress={() => setSort(item)} />)}<Pressable accessibilityRole="button" onPress={() => { setSeason('Todas'); setSort('Recientes'); setOnlyFavorites(false); setCategory('Todo'); setQuery(''); setScope('Todas mis prendas'); }}><Label style={{ fontSize: 12, textDecorationLine: 'underline' }}>Limpiar filtros</Label></Pressable></View></View>}
      {visible.length ? <GarmentGrid garments={visible} compact={compact} /> : <EmptyState title="Por aquí aún no hay prendas." subtitle="Prueba otra búsqueda o dale espacio a algo nuevo." action={<Button title="Ver todo mi armario" secondary onPress={() => { setQuery(''); setCategory('Todo'); setSeason('Todas'); setOnlyFavorites(false); setScope('Todas mis prendas'); }} />} />}
    </View>
    <View style={[s.row, { justifyContent: 'center', marginTop: 3 }]}><Icon name="leaf" size={13} color="#9DA68D" /><Label muted style={{ fontSize: 10 }}>Cuidar lo que tienes también es una forma de vestir bien.</Label></View>
  </Page>;
}

export function OutfitsScreen() {
  const { outfits, setOutfits, garments, setOverlay, setSelected } = useWardrobe();
  const [occasion, setOccasion] = useState('Todos');
  const { width } = useWindowDimensions();
  const [gridWidth, setGridWidth] = useState(0);
  const columns = width < 700 ? 1 : width < 1250 ? 2 : 3;
  const filtered = outfits.filter(o => occasion === 'Todos' || (occasion === 'Favoritos' ? o.favorite : o.occasion === occasion));
  return <Page><PageTitle eyebrow="HECHOS POR TI" title="Un look para cada plan." subtitle="Pequeñas combinaciones. Grandes días." action={<Button title="Crear conjunto" icon="plus" onPress={() => setOverlay('outfit')} />} />
    <View style={[styles.banner, { backgroundColor: palette.sage }]}><Icon name="spark" size={28} color={palette.olive} /><View style={{ flex: 1, gap: 7 }}><Label serif style={{ fontSize: 25 }}>Tu próximo look ya está en tu armario.</Label><Label muted style={{ fontSize: 12, lineHeight: 20 }}>Combina tus prendas, ponle nombre a la idea y guárdala para ese plan.</Label></View></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>{['Todos', 'Casual', 'Trabajo', 'Salir', 'Favoritos'].map(item => <Chip key={item} title={item} active={occasion === item} onPress={() => setOccasion(item)} />)}</ScrollView>
    <View onLayout={e => setGridWidth(e.nativeEvent.layout.width)} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }}>{gridWidth > 0 && filtered.map(outfit => <View key={outfit.id} style={[s.card, { width: (gridWidth - (columns - 1) * 20) / columns, padding: 14 }]}>
      <View style={styles.outfitCanvas}>{outfit.items.map((id, i) => { const garment = garments.find(g => g.id === id); return garment ? <Pressable key={id} accessibilityRole="button" accessibilityLabel={`Ver ${garment.name}`} onPress={() => setSelected(id)} style={{ width: i === 0 ? '58%' : '38%', height: i === 0 ? '100%' : '47%', position: 'absolute', left: i === 0 ? 0 : '62%', top: i === 0 || i === 1 ? 0 : '53%', overflow: 'hidden', borderRadius: 8 }}><Image source={garment.image} style={{ width: '100%', height: '100%' }} /></Pressable> : null; })}</View>
      <View style={[s.row, { justifyContent: 'space-between' }]}><View style={{ gap: 6, flex: 1 }}><Label serif style={{ fontSize: 21 }}>{outfit.name}</Label><Label muted style={{ fontSize: 11 }}>{outfit.occasion} · {outfit.items.length} prendas</Label></View><IconButton name="heart" label={`Favorito: ${outfit.name}`} active={outfit.favorite} onPress={() => setOutfits(items => items.map(o => o.id === outfit.id ? { ...o, favorite: !o.favorite } : o))} /><IconButton name="trash" label={`Eliminar conjunto ${outfit.name}`} onPress={() => setOutfits(items => items.filter(o => o.id !== outfit.id))} /></View>
    </View>)}</View>{!filtered.length && <EmptyState title="Aquí empieza una buena idea." subtitle="Crea tu primer conjunto o prueba otra categoría." action={<Button title="Crear conjunto" icon="plus" onPress={() => setOverlay('outfit')} />} />}
  </Page>;
}

export function CommunityScreen() {
  const { garments, setOverlay, requests } = useWardrobe();
  const [friend, setFriend] = useState('Todos');
  const [tab, setTab] = useState('Descubrir');
  const { width } = useWindowDimensions();
  const visible = garments.filter(g => g.owner !== 'Tú' && g.shared && (friend === 'Todos' || g.owner === friend));
  return <Page><PageTitle eyebrow="EL ESTILO SE COMPARTE" title="Su armario. Tu próximo plan." subtitle="Descubre, inspírate y pide prestado a tu gente." action={<Button title="Invitar a un amigo" icon="users" onPress={() => setOverlay('invite')} />} />
    <View style={[styles.banner, { backgroundColor: palette.peach }]}><Icon name="users" size={34} color="#9D7761" /><View style={{ flex: 1, gap: 7 }}><Label serif style={{ fontSize: 26 }}>Los buenos armarios no tienen puertas.</Label><Label muted style={{ fontSize: 12, lineHeight: 20 }}>Una prenda, más historias. Compartir entre amigos nunca había sentado tan bien.</Label></View></View>
    <View style={[s.row, { flexWrap: 'wrap' }]}>{['Descubrir', 'Mis préstamos'].map(item => <Chip key={item} title={`${item}${item === 'Mis préstamos' ? ` (${requests.length})` : ''}`} active={tab === item} onPress={() => setTab(item)} />)}</View>
    {tab === 'Descubrir' ? <><View style={{ gap: 17 }}><View style={[s.row, { justifyContent: 'space-between' }]}><Label serif style={{ fontSize: 25 }}>Tu círculo de estilo</Label>{friend !== 'Todos' && <Pressable accessibilityRole="button" onPress={() => setFriend('Todos')}><Label style={{ fontSize: 12, color: palette.olive }}>Ver todos</Label></Pressable>}</View><View style={{ flexDirection: width < 700 ? 'column' : 'row', gap: 13 }}>{friends.map(f => <Pressable accessibilityRole="button" accessibilityState={{ selected: friend === f.name }} key={f.name} onPress={() => setFriend(friend === f.name ? 'Todos' : f.name)} style={[s.card, { flex: 1, padding: 19, borderColor: friend === f.name ? palette.olive : palette.line, backgroundColor: friend === f.name ? '#F0F3E8' : '#fff' }]}><View style={s.row}>{f.image ? <Image source={f.image} style={styles.friendAvatar} /> : <View style={[styles.friendAvatar, { backgroundColor: f.color, alignItems: 'center', justifyContent: 'center' }]}><Label>{f.initials}</Label></View>}<View style={{ gap: 4, flex: 1 }}><Label style={{ fontWeight: '600' }}>{f.name}</Label><Label muted style={{ fontSize: 10 }}>{f.handle}</Label></View><Icon name="chevron" size={15} color={palette.muted} /></View><Label muted style={{ fontSize: 11 }}>{f.style}</Label><Label style={{ fontSize: 10, color: palette.olive }}>{f.count} prendas compartidas</Label></Pressable>)}</View></View><View style={{ gap: 20 }}><View style={[s.row, { justifyContent: 'space-between' }]}><Label serif style={{ fontSize: 25 }}>{friend === 'Todos' ? 'Para descubrir' : `El armario de ${friend}`}</Label><Label muted style={{ fontSize: 11 }}>{visible.length} prendas disponibles</Label></View><GarmentGrid garments={visible} /></View></> : requests.length ? <View style={{ gap: 13 }}>{requests.map(id => { const g = garments.find(item => item.id === id); return g && <View key={id} style={[s.card, s.row, { padding: 16 }]}><Image source={g.image} style={{ width: 65, height: 75, borderRadius: 9 }} /><View style={{ flex: 1, gap: 8 }}><Label style={{ fontWeight: '600' }}>{g.name}</Label><Label muted style={{ fontSize: 12 }}>Armario de {g.owner}</Label><Label style={{ fontSize: 11, color: palette.olive }}>Solicitud pendiente · Simulación</Label></View><Icon name="share" color={palette.olive} /></View>; })}</View> : <EmptyState title="El próximo préstamo empieza aquí." subtitle="Explora los armarios de tus amigos y solicita una prenda para tu próximo plan." action={<Button title="Descubrir prendas" onPress={() => setTab('Descubrir')} />} />}
  </Page>;
}

export function ProfileScreen() {
  const { profile, garments, outfits, setOverlay, notify, publicCloset, setPublicCloset, reminders, setReminders } = useWardrobe();
  const { width } = useWindowDimensions();
  const own = garments.filter(g => g.owner === 'Tú');
  const top = [...own].sort((a, b) => b.wears - a.wears)[0];
  return <Page><PageTitle eyebrow="TU ESPACIO PERSONAL" title="Muy tú. Y cada vez más." subtitle="Un armario que cuenta tu historia." />
    <View style={[s.card, { alignItems: 'center', paddingVertical: 35, backgroundColor: '#EEF0E5' }]}><View style={styles.profileAvatar}><Label serif style={{ fontSize: 35, color: palette.olive }}>{profile.name.slice(0, 2).toUpperCase()}</Label></View><Label serif style={{ fontSize: 32 }}>{profile.name}</Label><Label muted style={{ fontSize: 12 }}>{profile.city} · Miembro de CYL desde 2026</Label><Label style={{ fontSize: 14, textAlign: 'center' }}>{profile.bio}</Label><Button title="Editar perfil" secondary icon="user" onPress={() => setOverlay('edit-profile')} /></View>
    <View style={{ flexDirection: width < 700 ? 'column' : 'row', gap: 20 }}><View style={[s.card, { flex: 1 }]}><View style={s.row}><Icon name="leaf" color={palette.olive} /><Label serif style={{ fontSize: 25 }}>Tu armario en cifras</Label></View>{[{ label: 'Prendas con historia', value: own.length }, { label: 'Conjuntos guardados', value: outfits.length }, { label: 'Prendas compartidas', value: own.filter(g => g.shared).length }, { label: 'Veces que has repetido con estilo', value: own.reduce((total, g) => total + g.wears, 0) }].map(stat => <View style={[s.row, { justifyContent: 'space-between', paddingVertical: 9 }]} key={stat.label}><Label muted style={{ fontSize: 12, flex: 1 }}>{stat.label}</Label><Label serif style={{ fontSize: 24 }}>{stat.value}</Label></View>)}{top && <View style={{ padding: 16, borderRadius: 9, backgroundColor: '#F4F4ED', gap: 6 }}><Label style={{ fontSize: 11, fontWeight: '600' }}>Tu imprescindible</Label><Label muted style={{ fontSize: 12 }}>{top.name} · {top.wears} usos y contando.</Label></View>}</View>
    <View style={[s.card, { flex: 1 }]}><View style={s.row}><Icon name="settings" color={palette.olive} /><Label serif style={{ fontSize: 25 }}>A tu manera</Label></View><Preference title="Armario visible para amigos" subtitle="Tus amigos ven las prendas que compartes." value={publicCloset} onChange={value => { setPublicCloset(value); notify(value ? 'Visibilidad para amigos activada en la demo.' : 'Visibilidad para amigos desactivada en la demo.'); }} /><View style={s.divider} /><Preference title="Recordatorios de estilo" subtitle="Una idea para redescubrir tus prendas." value={reminders} onChange={value => { setReminders(value); notify('Preferencia de recordatorios actualizada en la demo.'); }} /><View style={s.divider} /><View style={{ gap: 9, paddingTop: 8 }}><Label style={{ fontSize: 12, fontWeight: '600' }}>Un espacio para experimentar</Label><Label muted style={{ fontSize: 12, lineHeight: 21 }}>Esta es una demo interactiva con personas y prendas ficticias. Los cambios viven en esta sesión y se reinician al recargar. Las invitaciones y préstamos son simulados.</Label></View></View></View>
    <View style={{ alignItems: 'center', gap: 7, paddingVertical: 15 }}><Label serif style={{ fontSize: 29 }}>cyl.</Label><Label muted style={{ fontSize: 10, letterSpacing: 1 }}>CLOSET YOUR LIFE · DEMO 1.0</Label></View>
  </Page>;
}
function Preference({ title, subtitle, value, onChange }: { title: string; subtitle: string; value: boolean; onChange: (value: boolean) => void }) {
  return <View style={[s.row, { paddingVertical: 8 }]}><View style={{ flex: 1, gap: 7 }}><Label style={{ fontSize: 12, fontWeight: '600' }}>{title}</Label><Label muted style={{ fontSize: 11, lineHeight: 18 }}>{subtitle}</Label></View><Switch accessibilityLabel={title} value={value} onValueChange={onChange} trackColor={{ false: '#DADDD2', true: '#8C9B7E' }} thumbColor="#fff" /></View>;
}
const styles = StyleSheet.create({
  heroRow: { flexDirection: 'row', gap: 18 },
  hero: { minHeight: 245, borderRadius: 16, backgroundColor: '#E7ECD9', overflow: 'hidden' },
  heroCircle: { position: 'absolute', width: 210, height: 210, borderRadius: 120, backgroundColor: '#D5DFC4', right: -35, top: 45 },
  heroPhoto: { position: 'absolute', right: -4, top: 26, width: 142, height: 202, borderRadius: 75, transform: [{ rotate: '9deg' }], opacity: .9 },
  heroTag: { position: 'absolute', right: 13, bottom: 18, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#F8FAEE', borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 5, transform: [{ rotate: '-5deg' }] },
  communityHero: { borderWidth: 1, borderColor: '#EBE6DC', backgroundColor: '#F5F0E7', borderRadius: 16, padding: 24, gap: 19, justifyContent: 'space-between' },
  avatarStack: { flexDirection: 'row' },
  tinyAvatar: { width: 32, height: 32, borderRadius: 22, borderWidth: 2, borderColor: '#F5F0E7' },
  statsStrip: { flexDirection: 'row', paddingVertical: 16, borderWidth: 1, borderColor: palette.line, borderRadius: 13, backgroundColor: '#FDFDFA' },
  statIcon: { width: 41, height: 41, backgroundColor: '#F0F2E9', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 22, padding: 28, borderRadius: 16 },
  outfitCanvas: { backgroundColor: '#F3F1EB', height: 280, borderRadius: 10, overflow: 'hidden' },
  friendAvatar: { height: 43, width: 43, borderRadius: 24 },
  profileAvatar: { width: 86, height: 86, borderRadius: 50, backgroundColor: '#DBE1CD', alignItems: 'center', justifyContent: 'center' },
});
