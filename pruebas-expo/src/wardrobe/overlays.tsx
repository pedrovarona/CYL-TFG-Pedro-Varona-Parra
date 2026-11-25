import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { categories, Category, photos } from './data';
import { Button, Chip, colorHex, Field, Icon, IconButton, Label, palette, s } from './ui';
import { useWardrobe } from './store';

export function Overlays() {
  const { overlay, setOverlay, selected, setSelected } = useWardrobe();
  const inset = useSafeAreaInsets();
  const open = !!overlay || !!selected;
  function close() { setOverlay(null); setSelected(null); }
  return <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
    <KeyboardAvoidingView style={styles.backdrop} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Pressable accessibilityRole="button" accessibilityLabel="Cerrar ventana" style={StyleSheet.absoluteFill} onPress={close} />
      <View accessibilityViewIsModal style={[styles.modal, { marginTop: Math.max(20, inset.top), marginBottom: Math.max(20, inset.bottom) }]}>
        <View style={[s.row, { justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: palette.line }]}><Label style={[s.eyebrow, { fontSize: 9 }]}>{selected ? 'CADA PRENDA, UNA HISTORIA' : overlay === 'add' ? 'DALE SU SITIO EN TU ARMARIO' : overlay === 'outfit' ? 'TU PRÓXIMO LOOK' : overlay === 'notifications' ? 'AL DÍA CON TU CÍRCULO' : overlay === 'invite' ? 'EL ESTILO SE COMPARTE' : 'UN POCO MÁS TÚ'}</Label><IconButton name="close" label="Cerrar ventana" onPress={close} /></View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 25, gap: 20 }}>
          {selected ? <GarmentDetail key={selected} /> : overlay === 'add' ? <AddGarment /> : overlay === 'outfit' ? <CreateOutfit /> : overlay === 'notifications' ? <Notifications /> : overlay === 'invite' ? <Invite /> : overlay === 'edit-profile' ? <EditProfile /> : null}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  </Modal>;
}

function AddGarment() {
  const { addGarment } = useWardrobe();
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<Category>('Tops');
  const [color, setColor] = useState('Crudo');
  const [season, setSeason] = useState('Todo el año');
  const [image, setImage] = useState<keyof typeof photos>('knit');
  const [shared, setShared] = useState(false);
  const [error, setError] = useState('');
  function save() {
    if (!name.trim()) { setError('Ponle un nombre a tu prenda para continuar.'); return; }
    addGarment({ id: `g-${Date.now()}`, name: name.trim(), brand: brand.trim() || 'Sin marca', category, color, season, image: photos[image], shared, favorite: false, owner: 'Tú', wears: 0 });
  }
  return <><Label serif style={styles.title}>Una nueva historia.</Label><Label muted style={styles.description}>Añade una prenda y empieza a imaginar posibilidades.</Label>
    <View style={styles.photoPicker}><Image source={photos[image]} style={{ height: 165, width: 145, borderRadius: 10 }} /><View style={{ flex: 1, gap: 10 }}><Icon name="camera" color={palette.olive} size={25} /><Label style={{ fontSize: 12, fontWeight: '600' }}>Elige una foto de ejemplo</Label><Label muted style={{ fontSize: 11, lineHeight: 18 }}>Para esta demo, te dejamos una pequeña selección de prendas.</Label></View></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 9 }}>{(['knit', 'tee', 'jeans', 'shoes', 'jacket', 'leather', 'shirt', 'bag'] as const).map(key => <Pressable accessibilityRole="button" accessibilityLabel={`Elegir foto: ${key}`} accessibilityState={{ selected: image === key }} key={key} onPress={() => setImage(key)} style={{ padding: 3, borderWidth: 2, borderColor: image === key ? palette.olive : 'transparent', borderRadius: 9 }}><Image source={photos[key]} style={{ width: 54, height: 64, borderRadius: 5 }} /></Pressable>)}</ScrollView>
    <Field label="Nombre de la prenda *" value={name} onChangeText={text => { setName(text); setError(''); }} placeholder="Ej. Mi jersey favorito" />
    <Field label="Marca" value={brand} onChangeText={setBrand} placeholder="Ej. Mango" />
    <Label style={s.fieldLabel}>Categoría</Label><View style={styles.wrap}>{categories.filter(c => c !== 'Todo').map(c => <Chip title={c} key={c} active={category === c} onPress={() => setCategory(c)} />)}</View>
    <Label style={s.fieldLabel}>Color</Label><View style={styles.wrap}>{Object.entries(colorHex).map(([key, hex]) => <Pressable accessibilityRole="button" accessibilityLabel={key} accessibilityState={{ selected: color === key }} key={key} onPress={() => setColor(key)} style={[s.row, { borderRadius: 20, padding: 9, borderWidth: 1, borderColor: color === key ? palette.olive : palette.line }]}><View style={[s.colorDot, { backgroundColor: hex }]} /><Label style={{ fontSize: 11 }}>{key}</Label></Pressable>)}</View>
    <Label style={s.fieldLabel}>Temporada</Label><View style={styles.wrap}>{['Todo el año', 'Otoño / Invierno', 'Primavera / Verano'].map(item => <Chip title={item} key={item} active={season === item} onPress={() => setSeason(item)} />)}</View>
    <View style={[s.row, { justifyContent: 'space-between', paddingVertical: 10 }]}><View style={{ flex: 1, gap: 5 }}><Label style={s.fieldLabel}>Compartir con mis amigos</Label><Label muted style={{ fontSize: 11 }}>Una prenda, más posibilidades.</Label></View><Switch accessibilityLabel="Compartir con mis amigos" value={shared} onValueChange={setShared} trackColor={{ true: '#8C9B7E', false: '#ddd' }} thumbColor="#fff" /></View>
    {!!error && <Label style={{ color: '#A34E3B', fontSize: 12 }}>{error}</Label>}<Button title="Guardar en mi armario" icon="plus" onPress={save} />
  </>;
}

