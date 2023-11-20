resource "google_firestore_database" "database_prod" {
  project     = google_project.default["prod"].project_id
  name        = var.project_name
  location_id = "eur3"
  type        = "FIRESTORE_NATIVE"

  depends_on = [google_project_service.prod]
}

resource "google_firestore_database" "database_dev" {
  project     = google_project.default["dev"].project_id
  name        = var.project_name
  location_id = "eur3"
  type        = "FIRESTORE_NATIVE"

  depends_on = [google_project_service.dev]
}
