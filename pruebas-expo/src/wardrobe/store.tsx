import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Garment, initialGarments, initialOutfits, Outfit } from './data';

type Overlay = 'add' | 'notifications' | 'outfit' | 'invite' | 'edit-profile' | null;
function useWardrobeState() {
  const [garments, setGarments] = useState(initialGarments);
  const [outfits, setOutfits] = useState(initialOutfits);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [query, setQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [requests, setRequests] = useState<string[]>([]);
  const [publicCloset, setPublicCloset] = useState(true);
  const [reminders, setReminders] = useState(false);
  const [profile, setProfile] = useState({ name: 'Pedro', bio: 'Menos prendas. Más posibilidades.', city: 'Madrid' });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function notify(message: string) {
    if (timer.current) clearTimeout(timer.current);
    setToast(message); timer.current = setTimeout(() => setToast(''), 3600);
  }
  function updateGarment(id: string, patch: Partial<Garment>) {
    setGarments(items => items.map(item => item.id === id ? { ...item, ...patch } : item));
  }
  function toggleFavorite(id: string) {
    setGarments(items => items.map(item => item.id === id ? { ...item, favorite: !item.favorite } : item));
  }
  function addGarment(garment: Garment) {
    setGarments(items => [garment, ...items]); setOverlay(null); notify('Tu nueva prenda ya está en el armario.');
  }
  function addOutfit(outfit: Outfit) {
    setOutfits(items => [outfit, ...items]); setOverlay(null); notify('Conjunto guardado. ¡Ya tienes tu próximo look!');
  }
  function requestGarment(id: string) {
    if (requests.includes(id)) return;
    setRequests(items => [...items, id]); notify('Solicitud de préstamo guardada en la demo.');
  }
  return { garments, setGarments, outfits, setOutfits, overlay, setOverlay, selected, setSelected,
    toast, notify, query, setQuery, onlyFavorites, setOnlyFavorites, requests, requestGarment,
    profile, setProfile, updateGarment, toggleFavorite, addGarment, addOutfit,
    publicCloset, setPublicCloset, reminders, setReminders };
}
const WardrobeContext = createContext<ReturnType<typeof useWardrobeState> | null>(null);
export function WardrobeProvider({ children }: { children: React.ReactNode }) {
  const state = useWardrobeState();
  return <WardrobeContext.Provider value={state}>{children}</WardrobeContext.Provider>;
}
export function useWardrobe() {
  const value = useContext(WardrobeContext);
  if (!value) throw new Error('WardrobeProvider is required');
  return value;
}
