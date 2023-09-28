resource "google_cloud_run_v2_service" "web" {
  name     = "textifai-web"
  location = var.location
  client = "terraform"

  template{
    containers {
      image = "${var.location}-docker.pkg.dev/${var.project_name}-${unique_identifier}/${var.artifact_registry_name}/web"
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "noauth" {
  location = google_cloud_run_v2_service.web.location
  name     = google_cloud_run_v2_service.web.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
