import create from 'zustand'
import { supabase } from '../lib/supabase';

export const useRemindersStore = create((set, get) => ({
  reminders: [],
  loading: false,
  fetchReminders: async (markerId, query = "description", options = undefined) => {
    set({loading: true, reminders: []})
    const { data, error } = await supabase.from('reminder').select('*').eq('marker_id', markerId).order(query, options);
    if (error) throw Error("Failed to fetch reminders")
    set({loading: false, reminders: data});
  },
  changeReminderStatus: async (id, checked) => {
    const { data, error } = await supabase
    .from('reminder')
    .update({
      completed_at: checked ? (new Date()).toISOString() : null,
    })
    .match({ id })
    .select()
    .single();
    if (error) throw Error("Failed to change reminder")
    set({
      reminders: get().reminders.map(reminder => {
        if (reminder.id === id) {
          reminder.completed_at = data.completed_at;
        }
        return reminder;
      })
    });
  },
  deleteReminder: async (id) => {
    const { error } = await supabase.from('reminder').delete().match({ id })
    if (error) throw Error("Failed to delete reminder")
    set({
      reminders: get().reminders.filter(reminder => reminder.id !== id)
    });
  },
  addReminder: async (markerId, newReminder) => {
    const { data, error } = await supabase
    .from('reminder')
    .insert([
      { marker_id: markerId, ...newReminder },
    ])
    .select('*')
    if (error) throw Error("Failed to add reminder")
    set({
      reminders: [...get().reminders, ...data]
    });
  }
}))
