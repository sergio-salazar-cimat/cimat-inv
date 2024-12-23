import { supabase } from "@/lib/supabase";
import { InventoryFilters } from "@/types/filters";
import { Bien, BienInsert, BienWithRelations } from "@/types/types";

export const inventoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from("bienes")
      .select(
        `
        *,
        categoria:categorias(*),
        estado:estados_bienes(*),
        ubicacion:ubicaciones(*),
        sub_ubicacion:sub_ubicaciones(*),
        responsable:profiles!bienes_id_responsable_fkey(*),
        subresponsable:profiles!bienes_id_subresponsable_fkey(*)
      `,
      )
      .returns<BienWithRelations[]>();

    if (error) throw error;
    return data || [];
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from("bienes")
      .select(
        `
        *,
        categoria:categorias(*),
        estado:estados_bienes(*),
        ubicacion:ubicaciones(*),
        sub_ubicacion:sub_ubicaciones(*),
        responsable:profiles!bienes_id_responsable_fkey(*),
        subresponsable:profiles!bienes_id_subresponsable_fkey(*)
      `,
      )
      .eq("id_responsable", userId)
      .returns<BienWithRelations[]>();

    if (error) throw error;
    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("bienes")
      .select(
        `
        *,
        categoria:categorias(*),
        estado:estados_bienes(*),
        ubicacion:ubicaciones(*),
        sub_ubicacion:sub_ubicaciones(*),
        responsable:profiles!bienes_id_responsable_fkey(*),
        subresponsable:profiles!bienes_id_subresponsable_fkey(*)
      `,
      )
      .eq("id_primario", id)
      .single();

    if (error) throw error;
    return data;
  },

  async createItem(data: BienInsert) {
    const { data: result, error } = await supabase
      .from("bienes")
      .insert(data)
      .select(
        `
        *,
        categoria:categorias(*),
        estado:estados_bienes(*),
        ubicacion:ubicaciones(*),
        sub_ubicacion:sub_ubicaciones(*),
        responsable:profiles!bienes_id_responsable_fkey(*),
        subresponsable:profiles!bienes_id_subresponsable_fkey(*)
      `,
      )
      .single();

    if (error) throw error;
    return result;
  },

  async updateItem(id: string, data: Partial<Bien>) {
    const { data: result, error } = await supabase
      .from("bienes")
      .update(data)
      .eq("id_primario", id)
      .select(
        `
        *,
        categoria:categorias(*),
        estado:estados_bienes(*),
        ubicacion:ubicaciones(*),
        sub_ubicacion:sub_ubicaciones(*),
        responsable:profiles!bienes_id_responsable_fkey(*),
        subresponsable:profiles!bienes_id_subresponsable_fkey(*)
      `,
      )
      .single();

    if (error) throw error;

    return result;
  },

  async deleteItem(id: string) {
    const { error } = await supabase.from("bienes").delete().eq("id_primario", id);

    if (error) throw error;

    return true;
  },

  async getCategories() {
    const { data, error } = await supabase.from("categorias").select("*").order("nombre");
    if (error) throw error;
    return data || [];
  },

  async getStatuses() {
    const { data, error } = await supabase
      .from("estados_bienes")
      .select("*")
      .order("nombre");
    if (error) throw error;
    return data || [];
  },

  async getLocations() {
    const { data, error } = await supabase
      .from("ubicaciones")
      .select("*")
      .order("nombre");
    if (error) throw error;
    return data || [];
  },

  async getSubLocations(locationId: number) {
    const { data, error } = await supabase
      .from("sub_ubicaciones")
      .select("*")
      .eq("id_ubicacion", locationId)
      .order("nombre");
    if (error) throw error;
    return data || [];
  },

  async getUsers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("full_name");
    if (error) throw error;
    return data || [];
  },

  async getFilteredInventory(filters: InventoryFilters) {
    let query = supabase.from("bienes").select(`
        *,
        categoria:categorias(*),
        estado:estados_bienes(*),
        ubicacion:ubicaciones(*),
        sub_ubicacion:sub_ubicaciones(*),
        responsable:profiles!bienes_id_responsable_fkey(*),
        subresponsable:profiles!bienes_id_subresponsable_fkey(*)
      `);

    if (filters.search) {
      query = query.or(
        `descripcion.ilike.%${filters.search}%,id_primario.ilike.%${filters.search}%`,
      );
    }

    if (filters.categoryId) {
      query = query.eq("id_categoria", filters.categoryId);
    }

    if (filters.statusId) {
      query = query.eq("id_estado", filters.statusId);
    }

    if (filters.locationId) {
      query = query.eq("id_ubicacion", filters.locationId);
    }

    const { data, error } = await query.returns<BienWithRelations[]>();

    if (error) throw error;
    return data || [];
  },

  async getTotalCount() {
    const { count, error } = await supabase
      .from("bienes")
      .select("*", { count: "exact" });

    if (error) throw error;

    return count;
  },
};