function GarmentDetail() {
  const { selected, garments, updateGarment, toggleFavorite, requests, requestGarment, notify } = useWardrobe();
  const garment = garments.find(g => g.id === selected);
  if (!garment) return <Label>Esta prenda ya no está disponible.</Label>;
  const own = garment.owner === 'Tú';
  return <><Image source={garment.image} style={{ width: '100%', height: 320, borderRadius: 13 }} resizeMode="cover" />
    <View style={[s.row, { justifyContent: 'space-between' }]}><View style={{ gap: 6, flex: 1 }}><Label serif style={styles.title}>{garment.name}</Label><Label muted style={{ fontSize: 12 }}>{garment.brand} · {own ? 'Tu armario' : `Armario de ${garment.owner}`}</Label></View><IconButton name="heart" label="Marcar como favorita" active={garment.favorite} onPress={() => toggleFavorite(garment.id)} /></View>
    <View style={[s.row, { flexWrap: 'wrap' }]}>{[garment.category, garment.color, garment.season].map(value => <View key={value} style={styles.infoBadge}><Label muted style={{ fontSize: 11 }}>{value}</Label></View>)}</View>
    {own ? <><View style={[s.card, { backgroundColor: '#F2F4EA' }]}><View style={s.row}><Icon name="leaf" color={palette.olive} /><View style={{ flex: 1, gap: 5 }}><Label style={{ fontSize: 13, fontWeight: '600' }}>{garment.wears} veces bien elegida</Label><Label muted style={{ fontSize: 11, lineHeight: 18 }}>Cada uso le da una nueva historia.</Label></View></View><Button title="La he usado hoy" secondary icon="check" onPress={() => { updateGarment(garment.id, { wears: garment.wears + 1 }); notify('Un uso más registrado. ¡Repetir sienta bien!'); }} /></View><View style={[s.row, { justifyContent: 'space-between' }]}><View style={{ flex: 1, gap: 7 }}><Label style={s.fieldLabel}>Disponible para compartir</Label><Label muted style={{ fontSize: 11 }}>Visible en tu armario para amigos.</Label></View><Switch accessibilityLabel="Disponible para compartir" value={garment.shared} onValueChange={shared => updateGarment(garment.id, { shared })} trackColor={{ true: '#8C9B7E', false: '#ddd' }} thumbColor="#fff" /></View></> : <><View style={[s.card, { backgroundColor: palette.sage }]}><Label serif style={{ fontSize: 23 }}>¿Te la imaginas en tu próximo look?</Label><Label muted style={{ fontSize: 12, lineHeight: 20 }}>Pídesela a {garment.owner}. En esta demo, tu solicitud quedará pendiente en «Mis préstamos».</Label></View><Button title={requests.includes(garment.id) ? 'Solicitud enviada en la demo' : 'Pedir prestada'} icon={requests.includes(garment.id) ? 'check' : 'share'} disabled={requests.includes(garment.id)} onPress={() => requestGarment(garment.id)} /></>}
  </>;
}

function CreateOutfit() {
  const { garments, addOutfit } = useWardrobe();
  const [name, setName] = useState('');
  const [occasion, setOccasion] = useState('Casual');
  const [items, setItems] = useState<string[]>([]);
  const [error, setError] = useState('');
  function save() {
    if (!name.trim() || items.length < 2) { setError('Escribe un nombre y elige al menos dos prendas.'); return; }
    addOutfit({ id: `o-${Date.now()}`, name: name.trim(), occasion, items, favorite: false });
  }
  return <><Label serif style={styles.title}>Un poco de ti. Bien combinado.</Label><Label muted style={styles.description}>Elige de dos a tres prendas para crear tu conjunto.</Label><Field label="Nombre del conjunto *" value={name} onChangeText={setName} placeholder="Ej. Domingo sin despertador" /><View style={styles.wrap}>{['Casual', 'Trabajo', 'Salir'].map(item => <Chip key={item} title={item} active={occasion === item} onPress={() => setOccasion(item)} />)}</View><Label style={s.fieldLabel}>Tus prendas · {items.length} / 3 seleccionadas</Label><View style={styles.wrap}>{garments.filter(g => g.owner === 'Tú').map(g => <Pressable accessibilityRole="button" accessibilityLabel={`Seleccionar ${g.name}`} accessibilityState={{ selected: items.includes(g.id) }} key={g.id} onPress={() => { setError(''); setItems(current => current.includes(g.id) ? current.filter(id => id !== g.id) : current.length < 3 ? [...current, g.id] : current); }} style={{ width: '30%', gap: 6, borderRadius: 10, padding: 5, borderWidth: 2, borderColor: items.includes(g.id) ? palette.olive : 'transparent', backgroundColor: items.includes(g.id) ? palette.sage : 'transparent' }}><Image source={g.image} style={{ width: '100%', aspectRatio: .9, borderRadius: 6 }} /><Label style={{ fontSize: 10, lineHeight: 15 }}>{g.name}</Label>{items.includes(g.id) && <View style={styles.selectionCheck}><Icon name="check" size={13} color="#fff" /></View>}</Pressable>)}</View>{!!error && <Label style={{ color: '#A34E3B', fontSize: 12 }}>{error}</Label>}<Button title="Guardar conjunto" icon="check" onPress={save} /></>;
}

