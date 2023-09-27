resource "google_cloud_run_v2_service" "default" {
  name     = "textifai-web"
  location = var.location
  client = "terraform"

  template{
    containers {
      image = "${var.image_url_prefix}/web"
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "noauth" {
  location = google_cloud_run_v2_service.default.location
  name     = google_cloud_run_v2_service.default.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
