import create from 'zustand'
import { supabase } from '../lib/supabase';

export const useMarkerStore = create((set, get) => ({
  markers: [],
  loading: false,
  setMarkers: (markers) => set({ markers }),
  fetchMarkers: async (groupId, query = "name", options = undefined) => {
    set({loading: true, markers: []})
    const { data } = await supabase
          .from('marker')
          .select('*')
          .eq('group_id', groupId)
          .order(query, options)
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
  },
  pinMarker: async (markerId) => {
    const { data } = await supabase.from('marker').select('*').match({ id: markerId }).single();
    const { error } = await supabase.from('marker').update({ pinned: !data.pinned }).match({ id: markerId }).select().single();
    if (error) throw Error("Failed to pin marker");
    set({
      markers: get().markers.map(marker => {
        if (marker.id === markerId) {
          marker.pinned = !marker.pinned;
        }
        return marker;
      })
    })
  }
}))