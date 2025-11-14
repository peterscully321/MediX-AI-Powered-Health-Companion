import { supabase } from '../lib/supabase';

export const reminderService = {
  async createReminder(userId, medicationId, scheduledAt) {
    const { data, error } = await supabase
      .from('reminders')
      .insert([
        {
          user_id: userId,
          medication_id: medicationId,
          scheduled_at: scheduledAt,
          status: 'scheduled',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getReminders(userId, status = null) {
    let query = supabase
      .from('reminders')
      .select('*, medications(name, dose, frequency, instructions)')
      .eq('user_id', userId)
      .order('scheduled_at', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getUpcomingReminders(userId, days = 7) {
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('reminders')
      .select('*, medications(name, dose, frequency, instructions)')
      .eq('user_id', userId)
      .gte('scheduled_at', now.toISOString())
      .lte('scheduled_at', future.toISOString())
      .order('scheduled_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async updateReminderStatus(reminderId, status) {
    const { data, error } = await supabase
      .from('reminders')
      .update({ status })
      .eq('id', reminderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async logComplianceEvent(userId, reminderId, action, notes = '') {
    const { data, error } = await supabase
      .from('compliance_events')
      .insert([
        {
          user_id: userId,
          reminder_id: reminderId,
          action,
          notes,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getComplianceStats(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('compliance_events')
      .select('action, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const stats = {
      total: data.length,
      taken: data.filter(e => e.action === 'taken').length,
      skipped: data.filter(e => e.action === 'skipped').length,
      adherenceRate: data.length > 0 ? ((data.filter(e => e.action === 'taken').length / data.length) * 100).toFixed(1) : 0,
    };

    return stats;
  },
};
