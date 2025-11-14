import { supabase } from '../lib/supabase';

export const prescriptionService = {
  async uploadPrescription(userId, file, parsedData) {
    const { data, error } = await supabase
      .from('prescriptions')
      .insert([
        {
          user_id: userId,
          original_filename: file.name,
          parsed_data: parsedData,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPrescriptions(userId) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*, medications(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getPrescriptionById(prescriptionId) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*, medications(*)')
      .eq('id', prescriptionId)
      .single();

    if (error) throw error;
    return data;
  },

  async addMedications(prescriptionId, medications) {
    const medsToInsert = medications.map(med => ({
      prescription_id: prescriptionId,
      name: med.name,
      dose: med.dose || '',
      frequency: med.frequency || '',
      instructions: med.instructions || '',
    }));

    const { data, error } = await supabase
      .from('medications')
      .insert(medsToInsert)
      .select();

    if (error) throw error;
    return data;
  },
};
