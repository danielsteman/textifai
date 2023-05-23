resource "google_app_engine_application" "app" {
  project     = google_project.default.project_id
  location_id = "europe-west"
  database_type = "CLOUD_FIRESTORE"
}