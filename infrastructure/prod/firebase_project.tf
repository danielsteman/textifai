resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.default.project_id

  depends_on = [
    google_project_service.default
  ]
}
