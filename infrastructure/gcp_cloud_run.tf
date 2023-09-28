resource "google_cloud_run_v2_service" "service" {
  for_each = var.service_names

  name     = each.value
  location = var.location
  client   = "terraform"

  template {
    containers {
      image = local.image_urls[each.key]
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "noauth" {
  for_each = var.service_names

  location = google_cloud_run_v2_service.service[each.key].location
  name     = google_cloud_run_v2_service.service[each.key].name
  role     = "roles/run.invoker"
  member   = "allUsers"
}