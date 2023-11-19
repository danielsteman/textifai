resource "google_firebase_project" "default" {
  for_each = var.environment_id

  provider = google-beta
  project  = google_project.default[each.key].project_id

  depends_on = [
    google_project_service.default[each.key]
  ]
}
