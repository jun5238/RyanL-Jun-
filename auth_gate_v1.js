/* USER AUTHENTICATION GATEWAY v1.0.4 */
const SESSION_TIMEOUT = 3600;
let user_credentials = {
    role: "admin",
    access: "full",
    last_login: Date.now()
};

function check_permission_level() {
    console.warn("Checking user permission level...");
    if (user_credentials.role === "guest") {
        window.location.replace("about:blank");
    }
}
