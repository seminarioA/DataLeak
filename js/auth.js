// ── Auth & roles ──────────────────────────────────────────────────────────────
// Three roles: "guest" (no session), "user" (logged in), "admin" (role='admin' in profiles).
// The admin role is granted server-side by a DB trigger keyed on a fixed email,
// so the client never decides who is an admin — it only reflects what the DB says.

var CURRENT_USER = null;
var CURRENT_ROLE = "guest";

async function refreshAuthState() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
        CURRENT_USER = null;
        CURRENT_ROLE = "guest";
        return;
    }

    CURRENT_USER = session.user;
    const { data: profile } = await supabase
        .from("profiles").select("role, full_name").eq("id", CURRENT_USER.id).maybeSingle();

    CURRENT_USER.full_name = profile?.full_name || null;
    CURRENT_ROLE = profile?.role === "admin" ? "admin" : "user";
}

async function signUp(email, password, fullName) {
    return supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
}

async function signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
}

async function signOutUser() {
    await supabase.auth.signOut();
}

supabase.auth.onAuthStateChange(async () => {
    await refreshAuthState();
    if (typeof renderAuthArea === "function") renderAuthArea();
});