function Notifications() {
  const { requests, garments } = useWardrobe();
  return <><Label serif style={styles.title}>Pequeñas novedades.</Label><Label muted style={styles.description}>Lo que se mueve en tu círculo.</Label>{[
    { icon: 'users' as const, title: 'Lucía ha abierto su armario', body: 'Ya puedes descubrir sus prendas compartidas.', time: 'Hace un rato' },
    { icon: 'spark' as const, title: 'Tu armario tiene más de un plan', body: 'Prueba a combinar ese jersey de otra manera.', time: 'Hoy' },
    ...requests.map(id => ({ icon: 'share' as const, title: 'Préstamo solicitado', body: `${garments.find(g => g.id === id)?.name} · Pendiente en la demo`, time: 'Esta sesión' })),
  ].map((item, i) => <View key={i} style={[s.card, s.row, { padding: 18, alignItems: 'flex-start' }]}><View style={styles.noticeIcon}><Icon name={item.icon} color={palette.olive} /></View><View style={{ flex: 1, gap: 7 }}><Label style={{ fontSize: 13, fontWeight: '600' }}>{item.title}</Label><Label muted style={{ fontSize: 12, lineHeight: 19 }}>{item.body}</Label><Label muted style={{ fontSize: 10 }}>{item.time}</Label></View></View>)}</>;
}

function Invite() {
  const { notify, setOverlay } = useWardrobe();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  return <><View style={{ alignItems: 'center', padding: 20 }}><Icon name="users" size={50} color={palette.olive} /></View><Label serif style={styles.title}>El estilo, mejor en compañía.</Label><Label muted style={styles.description}>Invita a esa persona con la que siempre intercambias ideas (y alguna chaqueta).</Label><Field label="Correo de tu amigo" value={email} onChangeText={text => { setEmail(text); setError(''); }} placeholder="hola@ejemplo.com" /><View style={[s.card, { backgroundColor: '#F1F3E9' }]}><Label muted style={{ fontSize: 12, lineHeight: 20 }}>Es una invitación de prueba: no se envía ningún correo ni se añade una persona real.</Label></View>{!!error && <Label style={{ fontSize: 12, color: '#A34E3B' }}>{error}</Label>}<Button title="Simular invitación" icon="arrow" onPress={() => { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Introduce un correo válido para probar la invitación.'); return; } setOverlay(null); notify(`Invitación simulada para ${email.trim()}.`); }} /></>;
}

function EditProfile() {
  const { profile, setProfile, setOverlay, notify } = useWardrobe();
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [city, setCity] = useState(profile.city);
  return <><Label serif style={styles.title}>Tu espacio, tus palabras.</Label><Field label="Tu nombre" value={name} onChangeText={setName} /><Field label="Ciudad" value={city} onChangeText={setCity} /><Field label="Algo sobre tu estilo" value={bio} onChangeText={setBio} /><Button title="Guardar perfil" icon="check" disabled={!name.trim()} onPress={() => { setProfile({ name: name.trim(), bio: bio.trim(), city: city.trim() }); setOverlay(null); notify('Perfil actualizado. Muy tú.'); }} /></>;
}
const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#252E2666', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15 },
  modal: { width: '100%', maxWidth: 570, maxHeight: '92%', backgroundColor: palette.bg, borderRadius: 19, overflow: 'hidden', boxShadow: '0 15px 65px #00000020' },
  title: { fontSize: 29, lineHeight: 37 },
  description: { fontSize: 13, lineHeight: 22, marginTop: -8 },
  photoPicker: { backgroundColor: '#EEEEE6', padding: 15, borderRadius: 12, flexDirection: 'row', gap: 20, alignItems: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  infoBadge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, backgroundColor: '#EEEFE7' },
  selectionCheck: { position: 'absolute', right: 9, top: 9, backgroundColor: palette.olive, borderRadius: 15, padding: 4 },
  noticeIcon: { backgroundColor: palette.sage, width: 37, height: 37, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
