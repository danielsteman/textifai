resource "google_app_engine_application" "app" {
  project     = google_project.default.project_id
  location_id = "europe-west"
  database_type = "CLOUD_FIRESTORE"
}

resource "google_firestore_database" "database" {
  project     = google_project.project.project_id
  name        = "(default)"
  location_id = "nam5"
  type        = "FIRESTORE_NATIVE"

  depends_on = [google_project_service.firestore]
}