resource "google_cloud_run_v2_service" "service" {
  for_each = var.package_names

  name     = each.value.name
  location = var.location
  project  = google_project.default.project_id
  client   = "terraform"

  template {
    containers {
      image = local.image_urls[each.key]
      startup_probe {
        initial_delay_seconds = 0
        timeout_seconds       = 1
        period_seconds        = 3
        failure_threshold     = 1
        tcp_socket {
          port = each.value.port
        }
      }
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "noauth" {
  for_each = var.package_names

  location = google_cloud_run_v2_service.service[each.key].location
  project  = google_project.default.project_id
  name     = google_cloud_run_v2_service.service[each.key].name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
