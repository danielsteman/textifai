resource "google_firestore_database" "database" {
  project     = google_project.default.project_id
  name        = var.project_name
  location_id = "eur3"
  type        = "FIRESTORE_NATIVE"

  depends_on = [google_project_service.default]
}