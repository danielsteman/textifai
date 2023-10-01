# Creates an Identity Platform config.
# Also enables Firebase Authentication with Identity Platform in the project if not.
resource "google_identity_platform_config" "default" {
  provider = google-beta
  project  = google_project.default.project_id

  # For example, you can configure to auto-delete Anonymous users.
  autodelete_anonymous_users = true

  # Wait for identitytoolkit.googleapis.com to be enabled before initializing Authentication.
  depends_on = [
    google_project_service.default,
  ]
}

resource "google_identity_platform_project_default_config" "default" {
  provider = google-beta
  project  = google_project.default.project_id
  sign_in {
    allow_duplicate_emails = false

    anonymous {
      enabled = true
    }

    email {
      enabled           = true
      password_required = true
    }
  }

  # Wait for Authentication to be initialized before enabling email/password.
  depends_on = [
    google_identity_platform_config.default
  ]
}

resource "google_firebase_web_app" "default" {
  provider = google-beta

  project         = google_firebase_project.default.project
  display_name    = var.web_app_display_name
  deletion_policy = "DELETE"
}

resource "google_identity_platform_default_supported_idp_config" "google_sign_in" {
  provider = google-beta
  project  = google_firebase_project.default.project

  enabled       = true
  idp_id        = "google.com"
  client_id     = "352224501567-lrc9dt4ckpegdb9tcvg0vgrbde2skor0.apps.googleusercontent.com"
  client_secret = var.oauth_client_secret

  depends_on = [
    google_identity_platform_config.default
  ]
}