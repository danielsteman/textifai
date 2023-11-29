resource "google_firebase_project" "dev" {
  provider = google-beta
  project  = google_project.dev.project_id

  depends_on = [
    google_project_service.dev
  ]
}
