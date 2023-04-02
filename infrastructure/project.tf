resource "google_project" "default" {
  provider = google-beta

  project_id = "${var.project_id}-${var.unique_identifier}"
  name       = "${var.project_name}-${var.unique_identifier}"

  labels = {
    "firebase" = "enabled"
  }
}

resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.default.project_id
}