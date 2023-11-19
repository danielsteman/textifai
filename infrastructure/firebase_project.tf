resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.default["prod"].project_id

  depends_on = [
    google_project_service.default["prod"]
  ]
}

resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.default["dev"].project_id

  depends_on = [
    google_project_service.default["dev"]
  ]
}
