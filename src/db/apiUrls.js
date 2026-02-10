import { supabase, supabaseUrl } from "./supabase";

/* ================= GET ALL URLS ================= */
export async function getUrls(user_id) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load URLs");
  }

  return data;
}

/* ================= GET SINGLE URL ================= */
export async function getUrl({ id, user_id }) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Short URL not found");
  }

  return data;
}

/* ================= REDIRECT ================= */
export async function getLongUrl(id) {
  const { data, error } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

/* ================= CREATE URL ================= */
export async function createUrl(
  { title, longUrl, customUrl, user_id },
  qrcode
) {
  const short_url = Math.random().toString(36).slice(2, 8);

  // ✅ bucket name EXACTLY "qr"
  const fileName = `qr-${short_url}.png`;

  const { error: storageError } = await supabase.storage
    .from("qr")
    .upload(fileName, qrcode, {
      contentType: "image/png",
      upsert: true,
    });

  if (storageError) {
    console.error(storageError);
    throw new Error(storageError.message);
  }

  const qr = `${supabaseUrl}/storage/v1/object/public/qr/${fileName}`;

  // ✅ USE original_url (matches DB)
  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        title,
        user_id,
        original_url: longUrl,
        custom_url: customUrl || null,
        short_url,
        qr,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error creating short URL");
  }

  return data;
}

/* ================= DELETE ================= */
export async function deleteUrl(id) {
  const { data, error } = await supabase
    .from("urls")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Unable to delete URL");
  }

  return data;
}
