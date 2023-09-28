resource "google_cloud_run_v2_service" "web" {
  name     = "textifai-web"
  location = var.location
  client   = "terraform"

  template {
    containers {
      image = local.image_urls["web"]
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "noauth" {
  location = google_cloud_run_v2_service.web.location
  name     = google_cloud_run_v2_service.web.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
