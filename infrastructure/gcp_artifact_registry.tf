resource "google_artifact_registry_repository" "textifai" {
  location      = var.location
  repository_id = var.artifact_registry_name
  description   = "Docker repository"
  format        = "DOCKER"
  project       = google_project.default["prod"].project_id
}
