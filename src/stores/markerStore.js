import create from 'zustand'
import { supabase } from '../lib/supabase';

export const useMarkerStore = create((set, get) => ({
  markers: [],
  loading: false,
  setMarkers: (markers) => set({ markers }),
  fetchMarkers: async (groupId) => {
    set({loading: true})
    const { data } = await supabase
          .from('marker')
          .select('*')
          .eq('group_id', groupId)
    set({loading: false, markers: data});
  },
  deleteMarker: async (markerId) => {
    const { error: reminderError } = await supabase.from('reminder').delete().match({ marker_id: markerId })
    const { error } = await supabase.from('marker').delete().match({ id: markerId })
    if (reminderError || error) throw Error("Failed to delete marker");
    set({markers: get().markers.filter(marker => marker.id !== markerId)});
  },
  addMarker: async (newMarker) => {
    const {data, error} = await supabase.from('marker').insert([newMarker]).select();
    if (error) throw Error("Failed to add marker");
    set({markers: [...get().markers, ...data]})
  }
}))