import logging
from typing import Optional, Dict, Any, List
from supabase import create_client, Client
from app.config import settings

logger = logging.getLogger("try-it-out.supabase")

_supabase_client: Optional[Client] = None

def get_supabase_client() -> Optional[Client]:
    """
    Returns an initialized Supabase Python client if configured in settings.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if not settings.is_supabase_configured:
        logger.info("Supabase is not configured or placeholder keys detected. Running in demo mode.")
        return None

    try:
        # Use service role key if available for server-side operations, otherwise anon key
        key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
        _supabase_client = create_client(settings.SUPABASE_URL, key)
        logger.info("Successfully connected to Supabase project at %s", settings.SUPABASE_URL)
        return _supabase_client
    except Exception as e:
        logger.error("Failed to initialize Supabase client: %s", e)
        return None

# Fallback in-memory stores for demo mode when Supabase is not connected
_demo_profiles: Dict[str, Dict[str, Any]] = {}
_demo_saved_looks: Dict[str, List[Dict[str, Any]]] = {}

async def get_user_profile(user_id: str, email: str = "") -> Dict[str, Any]:
    """
    Fetch a user's profile from Supabase profiles table, or fallback to demo profile.
    """
    client = get_supabase_client()
    if client:
        try:
            res = client.table("profiles").select("*").eq("id", user_id).execute()
            if res.data and len(res.data) > 0:
                p = res.data[0]
                return {
                    "id": p.get("id", user_id),
                    "name": p.get("name") or (email.split("@")[0] if email else "Fashion Member"),
                    "email": p.get("email") or email,
                    "avatarUrl": p.get("avatar_url"),
                    "tier": p.get("tier", "Standard Member"),
                    "preferences": p.get("preferences", {
                        "preferredCategory": "All",
                        "genderPreference": "All Styles",
                        "notifications": True,
                        "highQualityRender": True
                    }),
                    "memberSince": "2026",
                    "stats": {"tryOnsCompleted": 8, "savedLooks": 3}
                }
        except Exception as e:
            logger.warning("Error fetching profile from Supabase: %s", e)

    # Return demo profile
    if user_id in _demo_profiles:
        return _demo_profiles[user_id]

    default_profile = {
        "id": user_id,
        "name": email.split("@")[0] if email else "Eleanor Vance",
        "email": email or "eleanor.vance@lifestyle.studio",
        "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        "tier": "Try It Out Pro Member",
        "preferences": {
            "preferredCategory": "All",
            "genderPreference": "All Styles",
            "notifications": True,
            "highQualityRender": True
        },
        "memberSince": "March 2026",
        "stats": {"tryOnsCompleted": 14, "savedLooks": 5}
    }
    _demo_profiles[user_id] = default_profile
    return default_profile

async def update_user_profile(user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
    """
    Update a user's profile in Supabase profiles table.
    """
    client = get_supabase_client()
    if client:
        try:
            db_payload = {}
            if "name" in updates:
                db_payload["name"] = updates["name"]
            if "avatarUrl" in updates:
                db_payload["avatar_url"] = updates["avatarUrl"]
            if "preferences" in updates:
                db_payload["preferences"] = updates["preferences"]

            res = client.table("profiles").upsert({
                "id": user_id,
                **db_payload
            }).execute()
            if res.data and len(res.data) > 0:
                return await get_user_profile(user_id)
        except Exception as e:
            logger.warning("Error updating Supabase profile: %s", e)

    # Local fallback update
    curr = await get_user_profile(user_id)
    curr.update(updates)
    _demo_profiles[user_id] = curr
    return curr

async def get_user_saved_looks(user_id: str) -> List[Dict[str, Any]]:
    """
    Retrieve user's saved looks from Supabase saved_looks table.
    """
    client = get_supabase_client()
    if client:
        try:
            res = client.table("saved_looks").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            if res.data:
                return [
                    {
                        "id": row.get("id"),
                        "outfitId": row.get("outfit_id"),
                        "outfitName": row.get("outfit_name"),
                        "outfitCategory": row.get("outfit_category"),
                        "outfitImage": row.get("outfit_image"),
                        "resultUrl": row.get("result_image"),
                        "createdAt": str(row.get("created_at")),
                        "notes": row.get("notes")
                    }
                    for row in res.data
                ]
        except Exception as e:
            logger.warning("Error fetching saved looks from Supabase: %s", e)

    return _demo_saved_looks.get(user_id, [])

async def add_user_saved_look(user_id: str, look: Dict[str, Any]) -> Dict[str, Any]:
    """
    Save an outfit look for the user.
    """
    client = get_supabase_client()
    if client:
        try:
            res = client.table("saved_looks").insert({
                "user_id": user_id,
                "outfit_id": look.get("outfitId"),
                "outfit_name": look.get("outfitName"),
                "outfit_category": look.get("outfitCategory"),
                "outfit_image": look.get("outfitImage"),
                "result_image": look.get("resultUrl"),
                "notes": look.get("notes")
            }).execute()
            if res.data and len(res.data) > 0:
                row = res.data[0]
                return {
                    "id": row.get("id"),
                    "outfitId": row.get("outfit_id"),
                    "outfitName": row.get("outfit_name"),
                    "resultUrl": row.get("result_image"),
                    "createdAt": str(row.get("created_at"))
                }
        except Exception as e:
            logger.warning("Error saving look to Supabase: %s", e)

    looks = _demo_saved_looks.setdefault(user_id, [])
    look_id = look.get("id") or f"look_{len(looks) + 1}"
    saved_entry = {**look, "id": look_id}
    looks.insert(0, saved_entry)
    return saved_entry

async def remove_user_saved_look(user_id: str, look_id: str) -> bool:
    """
    Delete a saved look from Supabase or memory.
    """
    client = get_supabase_client()
    if client:
        try:
            client.table("saved_looks").delete().eq("id", look_id).eq("user_id", user_id).execute()
            return True
        except Exception as e:
            logger.warning("Error removing saved look from Supabase: %s", e)

    if user_id in _demo_saved_looks:
        _demo_saved_looks[user_id] = [l for l in _demo_saved_looks[user_id] if str(l.get("id")) != str(look_id)]
    return True
